import { parseArgs } from 'node:util';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function options(args) {
  const {values,positionals} = parseArgs({args,allowPositionals:true,options:{
    out:{type:'string',default:'ui-inspection'},widths:{type:'string',default:'1440,768,390'},
    height:{type:'string',default:'900'},tabs:{type:'string',default:'25'},wait:{type:'string',default:'1500'},
    timeout:{type:'string',default:'5000'},'data-screen':{type:'boolean'},json:{type:'boolean'},
    'storage-state':{type:'string'},mock:{type:'string'},rules:{type:'string'},compare:{type:'string'},
    'color-scheme':{type:'string',default:'light'},states:{type:'string',default:'default'},
    'reduced-motion':{type:'string',default:'no-preference'},ready:{type:'string'},expect:{type:'string'},
    'fail-on-findings':{type:'boolean'},'full-page':{type:'boolean'},help:{type:'boolean'},
  }});
  if(values.help) return {help:true};
  if(!positionals.length) throw Error('Provide at least one http(s) or file:// URL');
  for(const url of positionals) if(!['http:','https:','file:'].includes(new URL(url).protocol)) throw Error('URL must use http(s) or file://');
  const list=value=>[...new Set(value.split(',').map(x=>x.trim()))];
  const widths=[...new Set(list(values.widths).map(Number))];
  if(widths.some(n=>!Number.isInteger(n)||n<1||n>10000)) throw Error('widths must be integers from 1 to 10000');
  for(const key of ['height','tabs','wait','timeout']) {
    values[key]=Number(values[key]);
    if(!Number.isInteger(values[key])||values[key]<0||(key==='height'||key==='timeout')&&values[key]===0) throw Error(`${key} must be a valid integer`);
  }
  const themes=list(values['color-scheme']),states=list(values.states),motions=list(values['reduced-motion']);
  if(themes.some(x=>!['light','dark'].includes(x))) throw Error('color-scheme must be light,dark');
  if(motions.some(x=>!['reduce','no-preference'].includes(x))) throw Error('reduced-motion must be reduce,no-preference');
  if(states.some(x=>!/^\w[\w-]*$/.test(x))) throw Error('Invalid state name');
  const mock=values.mock?await import(pathToFileURL(resolve(values.mock)).href):null;
  if(mock&&typeof mock.default!=='function') throw Error('mock must export default async function({page, context, state, ...})');
  for(const state of states) if(state!=='default'&&(!mock?.states?.[state]?.expect)) throw Error(`Mock must declare states.${state}.expect to prove the requested state`);
  for(const entry of Object.values(mock?.states||{})) {
    if(entry.captureAfter!==undefined&&(!Number.isFinite(entry.captureAfter)||entry.captureAfter<0)) throw Error('captureAfter must be a nonnegative number');
    if(entry.expect!==undefined&&typeof entry.expect!=='string') throw Error('state expect must be a selector');
  }
  const rules=values.rules?JSON.parse(readFileSync(resolve(values.rules),'utf8')):{version:1,rules:[]};
  if(rules.version!==1||!Array.isArray(rules.rules)) throw Error('rules require version:1 and rules:[]');
  const properties=['fontFamily','minFontSize','minTargetSize','radii','colors','backgroundColors','borderColors','required'];
  for(const rule of rules.rules) {
    if(typeof rule.selector!=='string'||!rule.selector) throw Error('Every rule requires a selector');
    for(const key of Object.keys(rule)) {
      if(key!=='selector'&&!properties.includes(key)) throw Error(`Unknown rule property ${key}`);
      if(['fontFamily','radii','colors','backgroundColors','borderColors'].includes(key)&&(!Array.isArray(rule[key])||!rule[key].length||rule[key].some(x=>typeof x!=='string'))) throw Error(`${key} must be a nonempty string array`);
      if(['minFontSize','minTargetSize'].includes(key)&&(!Number.isFinite(rule[key])||rule[key]<0)) throw Error(`${key} must be nonnegative`);
      if(key==='required'&&typeof rule[key]!=='boolean') throw Error('required must be boolean');
    }
  }
  const limits=['maxFontSizes','maxColors','maxRadii','maxShadows','maxDuration'];
  for(const [key,value] of Object.entries(rules.consistency||{})) if(!limits.includes(key)||!Number.isFinite(value)||value<0) throw Error(`Invalid consistency limit ${key}`);
  // Validate paths now; never print the contents of authentication state.
  if(values['storage-state']) {
    try {JSON.parse(readFileSync(resolve(values['storage-state']),'utf8'));}
    catch {throw Error('storage-state must be a readable JSON file');}
  }
  if(values.compare&&resolve(values.compare)===resolve(values.out))throw Error('compare and out must be different folders to preserve before screenshots');
  const previous=values.compare?JSON.parse(readFileSync(join(resolve(values.compare),'report.json'),'utf8')):null;
  return {...values,urls:positionals,widths,themes,states,motions,mock,rules,previous,outDir:resolve(values.out)};
}

