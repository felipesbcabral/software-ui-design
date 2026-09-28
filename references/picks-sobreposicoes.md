# Síntese N1: sobreposições (categoria 20-sobreposicoes)

> Revisão profunda de 26/09/2026. IDs como `08-tabelas-grids-04` são fichas do acervo; caminhos `capturas/...`, `paginas/...` e `codigo.txt` são relativos a `<acervo>/revisao-profunda/` ou à pasta do item. Registros completos: `<acervo>/revisao-profunda/componentes-revisados.json`.

Data: 2026-09-26. Escopo: 25 itens novos (`20-sobreposicoes-01` a `-25`) de 11 repositórios oficiais, todos com código salvo sob MIT ou Apache-2.0 e commit fixo. Cada demo foi aberta em Chromium headless e exercitada com hover, foco por Tab, clique, clique direito ou Escape conforme o tipo. Registros em `componentes-N1.json`, metadados em `novos-N1.json`, capturas em `capturas/20-sobreposicoes-*.jpg`, textos e logs de interação em `paginas/20-sobreposicoes-*.txt`.

## Tabela de decisão

| Padrão | Abre com | Conteúdo permitido | Foco | Bloqueia a página | Fecha com | Quando usar | Itens de referência |
|---|---|---|---|---|---|---|---|
| Tooltip | hover e foco de teclado, após atraso | Texto curto, sem link nem botão | Fica no trigger | Não | Escape, blur, mouse sai | Rótulo de botão de ícone, atalho, descrição curta de ação | 01, 02, 03, 04, 05 |
| Toggletip / info tip | clique ou Enter no botão "i" | Texto curto, pode ter link ou ação | Vai para o conteúdo ou fica no botão; Tab alcança o conteúdo | Não | Escape (volta ao botão), clique fora | Explicação de campo ou termo que o usuário pede | 06, 07 |
| Popover | clique no trigger | Controles e campos curtos | Vai para o primeiro controle | Não | Escape (volta ao trigger), clique fora | Ajuste rápido ancorado, detalhe de status, filtro curto | 08, 09, 10, 25 |
| Hover card | hover (e foco, quando suportado) | Pré-visualização opcional | Fica no trigger | Não | mouse sai, Escape | Prévia de perfil, issue ou link cujo destino tem a mesma informação | 11, 12 |
| Menu (dropdown e contexto) | clique, Enter ou clique direito | Lista de ações | Vai para o primeiro item; setas navegam | Não | Escape (volta ao trigger), escolha de item | Ações sobre o objeto atual | 13, 14, 15 |
| Diálogo modal | ação explícita do usuário | Formulário curto ou decisão | Vai para dentro e fica contido | Sim | Escape, botão fechar, ação | Edição curta que exige atenção | 16, 17 |
| Alert / confirm dialog | ação destrutiva | Pergunta, consequência, duas ações | Foco inicial na opção segura | Sim | Escape ou Cancel; clique fora não confirma | Decisão irreversível | 18, 19 |
| Drawer / sheet | ação explícita | Formulário ou detalhe extenso | Vai para dentro e fica contido | Sim (variante overlay) | Escape, botão fechar | Edição lateral mantendo o contexto visual | 20, 21 |
| Tour / coach mark | primeiro acesso ou pedido do usuário | Explicação de funcionalidade, passos | Vai para o passo | Parcial (spotlight) | Escape, pular, concluir | Apresentar funcionalidade nova em poucos passos | 22, 23, 24 |

## Regras

