import { readFileSync } from 'node:fs';
export const states = {
  default: { expect: '[data-state="loaded"]' },
  loading: { expect: '#result:not([data-state])', captureAfter: 20 },
  empty: { expect: '[data-state="empty"]' },
  error: { expect: '[data-state="error"]' },
  long: { expect: '[data-state="loaded"]' },
};
export default async function ({ page, context, state }) {
  await page.route('**/api/records', async route => {
    if(state==='loading') { await new Promise(r=>setTimeout(r,2500)); if(page.isClosed())return; }
    await route.fulfill({status:state==='error'?500:200,json:state==='empty'?[]:[{name:state==='long'?'Profissional com nome muito longo '.repeat(8):'Profissional Marina'}]}).catch(error=>{if(!page.isClosed())throw error});
  });
  await page.route('**/console/**', async route => {
    const cookies = await context.cookies();
    const html = cookies.some(c=>c.name==='fixture-session')
      ? readFileSync(new URL('./inspect-modern.html',import.meta.url),'utf8')
      : '<main><h1>Entrar na conta</h1><label>Usuário<input></label></main>';
    await route.fulfill({contentType:'text/html',body:html});
  });
}
