# PanelUI app: todos os itens (parte 1)

Gerado de [panelui-components.json](panelui-components.json) em 04/11/2026; escolha rápida e método em [picks-panelui.md](picks-panelui.md). Condição completa no índice (`revisao.condicao`).

## Ações

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P001 | `button` | tela de app | recomendado | Textos e tokens do projeto |
| P009 | `slide-button` | tela de app | recomendado | Textos e tokens do projeto |
| P011 | `swipe` | tela de app | recomendado | Textos e tokens do projeto |
| P002 | `button-group` | tela de app | adaptar | Usar tamanho md ou maior dentro do grupo, ou aplicar hitSlop no contêiner, porque o hitSlop do Button é desligado quando attached. |
| P003 | `chip` | tela de app | adaptar | Usar tamanho xl (h-11) em filtros tocáveis ou adicionar hitSlop ao corpo do chip. Medir contraste do texto colorido sobre o fundo translúcido. |
| P004 | `context-menu` (sem captura) | tela de app | adaptar | Medir a altura das linhas do menu (padrão compartilhado com Menu usa py-2.5 sem min-h) e acrescentar pista visual (ícone de mais opções) ao alvo. |
| P005 | `fab` | tela de app | adaptar | Respeitar useReducedMotion na abertura do leque e expor o rótulo de fechar como prop traduzível. |
| P006 | `menu` (sem captura) | tela de app | adaptar | Medir a altura renderizada do item e impor min-h-11 (44) se ficar abaixo. |
| P007 | `progress-button` | tela de app | adaptar | Adicionar accessibilityActions (activate) que complete a confirmação, ou oferecer segundo passo por toque para quem usa leitor de tela ou controle por chave. |
| P008 | `selection-mode` (sem captura) | tela de app | adaptar | Adicionar accessibilityActions 'select' ao item e um botão visível de Selecionar na barra da tela, ambos chamando enter(). |
| P010 | `stack-card` | tela de app | adaptar | Medir corte de texto do cartão com fonte do sistema a 200% e confirmar alvo de 44 pt nos botões de saída. |
| P012 | `toggle-button` | tela de app | adaptar | Em seleção única usar accessibilityRole radio nos itens (toggle-button/index.tsx:349) e aplicar hitSlop também em sm. Medir contraste do estado desligado. |

## Formulários e entrada

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P015 | `color-picker` | tela de app | recomendado | Textos e tokens do projeto |
| P019 | `field` | tela de app | recomendado | Textos e tokens do projeto |
| P024 | `label` | tela de app | recomendado | Textos e tokens do projeto |
| P026 | `number-input` | tela de app | recomendado | Textos e tokens do projeto |
| P031 | `search-bar` | tela de app | recomendado | Textos e tokens do projeto |
| P032 | `select` | tela de app | recomendado | Textos e tokens do projeto |
| P033 | `signature` | tela de app | recomendado | Textos e tokens do projeto |
| P034 | `slider` | tela de app | recomendado | Textos e tokens do projeto |
| P037 | `textarea` | tela de app | recomendado | Textos e tokens do projeto |
| P038 | `theme-selector` | tela de app | recomendado | Textos e tokens do projeto |
| P039 | `time-picker` | tela de app | recomendado | Textos e tokens do projeto |
| P013 | `calendar` | tela de app | adaptar | Medir a área tocável da célula; subir a célula para h-11 (44) ou aplicar hitSlop vertical. Medir contraste dos dias fora do mês. |
| P014 | `checkbox` | tela de app | adaptar | Medir o contraste da borda da caixa desmarcada contra o fundo (meta 3:1) e reforçar o token border-input se ficar abaixo. |
| P016 | `combobox` (sem captura) | tela de app | adaptar | Virtualizar a lista (FlatList) quando houver centenas de opções e medir a altura da linha da opção (meta 44). |
| P017 | `date-picker` | tela de app | adaptar | Aplicar a correção de alvo da célula do Calendar (h-11) antes de usar. |
| P018 | `date-time-picker` | tela de app | adaptar | Corrigir o alvo da célula do Calendar e medir o painel com fonte a 200% em tela de 360 pt de largura. |
| P020 | `file-upload` | tela de app | adaptar | Elevar os botões de remover e tentar de novo para 44 pt (hitSlop maior) e confirmar o limite de arquivos. |
| P021 | `form` | tela de app | adaptar | Adicionar foco no primeiro campo inválido e anúncio do resumo de erros ao enviar, no código do consumidor. |
| P022 | `input` | tela de app | adaptar | Medir o corte de texto com fonte do sistema a 200% nos tamanhos de altura fixa e passar keyboardType, autoComplete e returnKeyType em cada uso. |
| P023 | `input-group` | tela de app | adaptar | Medir o sufixo interativo (meta 44 pt) e a altura com fonte ampliada, como no Input. |
| P025 | `markdown-editor` | tela de app | adaptar | Subir os botões da barra para 44 pt ou aplicar hitSlop, e liberar autoCapitalize e autoCorrect quando o uso for prosa. |
| P027 | `otp-input` | tela de app | adaptar | Parar o piscar do cursor quando useReducedMotion for verdadeiro. |
| P028 | `questionnaire` | tela de app | adaptar | Medir o contraste da borda dos indicadores não selecionados (meta 3:1) e a altura da linha da opção (meta 44). |
| P029 | `radio-group` | tela de app | adaptar | Medir o contraste da borda do círculo desmarcado (meta 3:1) e reforçar o token border-input se ficar abaixo. |
| P030 | `rating` | tela de app | adaptar | Elevar a área tocável da linha para 44 pt de altura e medir o contraste das estrelas vazias contra o fundo. |
| P035 | `switch` | tela de app | adaptar | Medir o contraste da trilha desligada e do contorno contra o fundo (meta 3:1) e ajustar o token da trilha se ficar abaixo. |
| P036 | `tag-input` (sem captura) | tela de app | adaptar | Aumentar o alvo de remoção das tags para 44 pt e respeitar useReducedMotion nas animações de entrada e saída. |

