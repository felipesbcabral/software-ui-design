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
