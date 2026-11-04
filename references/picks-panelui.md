# PanelUI: escolha por componente (app e web)

> Revisão de 04/11/2026. Fonte: [panelui.dev/docs](https://panelui.dev/docs) (app) e [panelui.dev/docs/web](https://panelui.dev/docs/web) (web), repositório `panel-ui/PanelUI` no commit `73e7e3a` (03/11/2026), licença MIT ([texto](panelui-LICENSE.txt)). Índice completo com plataforma, instalação, sinais, encaixe, veredito e condição: [panelui-components.json](panelui-components.json). Código, API gerada, gravações, capturas e revisões ficam no acervo, em `fontes/panel-ui--PanelUI/` e `catalogos/panelui-2026-11-04/`.

**Escopo:** 141 componentes de app (P001 a P141) e 4 blocos de tela inteira (PB01 a PB04), em React Native 0.86, Expo SDK 57+, Uniwind (Tailwind v4) e Reanimated 4; 47 componentes web (W001 a W047), em React, Tailwind v4 e tokens do shadcn.

**Como foi revisado:** varredura estática de todos; quatro revisores leram o código de cada item por busca dirigida aos critérios (papel, rótulo e estado acessíveis, alvo de toque, gesto com alternativa, movimento reduzido, teclado virtual, cor literal, foco) e pelos trechos críticos, com linha citada; não houve leitura integral de cada arquivo. No app, a captura é uma faixa de 4 quadros da gravação de aparelho publicada no site (132 de 145; 13 sem gravação). Na web, a primeira demo do site a 1440 e 390 px (46 de 47; a página do Workbench dá erro no próprio site). **Contraste não foi medido:** veredito que dependia dele virou `adaptar`, com condição começando por "Medir". Item sem captura não recebe `recomendado`.

**Resultado:** app com 54 recomendados, 83 para adaptar, 4 referências e 4 não recomendados; web com 6 recomendados, 34 para adaptar, 6 referências e 1 não recomendado.

## Como usar

1. Projeto primeiro. PanelUI cobre lacuna; não troca o design system de um projeto que já tem um.
2. Busque: `node <skill-dir>/scripts/find-resources.mjs --mobile "sheet"` (só app) ou `--web "kpi"` (só web). A busca padrão traz os itens web e nunca os de app; app só com `--mobile` ou `--all`, vitrine só com `--all`.
3. Abra a captura do item (`captura`, relativa ao acervo) e a página de demo antes de decidir. No app, as variantes gravadas (`variantes_gravadas`) mostram estados como vazio, carregando e erro.
4. Leia a API gerada do item antes de usar uma prop: `skills/panelui/components/<slug>.md` (app) ou `skills/panelui-web/components/<slug>.md` (web), no `fontes.zip` do acervo ou no repositório.
5. Instale um por vez. App: `npx panelui-cli@latest add <slug>` copia o código, ou importe de `panelui-native`; exige o setup de Uniwind do [mobile-app.md](mobile-app.md#react-native-com-uniwind-e-reanimated-panelui). Web: `npx shadcn@latest add https://panelui.dev/r/web/<slug>.json`; exige projeto shadcn com Tailwind v4.
6. Aplique a condição do veredito antes de entregar. "Recomendado" ainda pede textos em pt-BR e tokens do projeto.

## Escolha rápida no app (React Native/Expo)

| Necessidade | PanelUI | Veredito | Antes de usar |
|---|---|---|---|
| Ação principal e secundária | `button` P001 | recomendado | Um preenchido por tela; tamanho padrão ou maior em toque |
| Tarefa curta sobre a tela | `bottom-sheet` P040 | recomendado | Arrastar tem botão e fundo como alternativa; abrir em até metade da altura |
| Menu ancorado ao que abriu | `popover` P044 | recomendado | Voltar do Android já fecha |
| Escolher de uma lista | `select` P032 | recomendado | Com filtro por texto, `combobox` P016 com lista virtualizada |
| Busca | `search-bar` P031 | recomendado | Resultados acima do teclado |
| Campo com rótulo e erro | `field` P019 + `label` P024 + `input` P022 | recomendado / adaptar | Em cada `input`: `keyboardType`, `autoComplete`, `returnKeyType`; medir corte com fonte a 200 % |
| Texto longo | `textarea` P037 | recomendado | |
| Número com passo | `number-input` P026 | recomendado | |
| Valor ou intervalo contínuo | `slider` P034 | recomendado | Já tem incremento e decremento acessíveis |
| Hora | `time-picker` P039 | recomendado | Data: `date-picker` P017 só depois de subir a célula do Calendar para 44 pt |
| Linha de lista e configurações | `item` P064 e `frame` P061 | recomendado | `item` no tamanho padrão ou `sm` quando tocável; `xs` fica perto de 40 pt |
| Linha com ações por deslizar | `swipe` P011 | recomendado | Mesmas ações também num menu |
| Confirmar ação séria | `slide-button` P009 | recomendado | Tem `accessibilityActions`; `progress-button` P007 ainda não tem |
| Assinatura | `signature` P033 | recomendado | Já expõe caminho alternativo |
| Abas | `tabs` P053 | adaptar | Medir altura do gatilho e completar 44 pt com `hitSlop` |
| Paginação | `pagination` P048 | recomendado | `sm` já compensa com `hitSlop` |
| Seções que abrem | `accordion` P056 | recomendado | |
| Número de acompanhamento | `kpi` P078 | recomendado | Um herói por tela, como na barra visual |
| Série no tempo / comparação | `line-chart` P092 / `bar-chart` P085 | recomendado | O resumo padrão do leitor de tela só conta itens: escreva um resumo com a conclusão |
| Tabela no celular | `table` P082 | adaptar | FlatList acima de algumas dezenas de linhas; linha tocável com 48 pt |
| Vazio, carregando, progresso | `empty-state` P108, `skeleton` P113, `progress` P112, `spinner` P114 | recomendado | |
| Aviso que some | `toast` P045 | adaptar | Fechar com 44 pt; não use para erro de campo |
| Modal que bloqueia | `dialog` P041 | adaptar | Trocar o zoom por fade com movimento reduzido; anunciar o título |
| Ajuda e suporte | `support` P128 | recomendado | |
| Chat de assistente | `message-scroller` P124 + `message` P123 + `ai-input` P130 | adaptar | Autor falado por turno, botões de 44 pt, anunciar só o fim da resposta |

Composição de tela inteira: os blocos PB01 a PB04 (atividade, bilhete, casa conectada, carteira) são referência de composição; copie a estrutura, não o arquivo, e aplique as correções dos gráficos e dos gestos.

## Escolha rápida na web

| Necessidade | PanelUI | Veredito | Antes de usar |
|---|---|---|---|
| Tabela | `table` W039 | recomendado | |
| Número com rótulo | `stat` W038 | recomendado | `kpi` W034 quando precisa de variação e minigráfico; medir o verde da variação |
| Menu de ações | `menu` W019 | recomendado | Foco por fundo, sem anel |
| Painel com título | `card` W023 e `frame` W024 | recomendado / adaptar | No `frame`, manter só o fundo de foco da linha |
| Campo e rótulo | `field` W007 + `label` W009 | recomendado | Controles internos (`input` W008, `select` W011) com anel trocado |
| Quadro kanban | `lane-board` W026 | adaptar | Teclado completo e movimento reduzido; trocar o anel e usar `polite` |
| Busca e comando | `command-dock` W017 | adaptar | Conferir movimento reduzido na largura e alvo de envio de 44 px |
| Grade de atividade | `day-grid` W032 | adaptar | Trocar o anel; medir alvo e contraste dos níveis baixos |

**Defeito comum na web:** 32 dos 47 itens usam `focus-visible:ring-*` ou `ring-offset`. A regra desta skill é foco sem contorno: troque por fundo, sublinhado ou cor com 3:1 em `:focus-visible` antes de entregar.

## Defeitos comuns no app

- `AnimatedPressable` (primitivo usado por vários controles) não consulta o movimento reduzido; o efeito é uma escala de 0,97 no toque, aceitável, mas sobe para correção quando o componente anima entrada ou loop.
- Sem movimento reduzido na entrada: `dialog`, `drawer`, `fab`, `feedback`, `otp-input`, `tag-input`, `ai-input`.
- Alvos abaixo de 44 pt: célula do `calendar` (40 pt), fechar do `toast` (24 pt), gatilhos de `reasoning`, `sources` e `task` (cerca de 24 pt), pega do `sortable` e alças de `splitter` e `split-view`.
- Gráficos sem legenda obrigatória (`ring-chart`, `hex-chart`, `pie-chart`) ficam mudos para leitor de tela.
- Estado só por ícone e cor em `plan` e `task`.

<!-- tabelas geradas -->

## Todos os itens

- App, parte 1: [picks-panelui-app-1.md](picks-panelui-app-1.md)
- App, parte 2: [picks-panelui-app-2.md](picks-panelui-app-2.md)
- Web: [picks-panelui-web.md](picks-panelui-web.md)