## Sobreposições

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P040 | `bottom-sheet` | tela de app | recomendado | Textos e tokens do projeto |
| P044 | `popover` | tela de app | recomendado | Textos e tokens do projeto |
| P041 | `dialog` | tela de app | adaptar | Trocar ZoomIn por FadeIn simples quando useReducedMotion for verdadeiro e anunciar o título ao abrir. |
| P042 | `drawer` | tela de app | adaptar | Respeitar useReducedMotion na entrada e na saída do painel. |
| P043 | `feedback` | tela de app | adaptar | Respeitar useReducedMotion na entrada. Medir o contraste dos botões desativados. |
| P045 | `toast` (sem captura) | tela de app | adaptar | Subir o botão de fechar para 44 pt de área tocável e alongar ou pausar a duração em toast com ação. |
| P046 | `tooltip` | acabamento | adaptar | Medir a largura do balão com texto real (a captura quebra em duas linhas) e usar apenas para dica, nunca para informação necessária. |

## Navegação

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P048 | `pagination` | tela de app | recomendado | Textos e tokens do projeto |
| P047 | `breadcrumb` | tela de app | adaptar | Medir a altura real do link e das reticências; garantir 44 pt com hitSlop vertical ou min-h-11. Expor os rótulos More e Show more como props. |
| P049 | `section-progress` | tela de app | adaptar | Medir o alvo da pílula (34 pt) e das linhas da lista; subir para 44 pt com hitSlop. Trocar role menu por button ou link se o teste com VoiceOver ler mal. (segue no índice) |
| P050 | `section-rail` | acabamento | adaptar | Respeitar useReducedMotion na largura da barra. Medir contraste das barras em repouso e o alvo das linhas do painel (32 pt). Expor o rótulo Sections como prop. |
| P051 | `sortable` | tela de app | adaptar | Dar hitSlop ou padding à pega para chegar a 44 pt; anunciar a nova posição depois de moveUp ou moveDown; limitar o uso a listas curtas. |
| P052 | `steps` | tela de app | adaptar | Medir o gatilho; se for menor que 44 pt, adicionar hitSlop ou min-h-11. Usar o indicador só como leitura quando a navegação livre entre etapas não for desejada. |
| P053 | `tabs` | tela de app | adaptar | Medir a altura do gatilho nos tamanhos md e lg em cada variante; acrescentar hitSlop vertical até 44 pt onde faltar. |
| P054 | `tour` | tela de app | adaptar | Subir o botão fechar para 44 pt (h-11 w-11 ou hitSlop). Medir o alvo dos botões sm. Trocar o rgba do overlay por token. |
| P055 | `tree` | tela de app | adaptar | Medir a linha e subir para 44 pt com min-h-11 ou hitSlop. Respeitar reduced motion no chevron. Limitar a árvores pequenas ou virtualizar. |

