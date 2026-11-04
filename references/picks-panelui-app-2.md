# PanelUI app: todos os itens (parte 2)

Gerado de [panelui-components.json](panelui-components.json) em 04/11/2026; escolha rápida e método em [picks-panelui.md](picks-panelui.md). Condição completa no índice (`revisao.condicao`).

## Componentes de IA

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P132 | `image-generation` | tela de app | recomendado | Textos e tokens do projeto |
| P138 | `soundwave` | tela de app | recomendado | Textos e tokens do projeto |
| P130 | `ai-input` | tela de app | adaptar | Elevar os controles para 44 pt ou aplicar hitSlop em ai-input/index.tsx:121; respeitar ReduceMotion nas transições de altura e painel. |
| P131 | `code-block` | tela de app | adaptar | Medir contraste dos tokens de sintaxe e do gutter, e levar o botão de copiar a 44 pt. |
| P133 | `panelside` | tela de app | adaptar | Medir alvos das linhas e ações do menu e levar o compositor a 44 pt (ver ai-input). |
| P134 | `plan` | tela de app | adaptar | Acrescentar ao PlanStep accessibilityLabel ou texto oculto com o estado (feito, ativo, pendente) e aumentar o gatilho para 44 pt. |
| P135 | `reasoning` | tela de app | adaptar | Medir contraste do texto de raciocínio e subir o gatilho para 44 pt (min-h-11 ou hitSlop). |
| P136 | `response` | tela de app | adaptar | Dar accessibilityRole header aos títulos do markdown e anunciar o fim do streaming no contêiner do chat. |
| P137 | `shimmer` | acabamento | adaptar | Medir contraste do estado atenuado do texto sobre fundo escuro, inclusive na variante azul. |
| P139 | `sources` | tela de app | adaptar | Subir o gatilho para 44 pt (min-h-11 ou hitSlop). |
| P140 | `task` | tela de app | adaptar | Dar rótulo de estado ao gatilho (por exemplo 'Falhou, Typecheck') e subir o alvo para 44 pt. |
| P141 | `thinking-orb` | acabamento | adaptar | Medir contraste e legibilidade dos pontos no tamanho de uso em linha, e manter texto de estado ao lado. |

## Blocos de tela inteira

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| PB01 | `activity` | tela de app | referência | Copiar a composição (abas, anéis com legenda, KPIs, histórico), não o arquivo; acrescentar as correções de legenda e rótulos dos gráficos. |
| PB02 | `boarding-pass` | tela de app | referência | Usar como ideia de composição de bilhete; trocar o deslizar por botão simples quando a ação não for irreversível. |
| PB03 | `smart-home` | tela de app | referência | Copiar a composição de tile como interruptor com estado em texto e cor; Medir contraste do tile desligado antes de adotar. |
| PB04 | `wallet` | tela de app | referência | Usar a composição de saldo, pilha, ações e gráfico; oferecer botão visível para as ações de deslizar. |
