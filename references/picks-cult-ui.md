# Cult UI: escolha por componente

> Revisão de 07/10/2026. Fonte: [cult-ui.com/docs/components](https://www.cult-ui.com/docs/components), registry `https://cult-ui.com/r/registry.json`, repositório `nolly-studio/cult-ui` no commit `67a66c6` (01/10/2026), licença MIT. Índice completo, com instalação, encaixe, sinais e veredito por item: [cult-ui-components.json](cult-ui-components.json) (U001 a U137). Código, capturas, logs e revisões ficam no acervo, em `fontes/nolly-studio--cult-ui/` e `catalogos/cult-ui-2026-10-07/`.

Escopo: os 154 itens `registry:ui`, menos 17 aliases obsoletos (`animated-*`, que apontam para a família `halo-*`), somam 137 componentes. Todos passaram por varredura estática (movimento reduzido, teclado, ARIA, `aria-live`, `focus-visible`, clique em `div`). As 134 páginas de demo foram capturadas em 1440 e 390 px; `bg-animated-gradient`, `base-select` e `base-tooltip` não têm página. O código dos 59 componentes que servem a tela de software foi lido por inteiro, com linha citada em cada achado. Sete demos tiveram interação exercida no navegador (Dynamic Island, cinco sobreposições e o halo-switch). Os 73 itens de marketing e vitrine e cinco itens de acabamento ou primitiva têm só varredura e captura.

## Como usar

1. Projeto e acervo vêm primeiro, como em qualquer fonte. O Cult UI cobre lacuna ou acabamento; não substitui o design system do projeto.
2. Busque por termo: `node <skill-dir>/scripts/find-resources.mjs "upload"`. Itens de software e acabamento aparecem na busca padrão; marketing só com `--all`.
3. Abra a captura citada no índice (`captura`, relativa ao acervo) e a demo antes de decidir.
4. Instale um item por vez: `npx shadcn@latest add https://cult-ui.com/r/<slug>.json`. Exige projeto com Tailwind e `components.json` do shadcn; os `registry_dependencies` (Popover, Dialog, Command, HoverCard) entram junto. Prefira `halo-*` aos aliases `animated-*`.
5. Aplique a condição do veredito antes de entregar. "Recomendado" aqui ainda pede tradução de textos e tokens do projeto.

## Escolha rápida por necessidade

| Necessidade | Cult UI | Veredito | Antes de usar | Compare com |
|---|---|---|---|---|
| Copiar chave, comando ou URL | `copy-button` U121 | recomendado | Textos em pt-BR, erro de cópia visível, alvo de 28 px em tabela densa | |
| Cadastro ou configuração em etapas | `wizard-expandable` U137 | recomendado | Modo controlado para o clique fora não descartar campos; validação real em `canNavigateToStep` | `toolbar-expandable` U057 é a versão anterior |
| Campo com rótulo, descrição e erro | `halo-field` U131 | recomendado | `aria-describedby` e `aria-invalid` ligados ao controle | Field do projeto |
| Status de tarefa em segundo plano (exportação, upload, gravação) | `dynamic-island` U009 | adaptar | Ver a seção própria abaixo | Toast ou barra de status do projeto |
| Upload de arquivos | `halo-dropzone` U116 | adaptar | Validar `accept`, `multiple` e tamanho também no drop; "Upload complete" só com envio real | `18-arquivos-editores-07` do acervo |
| Toast | `halo-toast` U128 | adaptar | Sem trilha nem blobs, botão fechar com nome, erro sem fechar sozinho | Sonner puro |
| Campo de prompt de IA | `prompt-composer` U136 | adaptar | Sem shader nem blobs; texto visível quando desabilitado; `aria-live` no envio | `06-chats-ia-04` assistant-ui |
| Biblioteca de prompts e instruções de IA | `prompt-library` U047, `ai-instructions` U048 | adaptar | Prévia acessível por foco no lugar do hover card; Lucide no lugar de Hugeicons | |
| Votação de roadmap ou enquete | `feature-voting` U044 ou `choice-poll` U042 | adaptar | Botão nomeado pelo item; `radiogroup` nativo no lugar de `listbox` | Adote um só de cada par |
| Apresentar recurso novo | `intro-disclosure` U049 | adaptar | Corrigir Skip e checkbox no mobile; setas só com foco no passo | `onboarding` U071 |
| Drawer no celular com várias telas | `family-drawer` U065 | adaptar | Resetar a tela ao fechar; anel de foco do tema | Sheet do projeto |
| Abas | `halo-tabs` U124 | adaptar | Indicador por token, `focus-visible` no painel | Tabs do projeto |
| Dia, semana, mês | `halo-segmented` U125 | adaptar | Nome do grupo; sem brilho em tela densa | `halo-toggle-group` U126 é cópia |
| Cor de etiqueta ou tema | `color-picker` U030 | adaptar | Corrigir a regex HSL e o `onChange` no mount; nomear controles | |
| Valor de KPI que muda | `rolling-number` U020 | adaptar | `tabular-nums`, `pt-BR` explícito, valor final para leitor de tela | |
| Kanban | `kanban-board` U112 | referência | Só o visual; arraste precisa de teclado | `picks-calendarios-quadros-graficos.md` |
| Gráfico | `analytics-chart` U111 | referência | Só a anotação por callout; sem eixos nem teclado | `17-graficos-analiticos` do acervo |

## Regras deste catálogo

1. **Família halo (15 componentes).** Borda em gradiente com hex fixos (`#ff0080`, `#7928ca`, `#00d4ff`) e blobs com blur animados em loop, um conjunto por instância. Em tela operacional, remova blobs e trilha e troque os hex por tokens. 14 dos 15 tratam movimento reduzido, mas o loop continua em `halo-select` (`ui/halo-select.tsx:289-330`), `halo-button` (`ui/halo-button.tsx:339-387`) e nos blobs de `halo-search` (`ui/halo-search.tsx:562-597`). `halo-badge` com três blobs por unidade não aguenta coluna de tabela.
2. **Sobreposições de morph não trazem comportamento.** `popover`, `popover-form`, `floating-panel`, `morph-surface` e `expandable-screen` não têm `role=dialog`, contenção nem retorno de foco. No navegador, `popover`, `popover-form` e `floating-panel` abriram com Enter e focaram o campo; depois do Escape o foco caiu no `body`, e o `floating-panel` manteve `aria-expanded=false` aberto. O comportamento vem de Radix, Base UI ou vaul; do Cult UI aproveite só a animação. `family-drawer` (vaul) e `poll-widget` devolveram o foco ao gatilho.
3. **Movimento reduzido.** 28 dos 137 tratam no código. Componentes em `motion/react` sem tratamento próprio só respeitam a preferência com `MotionConfig reducedMotion="user"` na raiz do app.
4. **Pares duplicados.** `choice-poll` e `feature-poll`, `feature-voting` e `vote-tally`, `halo-segmented` e `halo-toggle-group` (idênticos byte a byte depois de normalizar os nomes). Adote um de cada par.
5. **Ícones.** Lucide em 31 componentes, Hugeicons em `prompt-library`, `ai-instructions` e `base-select`, Tabler em `apple-keyboard` e `apple-pro-display-xdr`. Troque pela família do projeto; não misture.
6. **Arraste.** `sortable-list` reordena só por ponteiro (o handle é `div` com `onPointerDown`, `ui/sortable-list.tsx:175-178`) e `kanban-board` usa só DnD HTML5. Exija sensor de teclado ou ação "mover para".
7. **Textos fixos em inglês** em quase todos, inclusive `aria-label`. Traduza antes de entregar.

## Dynamic Island (U009)

Ilha preta que muda de tamanho com Motion entre presets (`compact`, `large`, `tall`, `long` e outros), com fila de animações agendadas. Em software serve como indicador de tarefa em segundo plano: exportação, upload, gravação, chamada. Veredito: adaptar.

Defeitos medidos:

- Leitor de tela não recebe nada: o contêiner não tem `role` nem `aria-live` (`ui/dynamic-island.tsx:374-396`), e a API pública só aceita `children` e `id`.
- Sem movimento reduzido no arquivo.
- Largura fixa de 371 px em `long`, `large`, `medium` e `tall` (`ui/dynamic-island.tsx:101-120`). Na demo em 390 px a ilha passa das bordas do cartão; num celular de 360 px estoura a tela.
- `setSize` recusa voltar ao tamanho anterior (`ui/dynamic-island.tsx:237`), o que quebra o ciclo ocioso, tarefa, ocioso.
- A fila usa `setTimeout` sem limpeza (`ui/dynamic-island.tsx:220-232`); o foco se perde quando o conteúdo troca.
- O texto "loading" da demo sai cinza escuro sobre preto.

Receita para usar: região `role=status` com `aria-live=polite` fixa dentro da ilha, fora da troca animada; `useReducedMotion` com troca de tamanho instantânea; largura `min(preset, 100vw - 32px)`; corrigir `setSize` e limpar a fila; cores por token. Capturas dos estados em `catalogos/cult-ui-2026-10-07/interacao/dynamic-island-estado-*.jpg`.

## Vereditos com código lido (59)

### Recomendado (3)

| ID | Componente | Condição |
|---|---|---|
| U121 | copy-button | Traduzir os textos para pt-BR, mostrar feedback de erro quando a cópia falhar e conferir o token bg-code e o alvo de toque (28px no overlay) antes de usar em tabela densa. |
| U131 | halo-field | Usar o Field do projeto direto (ou este alias) e ligar descrição e erro ao controle por aria-describedby e aria-invalid. |
| U137 | wizard-expandable | Passar rótulos em pt-BR (editar os três aria-label fixos), usar o modo controlado para que o clique fora não descarte dados digitados e ligar canNavigateToStep à validação real. |

### Adaptar (29)

| ID | Componente | Condição |
|---|---|---|
| U005 | timer | Trocar aria-live por off (ou anunciar só marcos), atualizar por segundo em vez de por frame, aceitar startedAt e acumular tempo na pausa, e substituir hsl(var(--muted)) por token compatível. |
| U009 | dynamic-island | Ver a seção Dynamic Island. |
| U020 | rolling-number | Adicionar tabular-nums, locale pt-BR explícito no format, snap sob reduced motion e um aria-label ou texto sr-only com o valor final. |
| U029 | floating-panel | Trap e retorno de foco (ou trocar por Popover ou Dialog de primitivo), aria-expanded real, reposicionamento com clamp na viewport, reduced motion e não descartar o texto digitado sem confirmação. |
| U030 | color-picker | Corrigir a regex, remover o onChange do mount, nomear range, presets e campo, dar teclado à área S/L (ou escondê-la) e respeitar reduced motion. |
| U042 | choice-poll | Trocar listbox/option por radiogroup ou grupo de checkboxes nativo, corrigir o controle com valor vazio, adicionar motion-reduce e aria-live no resultado. |
| U043 | feature-poll | Mesmas correções de choice-poll; manter apenas uma das duas no projeto. |
| U044 | feature-voting | Nomear o botão pelo título do item, manter aria-label fixo com aria-pressed, trocar o div do Group e adicionar estado pendente e erro antes de ligar ao servidor; adotar só um entre feature-voting e vote-tally. |
| U045 | vote-tally | Mesmas correções de feature-voting. |
| U047 | prompt-library | Trocar o hover card por prévia acessível por foco (painel inline ou aria-describedby), dar feedback de cópia com aria-live, traduzir strings e trocar hugeicons por lucide. |
| U048 | ai-instructions | Expor o estado marcado com texto sr-only ou trocar por lista de Checkbox dentro do popover, e trocar hover card, ícones e strings antes de usar como seletor múltiplo. |
| U049 | intro-disclosure | Corrigir o Skip e o checkbox no mobile e o auto-fechamento no mount, restringir as setas ao foco nos controles de passo, traduzir textos, proteger o localStorage com try/catch (ou persistir no servidor) e respeitar reduced motion. |
| U060 | code-block | Completar o padrão de abas (tabpanel, setas, foco visível), anunciar a cópia com aria-live, tratar erro de clipboard, trocar zinc por tokens e prever máscara para segredos. |
| U065 | family-drawer | Garantir a utilidade shadow-focus-ring-button (ou trocar pelo ring do tema), usar o gatilho via asChild, resetar a view ao fechar, adicionar reduced motion e rótulo traduzido ao botão de fechar. |
| U071 | onboarding | Rótulos traduzidos, nome acessível do ChoiceGroup (aria-labelledby), foco visível nos radios sr-only, foco no título do passo e padrão de tabs completo (tabpanel, Home e End) ou Tabs de primitivo. |
| U114 | collab-avatar | Aceitar cor por token e derivar fundo com color-mix, fixar a cor do texto das iniciais para garantir contraste AA e prever imagem como alternativa. |
| U116 | halo-dropzone | Validar accept, multiple e tamanho também no drop, trocar 'Upload complete' por estado real da fila, nomear o progressbar, dar role e aria ao alvo de drop e remover trilha, blobs e logos de marca. |
| U124 | halo-tabs | Trocar o gradiente rgba por token (primary ou ring), dar focus-visible ao painel e conferir a versão do @base-ui/react antes de usar. |
| U125 | halo-segmented | Adicionar aria-label ou aria-labelledby ao grupo, remover o brilho animado em telas densas e trocar os hex do brilho por tokens. |
| U126 | halo-toggle-group | Adotar apenas um dos dois (halo-segmented), com as mesmas correções; manter este só se ganhar seleção múltipla de verdade. |
| U127 | halo-notification | Montar o container role=status antes do conteúdo, tornar os aria-label configuráveis e traduzíveis, devolver o foco ao fechar e remover blobs e trilha para uso funcional. |
| U128 | halo-toast | Manter o Sonner, simplificar o cartão (sem trilha nem blobs), nomear o botão fechar, remover o role=group aninhado, usar duration Infinity em erro e trocar o styled-jsx por CSS global do projeto. |
| U129 | halo-switch | Contraste não textual medido no navegador: 1,86:1 ligado e 1,56:1 desligado contra fundo branco (mínimo 3:1); escureça trilho e borda com token do projeto antes de usar. |
| U130 | halo-input | Remover os blobs animados e o arco-íris hex (usar tokens), reduzir a altura ao padrão denso do projeto e ligar descrição e erro por aria-describedby. |
| U132 | halo-progress | Exigir label ou aria-label, trocar a faixa estática em reduced motion por indicação textual, remover o glow em loop e criar variantes de erro e sucesso por token. |
| U133 | border-beam-input | Auditar o pacote border-beam (reduced motion, cores por token, custo de render), usar em um único campo de destaque e subir a fonte para 16px no mobile. |
| U134 | halo-badge | Remover os blobs por padrão, mudar interactive para false, subir a fonte para pelo menos 12px e, se o valor muda ao vivo, envolver em role=status. |
| U135 | halo-select | Aceitar valores string, rotular o trigger (Field.Label ou aria-labelledby), parar os blobs em reduced motion, não desabilitar em loading e reduzir altura e efeitos para uso denso. |
| U136 | prompt-composer | Remover shader, blobs e fundo ambiente, corrigir o texto invisível em disabled, expor placeholder nativo e aria-live para o estado de envio antes de usar. |

### Referência (14)

| ID | Componente | Condição |
|---|---|---|
| U010 | direction-aware-tabs | Para abas reais use Base UI ou Radix Tabs (ver halo-tabs) e reaproveite só o slide direcional com altura medida, respeitando reduced motion. |
| U012 | border-beam-button | No máximo uma ação destacada por tela, depois de revisar o pacote border-beam (reduced motion e custo de render) e fixar a versão. |
| U021 | sortable-list | Estudar o Reorder e a exclusão em duas etapas; em produção usar biblioteca com sensor de teclado (por exemplo dnd-kit) ou botões mover para cima e para baixo. |
| U028 | popover | Só o morph; para entrega montar sobre Radix ou Base UI Popover (foco, Esc, aria) e dar label ao campo. |
| U034 | popover-form | Estudar só a máquina idle, loading e success; reconstruir com Dialog ou Popover acessível, Esc, aria-live no sucesso e botão desabilitado durante o envio. |
| U035 | expandable | Usar Collapsible ou Accordion de primitivo pela semântica e reaproveitar só a medição de altura, com larguras fluidas e reduced motion. |
| U046 | poll-widget | Estudar a composição inline, popover e diálogo; não copiar o sucesso otimista nem a cadeia de timers; ligar o sucesso ao resultado real do envio. |
| U057 | toolbar-expandable | Preferir wizard-expandable, que acrescenta tablist, Esc, reduced motion e validação sobre a mesma estrutura. |
| U063 | morph-surface | Aproveitar a API de render props e o morph; antes de uso exigir label no textarea, Esc global no painel, Ctrl+Enter, retorno de foco, reduced motion e estado de erro no envio. |
| U066 | expandable-screen | Só o morph de cartão para tela cheia; montar sobre Dialog com foco, Esc e inert no fundo, e gatilho como button. |
| U111 | analytics-chart | Só a anotação por callouts fixos; para gráfico real, biblioteca com eixos, resumo ou tabela acessível, navegação por teclado e formatação pt-BR. |
| U112 | kanban-board | Só o visual de card e coluna; para board real usar dnd-kit ou pragmatic-drag-and-drop com sensor de teclado, handle focável, anúncios aria-live e um menu "mover para". |
| U117 | halo-search | Estudar só os estados limpar e carregando; usar o Input do design system com botão limpar nativo, aria-live e foco visível, sem shader nem blobs. |
| U120 | halo-button | Estudar só o estado de loading; remover os blobs infinitos ou condicioná-los a reduced motion, traduzir loadingText e testar o rótulo em leitor de tela. |

### Não recomendado (13)

| ID | Componente | Motivo |
|---|---|---|
| U007 | minimal-card | Cartão de galeria com contraste insuficiente no escuro e sem tokens; use o Card do design system. |
| U013 | family-button | Sem acesso por teclado nem nome acessível (toggles em div com onClick), tema fixo. |
| U014 | side-panel | Sem semântica, sem tema e sem função de painel lateral; use Sheet ou Drawer. |
| U022 | dock | Efeito decorativo de mouse, sem nome acessível nem equivalente de teclado. |
| U032 | edge-blur | O desfoque cobre dados e custa render; para indicar rolagem use máscara de gradiente ou sombra no cabeçalho fixo. |
| U072 | gradient-button-group | Dados fixos, tema fora dos tokens, sem foco visível e animação contínua. |
| U073 | terminal-animation | Para log de execução construa um viewer com role=log, rolagem controlada e cópia, sem digitação animada. |
| U095 | ai-blob-warp | Para avatar de agente use iniciais ou ícone estático do design system. |
| U102 | speech-bubble | Para mensagens use componente de chat ou alerta com texto semântico. |
| U113 | agent-suggest-card-stack | Lista de sugestões com progresso pede HTML semântico (ul, progress, button) e dados reais. |
| U115 | collab-toolbar | Botões sem ação, rótulos técnicos em inglês e fallback que envia nomes ao pravatar.cc. |
| U119 | file-icons | Para tipo de arquivo use ícones da família do projeto por mimetype; logos de marca só os autorizados. |
| U122 | halo-card | Use o Card do design system; aproveite no máximo a API de slots com data-slot. |

## Sem leitura de código

Acabamento e primitivas (5): `texture-button` U003, `texture-card` U004, `base-select` U079, `base-tooltip` U080 e `border-beam-card` U123. Entram na busca padrão com "sem revisão de código"; leia o arquivo antes de adotar.

Marketing e vitrine (73), fora da busca padrão. Servem a landing page pedida, com outra skill conduzindo a direção; esta skill não cobre marketing.

| Grupo do site | Itens |
|---|---|
| Landing Pages (12) | bg-media, tweet-grid, logo-carousel, feature-carousel, hero-dithering, hero-color-panel, hero-static-radial-gradient, hero-heatmap, hero-liquid-metal, marketing-hero-analytics, marketing-feature-code, feature-sticky-section |
| Illustrations (15) | gateway-endpoint-illustration, gateway-route-illustration, gateway-svg-illustration, illustration-card-grid, illustration-cursor, illustration-comment-bubble, illustration-fluid-rendering, illustration-globe-vercel, illustration-graph, tabs-illustration-vercel, circuit-board, fluid-ai-workloads, security-checkpoint, merging-bubbles, globe |
| Media & Mockups (10) | three-d-carousel, loading-carousel, hover-video-player, youtube-video-player, mock-browser-window, apple-iphone-17-pro, apple-keyboard, apple-watch-ultra, mac-screen, apple-pro-display-xdr |
| Backgrounds & Effects (14) | canvas-fractal-grid, bg-animated-fractal-dot-grid, bg-animated-gradient, bg-image-texture, shader-lens-blur, dither-image, stripe-bg-guides, svg-shapes, svg-shapes-animated, svg-bands, grid-beam, texture-overlay, distorted-glass, fluted-glass |
| Typography (11) | text-animate, gradient-heading, typewriter, lightboard, neumorph-eyebrow, text-gif, squiggle-arrow, pixel-heading-character, pixel-heading-word, pixel-paragraph-words-inverse, pixel-paragraph-words |
| Buttons (5) | cosmic-button, bg-animate-button, neumorph-button, metal-button, organic-button |
| Cards (6) | shift-card, cutout-card, folded-card, shadow-card, organic-card, organic-card-small |

Os cinco `hero-*` e `fluted-glass` dependem de `@paper-design/shaders-react` (WebGL), e `globe` depende de `cobe`; meça o custo antes de pôr numa página com dados. A mesma dependência aparece em `halo-search`, `prompt-composer` e `ai-blob-warp`, cujas condições pedem remover o shader.

## Limites

- O checkout é parcial (`apps/www/registry`, sem `node_modules`); Base UI, Radix, vaul, Sonner e `border-beam` foram avaliados pelo uso no wrapper, não pelo código deles.
- Nenhum teste em leitor de tela. Contrastes do `collab-avatar` e do `minimal-card` são cálculo do revisor; o do `halo-switch` foi medido em captura.
- Versões mudam: confira o registry e o commit antes de instalar.