// Runs in the browser; keep this closure independent of Node modules.
// ponytail: DOM heuristics cannot prove route semantics; require project selectors and visual review.
export async function inspectExtras(page,rules) {
  return page.evaluate(rules=>{
    const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>0};
    const elements=[...document.querySelectorAll('body *')].filter(visible);
    const describe=el=>`${el.tagName.toLowerCase()}${el.id?'#'+el.id:''}${typeof el.className==='string'&&el.className.trim()?'.'+el.className.trim().split(/\s+/).slice(0,2).join('.'):''}`;
    const main=document.querySelector('main,[role="main"]')||document.body;
    const mainText=main.innerText.trim();
    const meaningful=[...main.querySelectorAll('button,input,select,textarea,img,canvas,svg,[role="progressbar"],[aria-busy="true"]')].filter(visible);
    const blank=mainText.length<12&&meaningful.length===0;
    const truncated=elements.filter(el=>{
      const s=getComputedStyle(el);
      return (s.textOverflow==='ellipsis'||Number(s.webkitLineClamp)>0)&&(el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1)&&el.textContent.trim();
    }).map(el=>({element:describe(el),text:el.textContent.trim().slice(0,160),scroll_width:el.scrollWidth,client_width:el.clientWidth}));
    const ctaWrap=elements.filter(el=>el.matches('button,[role="button"],a[data-cta],input[type="submit"]')).flatMap(el=>{
      const tops=new Set();
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      let node;
      while(node=walker.nextNode()) if(node.textContent.trim()) {
        const range=document.createRange();range.selectNodeContents(node);
        for(const rect of range.getClientRects()) if(rect.width>0) tops.add(Math.round(rect.top));
      }
      return tops.size>1?[{element:describe(el),lines:tops.size}]:[];
    });
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const canonical=color=>{if(!CSS.supports('color',color)||color.includes('var('))throw Error(`Unsupported rule color: ${color}`);ctx.clearRect(0,0,1,1);ctx.fillStyle='#000';ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].join(',')};
    const violations=[],coverage=[];
    for(const rule of rules.rules) {
      const matched=[...document.querySelectorAll(rule.selector)].filter(visible);
      coverage.push({selector:rule.selector,visible_matches:matched.length});
      if(rule.required&&!matched.length) violations.push({element:rule.selector,property:'required',actual:0,expected:1});
      for(const el of matched) {
        const s=getComputedStyle(el),r=el.getBoundingClientRect();
        const fail=(property,actual,expected)=>violations.push({element:describe(el),property,actual,expected});
        if(rule.fontFamily) {
          const family=s.fontFamily.split(',')[0].replace(/["']/g,'').trim().toLowerCase();
          if(!rule.fontFamily.some(x=>x.toLowerCase()===family))fail('fontFamily',s.fontFamily,rule.fontFamily);
        }
        if(rule.minFontSize&&parseFloat(s.fontSize)<rule.minFontSize)fail('minFontSize',s.fontSize,rule.minFontSize);
        if(rule.minTargetSize&&(r.width<rule.minTargetSize||r.height<rule.minTargetSize))fail('minTargetSize',`${r.width}x${r.height}`,rule.minTargetSize);
        for(const [property,css] of [['colors','color'],['backgroundColors','backgroundColor']])
          if(rule[property]&&!rule[property].some(x=>canonical(x)===canonical(s[css])))fail(property,s[css],rule[property]);
        if(rule.borderColors)for(const side of ['Top','Right','Bottom','Left'])
          if(parseFloat(s[`border${side}Width`])>0&&!rule.borderColors.some(x=>canonical(x)===canonical(s[`border${side}Color`])))fail('borderColors',s[`border${side}Color`],rule.borderColors);
        if(rule.radii) for(const corner of ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'])
          if(!rule.radii.includes(s[corner]))fail('radii',s[corner],rule.radii);
      }
    }
    const sizes=new Set(),colors=new Set(),radii=new Set(),shadows=new Set();
    const durations=[],layoutMotion=[],reduced=[];
    const ms=value=>value.split(',').map(x=>parseFloat(x)*(x.trim().endsWith('ms')?1:1000));
    const max=rules.consistency?.maxDuration??500;
    for(const el of elements) {
      const s=getComputedStyle(el);
      if([...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))sizes.add(s.fontSize);
      for(const color of [s.color,s.backgroundColor,...['Top','Right','Bottom','Left'].filter(side=>parseFloat(s[`border${side}Width`])>0).map(side=>s[`border${side}Color`])]) if(canonical(color)!=='0,0,0,0')colors.add(canonical(color));
      for(const corner of ['TopLeft','TopRight','BottomLeft','BottomRight'])if(s[`border${corner}Radius`]!=='0px')radii.add(s[`border${corner}Radius`]);
      if(s.boxShadow!=='none')shadows.add(s.boxShadow);
      if(ms(s.transitionDuration).some(n=>n>max))durations.push({element:describe(el),kind:'transition',duration:s.transitionDuration});
      if(s.animationName!=='none'&&ms(s.animationDuration).some(n=>n>max))durations.push({element:describe(el),kind:'animation',duration:s.animationDuration});
      const props=s.transitionProperty.split(',').map(x=>x.trim());
      if(ms(s.transitionDuration).some(n=>n>0)&&props.some(p=>['all','width','height','top','left','right','bottom','margin','padding'].includes(p)))layoutMotion.push({element:describe(el),kind:'transition',properties:props});
    }
    for(const animation of document.getAnimations()) {
      if(animation.playState!=='running'||!animation.effect?.target||!visible(animation.effect.target))continue;
      const props=[...new Set(animation.effect.getKeyframes().flatMap(frame=>Object.keys(frame)))].filter(p=>!['offset','computedOffset','easing','composite'].includes(p));
      const item={element:describe(animation.effect.target),properties:props};
      if(props.some(p=>['width','height','top','left','right','bottom','margin','padding'].includes(p)))layoutMotion.push({...item,kind:'animation'});
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)reduced.push(item);
    }
    const consistency={font_sizes:[...sizes],colors:[...colors],radii:[...radii],shadows:[...shadows]};
    const defaults={maxFontSizes:6,maxColors:12,maxRadii:6,maxShadows:4};
    const warnings=[];
    for(const [key,limit] of Object.entries({...defaults,...rules.consistency})) {
      const metric={maxFontSizes:'font_sizes',maxColors:'colors',maxRadii:'radii',maxShadows:'shadows'}[key];
      if(metric&&consistency[metric].length>limit)warnings.push(`${metric}: ${consistency[metric].length} > ${limit}`);
    }
    return {blank,main_text:mainText.slice(0,50000),truncated,cta_wrap:ctaWrap,rule_violations:violations,rule_coverage:coverage,consistency,consistency_warnings:warnings,motion_durations:durations,motion_layout:layoutMotion,motion_reduced:reduced};
  },rules);
}

