# PanelUI web: todos os itens

Gerado de [panelui-components.json](panelui-components.json) em 04/11/2026; escolha rápida e método em [picks-panelui.md](picks-panelui.md). Condição completa no índice (`revisao.condicao`).

## Ações

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| W001 | `button` | tela de app | adaptar | Trocar o anel por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste do estado disabled e do texto branco sobre o vermelho destrutivo. |
| W002 | `button-group` | tela de app | adaptar | Trocar o anel herdado do Button por estado sem contorno (sublinhado, fundo ou cor com 3:1) e conferir o foco dentro do grupo. |
| W003 | `toolbar` | tela de app | adaptar | Trocar o anel por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir tamanho de alvo dos itens e o contraste do ícone desabilitado. |

## Formulários e entrada

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| W007 | `field` | tela de app | recomendado | Textos e tokens do projeto |
| W009 | `label` | tela de app | recomendado | Textos e tokens do projeto |
| W004 | `checkbox` | tela de app | adaptar | Trocar o anel e o offset por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste do estado desabilitado e usar sempre dentro de rótulo (segue no índice) |
| W005 | `chip` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Ampliar a área do botão de remover. Medir o contraste do chip selecionado em cinza. |
| W006 | `choice-cards` | tela de app | adaptar | Trocar o anel de foco por estado sem contorno (sublinhado, fundo ou cor com 3:1) e manter o estado marcado distinto do foco. |
| W008 | `input` | tela de app | adaptar | Trocar o anel de foco por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste do placeholder. |
| W010 | `radio-group` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Manter o rótulo envolvendo o círculo para ampliar o alvo. |
| W011 | `select` | tela de app | adaptar | Trocar o anel do gatilho por estado sem contorno (sublinhado, fundo ou cor com 3:1). |
| W012 | `slider` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste do texto sobre o preenchimento e o tamanho do alvo do botão de (segue no índice) |
| W013 | `switch` | tela de app | adaptar | Medir o contraste do trilho desligado e do desabilitado contra o fundo, mínimo 3:1. Trocar o anel por estado sem contorno (sublinhado, fundo ou cor com 3:1). |
| W014 | `textarea` | tela de app | adaptar | Trocar o anel de foco por estado sem contorno (sublinhado, fundo ou cor com 3:1). |
| W015 | `xy-pad` | tela de app | adaptar | Trocar o anel do ponto por estado sem contorno (sublinhado, fundo ou cor com 3:1). Oferecer campos numéricos para X e Y como alternativa ao arraste. |

## Sobreposições

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| W019 | `menu` | tela de app | recomendado | Textos e tokens do projeto |
| W016 | `alert-dialog` | tela de app | adaptar | Trocar o anel dos botões internos por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste do texto branco no botão vermelho. |
| W017 | `command-dock` | tela de app | adaptar | Confirmar prefers-reduced-motion na transição de largura do dock (command-dock/index.tsx:77) e ampliar o alvo do botão de enviar para 44 px. |
| W018 | `dialog` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Linha de lista já tem fundo de foco; manter só ele. |
| W020 | `sheet` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Usar só os modos necessários. |

## Navegação

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| W021 | `tabs` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste do rótulo das abas inativas. |

## Layout e estrutura

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| W023 | `card` | tela de app | recomendado | Textos e tokens do projeto |
| W024 | `frame` | tela de app | adaptar | Trocar o anel por estado sem contorno; a linha já ganha fundo no foco (frame/index.tsx:114), manter só ele. Garantir que a linha clicável seja button ou link. |
| W025 | `inspector` | tela de app | adaptar | Trocar o anel da aba por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste dos ícones inativos. |
| W026 | `lane-board` | tela de app | adaptar | Trocar o anel por estado sem contorno (sublinhado, fundo ou cor com 3:1). Trocar assertive por polite nos anúncios de movimento. |
| W028 | `workbench` (sem captura) | tela de app | adaptar | Trocar o anel por estado sem contorno (sublinhado, fundo ou cor com 3:1) e definir o comportamento em 390 px. |
| W022 | `canvas` | acabamento | referência | Usar como ideia de fundo de área de edição, não como componente a copiar. |
| W027 | `tilt-card` | vitrine | não recomendado | Só vitrine, sem uso em tela de produto. Usar Card comum. |

## Dados

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| W038 | `stat` | tela de app | recomendado | Textos e tokens do projeto |
| W039 | `table` | tela de app | recomendado | Textos e tokens do projeto |
| W029 | `avatar` | tela de app | adaptar | Trocar o anel do contador por estado sem contorno. Medir contraste das iniciais sobre os fundos pastel, mínimo 4,5:1. |
| W030 | `badge` | tela de app | adaptar | Medir contraste do texto de cada tom (success, info, warning, destructive) sobre o fundo claro e escuro, mínimo 4,5:1. |
| W031 | `bar-picker` | tela de app | adaptar | Trocar o anel por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste das barras não selecionadas contra o fundo. |
| W032 | `day-grid` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir o tamanho do alvo da célula e o contraste dos níveis mais baixos. |
| W034 | `kpi` | tela de app | adaptar | Medir contraste do texto de variação em verde e das linhas finas do minigráfico contra o fundo. |
| W036 | `range-meter` | tela de app | adaptar | Trocar o anel por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste das barras contra o fundo. |
| W037 | `rolling-number` | acabamento | adaptar | Envolver o valor em região aria-live polite quando mudar sem ação do usuário e validar o corte da janela de dígitos. |
| W033 | `flow` | tela de app | referência | Usar como referência de padrão. Para produção, exigir criação de conexão por teclado e trocar os anéis por estado sem contorno. |
| W035 | `planet` | vitrine | referência | Valer a lista de regiões com estado e latência. O globo vale como apresentação; em produto, usar só a lista. |

## Feedback e estado

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| W040 | `alert` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste do texto de cada tom e o alvo do botão de dispensar. |
| W041 | `feedback` | tela de app | adaptar | Ampliar o alvo do botão fechar para 44 px e medir o contraste do botão desabilitado. Confirmar motion-reduce na transição do diálogo. |
| W043 | `toast` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir a legibilidade do título em dither e usar efeito simples no produto. |
| W042 | `not-found` | vitrine | referência | Útil como ideia de página 404 com ação clara. Em produto, preferir versão estática. |

## Mídia e movimento

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| W044 | `timeline` | tela de app | referência | Usar como referência de editor de tempo. Medir contraste dos clipes e criar atalho de teclado para redimensionar bordas antes de produção. |

## Componentes de IA

| ID | Componente | Encaixe | Veredito | Antes de usar |
|---|---|---|---|---|
| W045 | `message` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir alvo dos ícones de ação e anunciar o fim da resposta em região viva. |
| W046 | `prompt` | tela de app | adaptar | Trocar os anéis por estado sem contorno (sublinhado, fundo ou cor com 3:1). Medir contraste do chip Search azul e o alvo dos botões de 36 px. |
| W047 | `soundwave` | acabamento | referência | Usar como ideia de indicador de voz, sempre ao lado de texto de estado. |