## Layout e estrutura

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P056 | `accordion` | tela de app | recomendado | Textos e tokens do projeto |
| P057 | `card` | tela de app | recomendado | Textos e tokens do projeto |
| P060 | `direction` | tela de app | recomendado | Textos e tokens do projeto |
| P061 | `frame` | tela de app | recomendado | Textos e tokens do projeto |
| P062 | `grid-item` | tela de app | recomendado | Textos e tokens do projeto |
| P064 | `item` | tela de app | recomendado | Textos e tokens do projeto |
| P065 | `page-header` | tela de app | recomendado | Textos e tokens do projeto |
| P068 | `scroll-fade` | acabamento | recomendado | Textos e tokens do projeto |
| P069 | `scroll-header` | tela de app | recomendado | Textos e tokens do projeto |
| P070 | `separator` | tela de app | recomendado | Textos e tokens do projeto |
| P074 | `surface` | tela de app | recomendado | Textos e tokens do projeto |
| P075 | `typography` | tela de app | recomendado | Textos e tokens do projeto |
| P058 | `carousel` | tela de app | adaptar | Desligar autoplay quando reduced motion ou leitor de tela estiver ativo e oferecer pausa. Usar setas de 48 pt como caminho principal em vez dos pontos de 24 pt. |
| P059 | `collapsible` (sem captura) | tela de app | adaptar | Sem gravação ou demo no site: renderizar com dado real e olhar a captura antes de usar. |
| P063 | `image-viewer` | tela de app | adaptar | Medir o botão Close (44 pt). Se o zoom importar para a tarefa, acrescentar botões de zoom ou ações de acessibilidade. |
| P066 | `scroll-blur` (sem captura) | acabamento | adaptar | Sem gravação ou demo no site: renderizar com dado real e olhar a captura antes de usar. |
| P071 | `sketch` | tela de app | adaptar | Usar só onde desenhar é opcional ou ao lado de outra forma de preencher. Trocar os hex por tokens. |
| P072 | `splitter` (sem captura) | tela de app | adaptar | Ampliar a área da alça para 44 pt e limitar o uso a tablet ou tela larga. |
| P073 | `split-view` (sem captura) | tela de app | adaptar | Subir a área de arraste para 44 pt. |
| P067 | `scroll-canvas` | vitrine | não recomendado | Não usar em telas de trabalho; só como referência para telas de marketing. |

## Dados

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P076 | `countdown` | tela de app | recomendado | Textos e tokens do projeto |
| P078 | `kpi` | tela de app | recomendado | Textos e tokens do projeto |
| P079 | `leaderboard` | tela de app | recomendado | Textos e tokens do projeto |
| P083 | `timeline` | tela de app | recomendado | Textos e tokens do projeto |
| P077 | `flow` | tela de app | adaptar | Subir os controles de zoom para 44 pt. Testar o caminho de leitor de tela ponta a ponta antes de adotar. |
| P080 | `map` | tela de app | adaptar | Subir os controles para 44 pt. Aceitar o custo do módulo nativo; conferir reduced motion nos voos de câmera. |
| P081 | `planner` | tela de app | adaptar | Medir o contraste dos dias de outro mês, esmaecidos na captura, e dos pontos de categoria. Verificar reduced motion na troca de mês. |
| P082 | `table` | tela de app | adaptar | Usar FlatList para mais de algumas dezenas de linhas. Em linha tocável, usar a densidade de 48 pt. |

## Gráficos

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P084 | `area-chart` | tela de app | recomendado | Textos e tokens do projeto |
| P085 | `bar-chart` | tela de app | recomendado | Textos e tokens do projeto |
| P089 | `funnel-chart` | tela de app | recomendado | Textos e tokens do projeto |
| P092 | `line-chart` | tela de app | recomendado | Textos e tokens do projeto |
| P093 | `live-line-chart` | tela de app | recomendado | Textos e tokens do projeto |
| P094 | `mirror-area-chart` | tela de app | recomendado | Textos e tokens do projeto |
| P098 | `pyramid-chart` | tela de app | recomendado | Textos e tokens do projeto |
| P099 | `radar-chart` | tela de app | recomendado | Textos e tokens do projeto |
| P086 | `bubble-chart` | tela de app | adaptar | Medir contraste da letra sobre as bolhas claras (branca e amarela) e conferir que a legenda renderiza nomes quando passa de 8 itens. |
| P087 | `bump-chart` | tela de app | adaptar | Medir a altura do alvo dos nomes (hitSlop 4 pt) e elevar para 44 pt; tratar sobreposição de rótulos finais. |
| P088 | `candlestick-chart` | tela de app | adaptar | Medir contraste e distinção verde e vermelho (inclusive em simulação de daltonismo) e confirmar que o readout fixo traz o sinal da variação. |
| P090 | `heatmap-chart` | tela de app | adaptar | Medir contraste entre os degraus da rampa e o fundo; passar accessibilityLabelForDatum agregando por semana para reduzir os itens do leitor de tela. |
| P091 | `hex-chart` | tela de app | adaptar | Tornar HexChart.Legend obrigatório, adicionar accessibilityState selected e role ao plano de toque; Medir contraste das séries escuras esmaecidas. |
| P095 | `pie-chart` | tela de app | adaptar | Sempre renderizar PieChart.Legend e acrescentar accessibilityState selected nela; Medir contraste do texto esmaecido da legenda. |
| P096 | `plot` (sem captura) | tela de app | adaptar | Usar só se nenhum gráfico específico servir; validar visualmente cada composição, garantir base no zero para barras e legenda em texto. |
| P097 | `polar-area-chart` | tela de app | adaptar | Medir contraste das cunhas e da legenda esmaecidas; preferir BarChart quando a comparação exata importa. |
| P100 | `ring-chart` | tela de app | adaptar | Tornar RingChart.Legend obrigatório ou envolver o gráfico em View accessible com rótulo e valor; adicionar accessibilityState selected. |
| P101 | `sankey-chart` (sem captura) | tela de app | adaptar | Trocar #3b82f6 por tokens de gráfico e validar visualmente com dados reais, pois não há gravação. |
| P102 | `scatter-chart` | tela de app | adaptar | Corrigir a largura do tooltip (texto truncado), formatar o eixo para não gerar '$-1k' e Medir o alvo de toque dos pontos. |
| P103 | `treemap-chart` | tela de app | adaptar | Medir contraste do texto sobre os tiles verdes e esconder o rótulo em tiles que o cortam, usando a legenda. |
| P104 | `waterfall-chart` (sem captura) | tela de app | adaptar | Medir contraste e distinção verde e vermelho e manter WaterfallChart.Values ligado, para o sinal não depender de cor. |