const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localImage=path=>`data:image/jpeg;base64,${readFileSync(path).toString('base64')}`;
export async function compareScreenshot(page,run,previous,outDir,previousDir) {
  const old=previous.runs.find(r=>r.width===run.width&&(r.color_scheme||'light')===run.color_scheme&&(r.state||'default')===run.state&&(r.reduced_motion||'no-preference')===run.reduced_motion&&(r.url||previous.url)===run.url&&!r.error);
  if(!old) {run.comparison_missing='No matching route/theme/state/width/motion in previous report';return;}
  const path=existsSync(old.screenshot)?old.screenshot:join(resolve(previousDir),old.screenshot.split(/[\\/]/).pop());
  if(!existsSync(path))throw Error('Previous screenshot is unavailable');
  const comparison=await page.context().newPage();
  try {
    await comparison.setViewportSize({width:run.width*2,height:run.height+44});
    await comparison.setContent(`<style>body{margin:0;background:#eee;font:14px Arial}header{height:44px;display:flex;align-items:center}header b{width:50%;padding-left:12px}section{display:flex}img{width:50%;height:auto;align-self:flex-start}</style><header><b>Antes</b><b>Depois</b></header><section><img src="${localImage(path)}"><img src="${localImage(run.screenshot)}"></section>`);
    await comparison.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
    run.comparison=join(outDir,`compare-${run.key}.jpg`);
    await comparison.screenshot({path:run.comparison,type:'jpeg',quality:85,fullPage:true});
  } finally {await comparison.close();}
}
export function writeGallery(report,outDir) {
  const cards=report.runs.map(run=>{
    const label=`${run.url} · ${run.width}px · ${run.color_scheme} · ${run.state} · ${run.reduced_motion}`;
    return `<article><h2>${escape(label)}</h2>${run.screenshot?`<a href="${escape(relative(outDir,run.screenshot).replaceAll('\\','/'))}"><img alt="${escape(label)}" loading="lazy" src="${escape(relative(outDir,run.screenshot).replaceAll('\\','/'))}"></a>`:''}<p>${escape(run.error||run.findings.join('; ')||'Sem achados automáticos. Revisão visual ainda necessária.')}</p>${run.comparison?`<a href="${escape(relative(outDir,run.comparison).replaceAll('\\','/'))}">Antes e depois</a>`:''}</article>`;
  }).join('');
  writeFileSync(join(outDir,'index.html'),`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Matriz de inspeção</title><style>body{font:14px system-ui;margin:24px;background:#fafafa;color:#111}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}h2{font-size:14px;overflow-wrap:anywhere}img{max-width:100%}article{padding:16px;border:1px solid #888}a{color:#174ea6}</style><h1>Matriz de inspeção</h1><main>${cards}</main></html>`);
}
