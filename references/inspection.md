# Inspeção em aplicação real

Use o inspector compartilhado; mantenha no projeto apenas sessão, mock e regras. A instalação do Playwright é descoberta na pasta atual, acima da skill, em `PLAYWRIGHT_HOME` ou no npm global. Execute `--help` antes de concluir que o ambiente está ausente. Falha ao iniciar Chromium exige instalar o navegador correspondente ao Playwright encontrado.

## Sessão e montagem

```sh
node <skill-dir>/scripts/inspect-ui.mjs http://localhost:3000/console/profissionais \
  --storage-state playwright/.auth/user.json --ready main --expect '[data-page="profissionais"]' \
  --color-scheme light,dark --widths 1440,768,390,320 --rules ui-rules.json --out proof/after
```

Exporte uma sessão de teste pelo harness do projeto (`context.storageState({path})`). Cookies e localStorage são restaurados pelo Playwright; sessionStorage requer `context.addInitScript` no mock. Não salve credenciais no relatório nem versione o arquivo de sessão. A referência oficial é [autenticação do Playwright](https://playwright.dev/docs/auth).

`--ready` espera um seletor visível antes da captura. `--expect` comprova o conteúdo da rota, para detectar redirecionamento ao login. `blank` detecta região principal quase vazia; `route-duplicate` compara conteúdo principal em múltiplas URLs dentro da mesma matriz. Duplicação é sinal para revisão: telas legitimamente iguais podem ter o mesmo hash. Uma rota logada precisa de um seletor próprio; ausência de achados não comprova autenticação.

## Mock e estados

Um arquivo local `.mjs` exporta `default async function({page, context, url, width, height, state, colorScheme, reducedMotion})`. O hook roda antes da navegação; pode instalar `page.route`, `context.addInitScript` e cookies de teste. Não importe código de catálogo sem inspeção: esse módulo executa Node com as permissões do processo.

```js
export const states = {
  default: { expect: '[data-state="loaded"]' },
  loading: { expect: '[aria-busy="true"]', captureAfter: 350 },
  empty: { expect: '[data-state="empty"]' },
  error: { expect: '[data-state="error"]' },
  long: { expect: '[data-state="loaded"]' },
};

export default async function ({page, state}) {
  await page.route('**/api/profissionais', async route => {
    if (state === 'loading') {
      await new Promise(resolve => setTimeout(resolve, 10000));
      if (page.isClosed()) return;
    }
    await route.fulfill({
      status: state === 'error' ? 500 : 200,
      json: state === 'empty' ? [] : [{id: 1, nome: state === 'long' ? 'Nome longo representativo do produto' : 'Marina'}],
    });
  });
}
```

Adapte endpoint, formato e seletores ao contrato real. O inspector não pode deduzir qual coleção esvaziar nem trocar qualquer resposta por 500. Mock intercepta só o endpoint escolhido; não transforma tráfego de produção. Referência: [Mock APIs do Playwright](https://playwright.dev/docs/mock).

```sh
node <skill-dir>/scripts/inspect-ui.mjs http://localhost:3000/console/profissionais \
  --storage-state playwright/.auth/user.json --mock visual-mock.mjs \
  --states default,loading,empty,error,long --color-scheme light,dark \
  --widths 1440,768,390 --reduced-motion no-preference,reduce --out proof/after
```

Cada combinação usa um contexto isolado. A ordem é rota, tema, estado, movimento e largura. `captureAfter` substitui `--wait`; não se espera `networkidle`, que apagaria o estado carregando. O hook também pode retornar `{ready, expect, captureAfter, beforeCapture}`. `beforeCapture({page,context,state})` abre um diálogo, preenche campos ou exercita um fluxo depois da navegação. Estados customizados, como `permission`, `blocked`, `inactive`, `saving` e `success`, seguem o mesmo contrato. Estado solicitado sem `states.<nome>.expect` é erro de uso; seletor ausente é achado `state`, nunca prova aprovada.

## Regras do projeto

Leia `DESIGN.md`, estilos, tokens e componentes antes de criar `ui-rules.json`. Escreva seletores específicos: uma regra para recibo não deve atingir ícones nem outras famílias. O exemplo é ilustrativo; valores vêm do projeto.

```json
{
  "version": 1,
  "rules": [
    {"selector":".receipt-date","required":true,"fontFamily":["Arial","Inter"],"minFontSize":14},
    {"selector":"button.primary","minTargetSize":32,"radii":["4px"],"colors":["#ffffff"],"backgroundColors":["#174ea6"]}
  ],
  "consistency": {"maxFontSizes":6,"maxColors":12,"maxRadii":6,"maxShadows":4,"maxDuration":500}
}
```

`fontFamily` confere a primeira família computada, sem provar que o arquivo da fonte carregou. `radii` verifica os quatro cantos. `colors`, `backgroundColors` e `borderColors` comparam valores sRGB normalizados; informe cores CSS resolvidas, não `var(...)`. `required:true` torna a ausência do seletor uma violação. O relatório inclui cobertura de seletores e os valores encontrados. Limites de consistência são heurísticos configuráveis; 14 tamanhos de fonte ultrapassam o padrão de 6. Diagramas e gráficos podem justificar mais cores.

## Evidências e comparação

Saídas: `report.json`, uma captura por combinação, `index.html` com a grade de estados e, quando houver correspondência, uma imagem antes/depois. Compare a mesma rota, viewport, tema, estado e preferência de movimento:

```sh
node <skill-dir>/scripts/inspect-ui.mjs http://localhost:3000/console/profissionais \
  --mock visual-mock.mjs --states default,loading,empty,error,long \
  --color-scheme light,dark --widths 1440,768,390 --out proof/after --compare proof/before
```

As capturas antigas precisam existir. Combinação sem par recebe `comparison_missing`; não é apresentada como comparação realizada. O script usa Chromium para compor a imagem, sem pacote de processamento de imagens.

Use `--full-page` para conferir recibos e conteúdo abaixo da primeira dobra, ou exercite a rolagem no hook. A medição continua usando a viewport; a comparação conserva a altura total das imagens. Nenhuma captura isolada comprova conteúdo dentro de uma região que não foi percorrida.

O relatório registra URL final, status do documento, seletor esperado, console, erros JavaScript e falhas de rede. Erro 500 da API simulado é parte do cenário; erro JavaScript ou falha do documento continuam sendo problemas. `state_verified` confirma o seletor, não toda a semântica: revise se o conteúdo representa de fato o cenário.

Saídas do processo: `0` execução concluída (pode conter achados), `1` achados com `--fail-on-findings`, `2` argumentos/configuração inválidos, `3` Playwright ausente, `4` falha de navegador ou de qualquer combinação. Preserve o código de saída e o log completo. Use `--fail-on-findings` em CI apenas após avaliar exceções; sem esse flag, `0` não significa aprovação de design.

As métricas de animação verificam estilos e animações ativas na captura. Hover, entrada/saída e animações JavaScript futuras precisam ser disparados pelo hook ou exercitados manualmente. Execute `--reduced-motion no-preference,reduce` para comparar as duas preferências, conforme [emulação do Playwright](https://playwright.dev/docs/emulation).

## Candidatos (fora do gate)

Quinze detectores portados do Stageshow (mais os `motion-*`, só com `--motion`; veja a seção seguinte) rodam em toda execução e saem em `runs[].candidates`, com a evidência em `runs[].candidate_evidence` e a seção "candidatos" no console. Não entram em `findings`, na galeria nem no código de saída de `--fail-on-findings` até passarem pelo replay com denominador (meta: no máximo 1 achado em 10 telas boas). Medem só o que está na viewport.

| Nome | Mede | Correção |
|---|---|---|
| `layout-fit` | botão cuja linha de texto, padding e borda pedem mais altura que a caixa (tolerância de 2px) | altura mínima em vez de fixa, menos padding ou texto que não quebra |
| `layout-edge` | conteúdo do controle colado num lado, padding perto de zero ali e recuo real no outro | mesmo padding nas duas pontas |
| `layout-bottom` | contêiner com padding de base cujo último filho invade esse padding (altura fixa, compressão ou ancestral que corta) | `min-height`, rolagem própria ou menos conteúdo |
| `icon-mixed` | ícones preenchidos e de traço no mesmo menu, lista, barra de ferramentas ou abas | um conjunto e uma construção, em 16 ou 20px |
| `icon-emoji` | emoji no lugar de ícone ao lado de texto | ícone desenhado do conjunto da tela |
| `icon-clipped` | SVG que desenha além do próprio `viewBox` e corta o traço | caber o desenho no `viewBox` ou trocar o ícone |
| `icon-translucent` | traço ou preenchimento com alfa em ícone de duas ou mais formas, que escurecem onde se cruzam | cor opaca; para atenuar, `opacity` no `svg` inteiro |
| `spacing-inset` | texto a menos de 8px da lateral do card que o contém | recuo de 12px (8px em lista densa) |
| `spacing-control` | botão pintado a menos de 8px do campo, fio ou borda acima | 8px ou mais entre campo e ação |
| `spacing-stack` | duas linhas de estilos diferentes com menos de 3px ou mais de 10px de tinta | 4 a 6px de tinta: line-height 1,3 e gap de 2px |
| `spacing-touching` | texto a menos de 5px de uma caixa na mesma linha (2px entre palavras soltas) | `gap` fixo de 8 a 12px |
| `spacing-padding` | topo ou base do card menor que o recuo lateral | mesmo padding em volta, rodapé incluído |
| `spacing-squeezed` | selo ou avatar encolhido pela linha flex | `flex: none` no selo, `min-width: 0` no texto |
| `spacing-spill` | controle que passa 3px ou mais do espaço reservado | `width: 100%` ou `minmax(0, 1fr)` no espaço |
| `spacing-clipped` | texto, ponto ou ícone cortado por `overflow: hidden` | altura que cresce com o conteúdo |

Proveniência: `scripts/inspect-layout.mjs` porta `auditLayout` (`layout-core.mjs:3-135,159-164`) sem `nested-composition-crop`; `scripts/inspect-icons.mjs` porta quatro checagens de `film-checks.mjs`. Origem: benjitaylor/skills stageshow@299140f, MIT, aviso em `references/stageshow-LICENSE.txt`. Seletores `.ss-*` viraram exclusões genéricas (logo, marca, avatar, spinner, switch, checkbox, chat). A escala de miniatura de 14px do Stageshow não vale aqui. `scripts/inspect-spacing.mjs` porta oito checagens de `film-checks.mjs`, com limiares iguais às regras A1, A3, A5 e A8 de [componentes-bonitos.md](componentes-bonitos.md); `lopsided`, `uneven inset` e um ramo de `spills` ficaram de fora (falso positivo sem acerto). `layout-bottom` e `spacing-padding` acusam o mesmo defeito de base; o registro de regras decide qual fica. Os pares `scripts/fixtures/<nome>-ruim.html` e `<nome>-bom.html` mostram cada defeito e a correção.

## Movimento gravado (opcional, `--motion`)

`--motion <ms>` grava o que acontece entre os quadros depois de um gatilho e devolve candidatos `motion-*`. Sem esse flag nada é gravado e o tempo de execução não muda. O gatilho vem, nesta ordem, de `states.<estado>.trigger` no mock (função `async ({page, context, state, rate})` ou seletor clicado), de um `trigger` devolvido pelo hook ou de `--motion-trigger <seletor>`. Sem gatilho, a janela é gravada parada (serve para animação automática). `--motion-root <seletor>` limita a gravação (padrão `body`).

```sh
node <skill-dir>/scripts/inspect-ui.mjs http://localhost:3000/console/pedidos   --storage-state playwright/.auth/user.json --widths 1440 --motion 600 --motion-trigger '[data-sidebar-toggle]'   --reduced-motion no-preference,reduce --out proof/motion
```

O gatilho roda depois de `captureAfter` e de `--expect`, antes da captura; a captura e as métricas mostram o estado final. A linha do tempo de CSS e WAAPI roda a 0,25x por CDP (`Animation.setPlaybackRate`), restaurada ao fim, para que uma transição de 160 a 200 ms renda quadros suficientes. A janela é em tempo do produto: `--motion 600` grava 2,4 s por combinação, mais cerca de 0,3 s de preparo. Interrupção (dois cliques seguidos) exige a função no mock, com `page.waitForTimeout` entre os cliques. `report.json` ganha `metrics.motion_frames` e `candidate_evidence.motion` (cobertura, achados com a trilha de posições em volta do salto, tempos em segundos desde o gatilho).

| Nome | Mede | Correção |
|---|---|---|
| `motion-jump` | caixa que anda ou muda de tamanho mais de 2px num quadro, com quadros calmos em volta | animar o espaço (altura do trilho, FLIP) ou o rótulo num slot de largura fixa |
| `motion-drift` | dois vizinhos empilhados que mantêm o tamanho e deslizam fora de passo | mesma duração e curva para a coluna inteira |
| `motion-anchor` | diálogo, menu, listbox ou popover aberto que muda de altura sem segurar nem o topo nem a base | prender pela borda de onde abriu; a lista cresce a partir dela |
| `motion-pop` | elemento que surge ou some inteiro num quadro, sem animação nele nem nos ancestrais | manter montado até a saída terminar (`transitionend`, `animationend`) |
| `motion-settle` | elemento que para depois de animar e salta de novo sem nada rodando | terminar a animação exatamente na posição final |
| `motion-coverage` | quadros poucos, esparsos ou gatilho que falhou: inconclusivo, não é defeito | repetir com a máquina livre ou corrigir o gatilho |

`motion-pop` só é julgado com `reduced_motion: no-preference`: sob `reduce`, entrar e sair sem animação é o correto. Animação feita em JavaScript fora da WAAPI (rAF, GSAP, caminho sem WAAPI do Framer Motion) não desacelera nem aparece em `getAnimations()`, então pode gerar `motion-pop` ou `motion-settle` falso; o mesmo vale para `setTimeout` que desmonta depois da duração do CSS, que dispara cedo contra a saída desacelerada. Leia a trilha antes de corrigir.

Proveniência: `scripts/inspect-motion.mjs` (análise) e `scripts/inspect-motion-record.mjs` (gravador no navegador) portam `record`/`analyse` (`jumps-core.mjs:13-176`), `coverage` (`verification.mjs:48-63`) e pops e settle (`motion-watch.mjs:184-454`) de benjitaylor/skills stageshow@299140f, MIT, aviso em `references/stageshow-LICENSE.txt`. `.ss-stage` virou um seletor raiz qualquer, a regex de âncora virou seletores de papel ARIA, `[popover]` e invólucros Radix e cmdk, e o cabeçalho de `inspect-motion.mjs` lista cada desvio. Os pares `scripts/fixtures/motion-<nome>-ruim.html` e `-bom.html` mostram cada defeito e a correção (`motion-mock.mjs` traz o gatilho de interrupção).