## Feedback e estado

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P108 | `empty-state` | tela de app | recomendado | Textos e tokens do projeto |
| P109 | `loader` | acabamento | recomendado | Textos e tokens do projeto |
| P110 | `marker` | tela de app | recomendado | Textos e tokens do projeto |
| P111 | `meter` | tela de app | recomendado | Textos e tokens do projeto |
| P112 | `progress` | tela de app | recomendado | Textos e tokens do projeto |
| P113 | `skeleton` | tela de app | recomendado | Textos e tokens do projeto |
| P114 | `spinner` | tela de app | recomendado | Textos e tokens do projeto |
| P105 | `alert` | tela de app | adaptar | Medir o contraste de cada título colorido e do texto de apoio contra o fundo tingido, em tema claro e escuro. |
| P106 | `animated-badge` | acabamento | adaptar | Medir o contraste dos selos em repouso. Acrescentar accessibilityLiveRegion quando o status mudar sem ação do usuário. |
| P107 | `badge` | tela de app | adaptar | Exigir accessibilityLabel no ponto de status. Medir contraste de Success, Warning, Error e Info. |

## Mídia e movimento

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| P117 | `avatar-cropper` | tela de app | recomendado | Textos e tokens do projeto |
| P120 | `compare` | tela de app | recomendado | Textos e tokens do projeto |
| P121 | `flip-card` | acabamento | recomendado | Textos e tokens do projeto |
| P128 | `support` | tela de app | recomendado | Textos e tokens do projeto |
| P115 | `attachment` | tela de app | adaptar | Expor accessibilityState busy e accessibilityValue com o progresso na raiz, e anunciar erro e conclusão por accessibilityLiveRegion. |
| P116 | `avatar` | tela de app | adaptar | Passar sempre accessibilityLabel com o nome da pessoa; sem imagem, não confiar nas iniciais. |
| P118 | `camera` | tela de app | adaptar | Medir os alvos de zoom, flash e timer e levar a 44 pt (hitSlop maior); Medir contraste dos ícones sobre preview claro. |
| P123 | `message` | tela de app | adaptar | Agrupar cada turno com accessible e rótulo do autor ('Você' ou 'Assistente') e expor o estado de streaming. |
| P124 | `message-scroller` | tela de app | adaptar | Subir o botão de pular para 44 pt (ou hitSlop) e limitar a região viva para anunciar só o fim da resposta. |
| P125 | `post` | tela de app | adaptar | Remover role adjustable do contêiner de votos ou ligar increment e decrement; Medir contraste dos fallbacks de cor. |
| P126 | `qr-code` | tela de app | adaptar | Aceitar accessibilityLabel que não repita o valor; Medir a leitura por câmera nos estilos Dots e Diamond com a correção usada. |
| P129 | `text-animation` | acabamento | adaptar | Usar só contador, odômetro e preço; para ciclo ou digitação, oferecer pausa e confirmar que o leitor recebe o texto final. |
| P119 | `circular-text` | vitrine | não recomendado | Uso só decorativo (selo, marca); não usar para informação que o usuário precisa ler. |
| P122 | `marquee` | vitrine | não recomendado | Reservar para marketing; em tela de produto, usar lista estática. |
| P127 | `scroll-text` | vitrine | não recomendado | Reservar para marketing; em produto, usar texto estático. |