1. Tooltip nunca carrega informação essencial nem conteúdo interativo. A documentação do Base UI trata o tooltip como apoio visual e pede `aria-label` no trigger (captura 04); o Primer avisa em desenvolvimento quando o rótulo do tooltip conflita com `aria-label` (`Tooltip.tsx:265-274`). Link ou botão dentro da dica pede toggletip ou popover (Carbon 06 e Fluent 07 mostram o conteúdo com link e foco alcançável).
2. Tooltip abre no foco de teclado. Verificado com Tab em 01 (shadcn/Radix), 02 (React Aria), 03 (Primer), 04 (Base UI) e 05 (Fluent): em todos o tooltip apareceu com o trigger focado, e em 01, 02 e 03 o trigger recebeu `aria-describedby`. Hover card exige o mesmo cuidado: o Radix (11) abriu no foco, o Mantine HoverCard (12) não abriu.
3. Escape fecha a camada. Fechou tooltip em 01 a 05, toggletip em 06 e 07, popover em 08, 09 e 10, menu em 13 e 15, diálogos em 16 a 19, drawers em 20 e 21, tours em 22 a 24. Com camadas aninhadas, Escape deve fechar só a mais interna: no Mantine (25) um Escape fechou a lista do Select e o popover pai juntos, comportamento a corrigir antes de adotar.
4. Foco volta ao trigger ao fechar. Confirmado em 06, 07, 08, 09, 10, 13, 17, 18, 20, 21 e 23. Falhou ou não foi verificável em 15 (context menu: foco em body, a área de gatilho não é focável), 19, 22 e 24 (foco em body após Escape) e 16 (contenção de foco não confirmada na página de exemplo).
5. Modal só para decisão que bloqueia. Alert dialog para ação irreversível, com foco inicial na opção segura: Cancel em 18 (shadcn) e em 19 (Carbon, que ainda explica as dependências antes de excluir). Confirmação passiva como "Payment successful" (16) cabe em toast ou mensagem inline. Edição curta pode usar modal (17) ou sheet (20); detalhe persistente pede layout, não overlay.
6. Toggletip abre por clique, não por hover. Carbon (06) e Fluent InfoLabel (07) não abriram no hover e abriram no clique, com `aria-expanded` no botão.
7. Menu de contexto não é o único caminho para uma ação. O exemplo shadcn (15) só abre por clique direito na demo; a mesma ação precisa existir num menu visível.
8. Atalhos exibidos em menu e tooltip dependem do sistema. Os exemplos shadcn (13, 15) fixam glifos de macOS (⌘, ⇧).
9. Tour curto, pulável e repetível. Ark (22) e driver.js (24) avançam com seta e fecham com Escape; o driver.js não mostrou anel de foco nos botões (outline 0px), então o estilo de foco precisa ser adicionado.

## Atrasos encontrados nas fontes

| Fonte | Abrir | Fechar ou pular grupo | Evidência |
|---|---|---|---|
| Radix Tooltip (padrão) | 700 ms | skipDelayDuration 300 ms | radix-ui/primitives@f7ecd5a `packages/react/tooltip/src/tooltip.tsx:30,70-71` |
| shadcn/ui TooltipProvider | 0 ms | herdado do Radix | `apps/v4/registry/bases/radix/ui/tooltip.tsx:7-18` |
| React Aria | 1500 ms | 500 ms | adobe/react-spectrum@16eead6 `packages/react-stately/src/tooltip/useTooltipTriggerState.ts:53-54,86` |
| Primer TooltipV2 | short 50, medium 400, long 1200 ms (padrão short) | não definido no mapa | `packages/react/src/TooltipV2/Tooltip.tsx:94-100,123` |
| Base UI Tooltip | 600 ms | não lido | mui/base-ui@45a75a5 `packages/react/src/tooltip/utils/constants.ts:1` |
| Fluent Tooltip | 250 ms (0 se outro tooltip visível) | 250 ms | `react-tooltip/library/src/components/Tooltip/useTooltipBase.tsx:56-57,203` |
| Carbon Tooltip | 100 ms | 300 ms | carbon@7e8c8f7 `packages/react/src/components/Tooltip/Tooltip.tsx:126-127` |
| Radix Hover Card (padrão) | 700 ms | 300 ms | radix-ui/primitives@f7ecd5a `packages/react/hover-card/src/hover-card.tsx:59-60` |
| shadcn Hover Card demo | 10 ms | 100 ms | `apps/v4/examples/radix/hover-card-demo.tsx:10` |
| Mantine HoverCard demos | 1000 ms (demo de delay); grupo 500 ms | 1000 ms; grupo 100 ms | `HoverCard.demo.delay.tsx:10,19`, `HoverCard.demo.group.tsx:9` |

