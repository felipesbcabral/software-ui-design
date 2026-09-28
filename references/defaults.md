# Valores de partida com fonte

Use estes números quando o projeto ainda não tiver token próprio para a decisão. Se o design system do projeto definir o valor, ele vence. Cada linha cita de onde veio; nenhum valor aqui é universal, e todos se justificam pela tarefa. Coleta feita em 26/09/2026 nas páginas oficiais indicadas.

## Conteúdo
- Shell e navegação
- Densidade e tabelas
- Espaçamento
- Tipografia
- Alvos, foco e tooltips
- Breakpoints
- Como usar sem virar receita

## Shell e navegação

| Decisão | Valor de partida | Fonte |
|---|---|---|
| Sidebar expandida | 240 a 320 px. Carbon usa 256 px, Fluent Nav 260 px, Atlassian 320 px padrão com mínimo 240 px e redimensionável até 50% da viewport | Carbon UI shell left panel style; Fluent 2 Nav usage; Atlassian navigation-system layout |
| Sidebar recolhida (rail) | 48 a 80 px, só ícones, com rótulo por tooltip no hover e no foco e nome acessível. Primer PageLayout.Pane de exemplo: 80 px padrão, 40 a 100 px | Primer PageLayout; Carbon UI shell |
| Estado inicial no desktop | Expandida a partir de 1280 px; rail entre 1024 e 1279 px; a escolha da pessoa é lembrada (localStorage ou preferência do usuário). Abrir recolhida por padrão esconde os destinos e faz o produto parecer vazio | Atlassian recolhe só abaixo de 1024 px; decisão da avaliação de 26/09/2026 |
| Quando recolher sozinha | Abaixo de 1024 px a Atlassian recolhe a side nav e abre como overlay; Fluent vira drawer overlay em 640 px | Atlassian navigation-system; Fluent Nav |
| Barra superior | 48 a 56 px de altura. Atlassian top nav fixa em 56 px; Carbon UI shell header 48 px | Atlassian navigation-system; Carbon UI shell |
| Painel lateral de detalhe | ~365 px padrão, redimensionável até 50% da área de conteúdo, vira overlay abaixo de 1024 px | Atlassian navigation-system (panel) |
| Área de trabalho em telas de dados | Fluida: ocupa o espaço fora da sidebar, com margem lateral de 16 a 32 px. Não centralize lista, tabela, calendário ou quadro numa coluna estreita | Carbon data table; Cloudscape app layout; decisão do estudo `TOP-10-PADROES-UI-UX.md` |
| Login e cadastro de SaaS | Tela dividida a partir de 1024 px: formulário com 360 a 420 px de largura útil num lado, painel de marca no outro (40 a 55% da largura) com prévia do produto feita na própria UI. Abaixo de 1024 px, só o formulário | `21-autenticacao-02` shadcn signup-02; avaliação de 26/09/2026 (a tela dividida ganhou do cartão centralizado) |
| Largura de leitura | Limite local só para texto corrido, formulário curto e ajuda, dentro do shell fluido. Primer oferece contêineres de 544, 768, 1012 e 1280 px para escolher por conteúdo | Primer layout foundations |

## Densidade e tabelas

| Decisão | Valor de partida | Fonte |
|---|---|---|
| Altura de linha de tabela | 24 (xs), 32 (sm), 40 (md), 48 (lg, padrão Carbon), 64 px (xl, só para duas linhas de conteúdo). Para listas de trabalho diárias com centenas de registros, comece em 40 px; 32 px quando a comparação entre linhas for a tarefa principal | Carbon data table style |
| Cabeçalho da tabela | Mesma altura das linhas | Carbon data table style |
| Toolbar e barra de ações em lote | 48 px com linhas lg/xl; 32 px com linhas sm/xs | Carbon data table style |
| Espaço entre colunas | 16 px de padding horizontal por célula | Carbon data table style |
| Modo compacto | Reduz padding e margens verticais em passos de 4 px; tipografia igual. Indicado para dashboards, listas de recursos, detalhes e tabelas; não para ajuda, alertas e validação de formulário | Cloudscape content density |
| Texto da tabela | 14 px regular nas linhas, 14 px semibold no cabeçalho de coluna | Carbon data table style |

## Espaçamento

Use uma escala em múltiplos de 4 e 8 px: 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 (Atlassian space tokens). A Atlassian orienta de 0 a 8 px dentro de peças compactas, de 12 a 24 px entre peças menos densas, e de 32 a 80 px para layout. Em tela de dados, espaçamento grande entre cards de resumo empurra o trabalho para baixo; prefira o menor degrau que ainda separa grupos.

## Tipografia

| Decisão | Valor de partida | Fonte |
|---|---|---|
| Corpo em produto | 14 px (conjunto produtivo). Páginas de leitura e marketing usam 16 px (conjunto expressivo) | Carbon type sets |
| Títulos em produto | Tamanhos fixos, não fluidos, porque a densidade exige previsibilidade | Carbon type sets |
| Números em tabela | Algarismos tabulares (`font-variant-numeric: tabular-nums`) e alinhamento à direita para valores comparáveis | Prática de Carbon/Primer; confirmado nas revisões de DESIGN.md (Column, Vercel) |

## Alvos, foco e tooltips

| Decisão | Valor de partida | Fonte |
|---|---|---|
| Alvo mínimo de clique | 24 × 24 px CSS, ou espaçamento equivalente. Mire 32 a 40 px em controles frequentes e 44 px em toque | WCAG 2.2 SC 2.5.8 (mínimo AA) |
| Foco | Indicador visível em todo controle; nunca `outline: none` sem substituto | WCAG 2.4.7; todas as revisões do acervo |
| Tooltip | Aparece no hover e no foco do teclado, fecha com Esc, não tem conteúdo interativo nem informação essencial. Primer oferece atrasos de 50, 400 e 1200 ms | Carbon tooltip usage; Primer tooltip; NN/g tooltip guidelines |
| Conteúdo interativo em dica | Use toggletip ou popover (abre no clique/Enter, entra na ordem de Tab) | Carbon tooltip usage |

## Breakpoints

Classes de janela do Material 3: compacta abaixo de 600, média de 600 a 839, expandida de 840 a 1199, grande de 1200 a 1599, extra grande a partir de 1600. Use como faixas de teste: celular (390 px), tablet (768 px), notebook (1280 a 1440 px), monitor largo (1920 px ou mais). Primer usa 544, 768, 1012, 1280 e 1400 px.

## Como usar sem virar receita

1. Confira primeiro o token do projeto. Só use a tabela quando ele não existir.
2. Escolha pelo trabalho: número de registros, frequência, dispositivo.
3. Meça depois de aplicar: `scripts/inspect-ui.mjs --data-screen` mostra largura usada, posição da primeira linha e alvos pequenos.
4. Registre o valor escolhido e o motivo no documento de design do projeto quando ele existir.