Faixa observada para tooltip: 0 a 1500 ms na abertura. Os valores de 100 a 700 ms concentram os sistemas de design (Carbon, Fluent, Primer medium, Base UI, Radix). O 0 ms do shadcn e os 10 ms do exemplo de hover card fazem a camada abrir em qualquer passagem do mouse; ao adotar, voltar para a faixa dos sistemas de design e manter o atraso curto só quando outro tooltip do grupo já está aberto (Fluent, Radix skipDelayDuration, Base UI Provider).

## Itens e vereditos

| ID | Item | Tipo | Licença | Veredito |
|---|---|---|---|---|
| 01 | shadcn/ui Tooltip (Radix) | tooltip | MIT | recomendado como padrão |
| 02 | React Aria Tooltip | tooltip, foco de teclado verificado | Apache-2.0 | recomendado como padrão |
| 03 | Primer TooltipV2 | tooltip | MIT | recomendado como padrão |
| 04 | Base UI Tooltip em toolbar | tooltip | MIT | adaptar |
| 05 | Fluent UI Tooltip | tooltip | MIT | recomendado como padrão |
| 06 | Carbon Toggletip | toggletip | Apache-2.0 | recomendado como padrão |
| 07 | Fluent InfoLabel | info tip | MIT | recomendado como padrão |
| 08 | shadcn/ui Popover com campos | popover | MIT | recomendado como padrão |
| 09 | Headless UI Popover | popover de navegação | MIT | adaptar |
| 10 | Cloudscape Popover | popover de status | Apache-2.0 | recomendado como padrão |
| 11 | shadcn/ui Hover Card | hover card | MIT | adaptar |
| 12 | Mantine HoverCard | hover card | MIT | referência especializada |
| 13 | shadcn/ui Dropdown Menu | dropdown | MIT | recomendado como padrão |
| 14 | Headless UI Menu | dropdown | MIT | adaptar |
| 15 | shadcn/ui Context Menu | context menu | MIT | adaptar |
| 16 | Headless UI Dialog | modal | MIT | adaptar |
| 17 | shadcn/ui Dialog com formulário | modal | MIT | recomendado como padrão |
| 18 | shadcn/ui Alert Dialog | confirmação | MIT | recomendado como padrão |
| 19 | Carbon Modal de perigo | confirmação destrutiva | Apache-2.0 | recomendado como padrão |
| 20 | shadcn/ui Sheet | drawer | MIT | recomendado como padrão |
| 21 | Fluent OverlayDrawer | drawer | MIT | recomendado como padrão |
| 22 | Ark UI Tour | tour | MIT | recomendado como padrão |
| 23 | Fluent TeachingPopover | coach mark | MIT | recomendado como padrão |
| 24 | driver.js | tour e destaque | MIT | adaptar |
| 25 | Mantine Popover aninhado | popover aninhado em formulário | MIT | referência especializada |

## Limites e falhas

- Headless UI Menu (14): a página de exemplo mantém o menu aberto; Escape e Enter não mudaram `aria-expanded`. Fechamento por teclado não verificado.
- Headless UI Dialog (16): a página de exemplo abriu o diálogo no carregamento e Tab alcançou o botão atrás dele; depois de reabrir por clique, o segundo Tab deixou o foco em body. Contenção de foco precisa de teste em build local.
- Cloudscape (10): banner de cookies na parte inferior da página; não foi aceito nem recusado.
- Ariakit ficou fora: o repositório não tem LICENSE na raiz e os exemplos ficam fora dos pacotes MIT.
- A sonda de papéis ARIA não detectou o tooltip do Base UI (04) nem o hover card do Radix (11); a presença deles foi confirmada nos prints.
- Nenhum item foi testado com leitor de tela real, touch ou medição de contraste.
