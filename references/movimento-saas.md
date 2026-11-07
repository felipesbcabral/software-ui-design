# Movimento em telas de trabalho

Lido no passo 5 quando a tela tem camada (gaveta, folha, modal, menu móvel), troca de estado visível, número que muda, mídia (painel de login, onboarding, estado vazio com demonstração) ou quando o pedido fala em animação. Complementa os tokens de [acabamento.md](acabamento.md). Origem: a auditoria das 58 técnicas da MotionSites Web Builder (MIT, [licença](motionsites-LICENSE.txt)) feita para a web-design-craft 3.9.0, filtrada para tela de trabalho. Vídeo de fundo, entrada coreografada e título que chega são de site de marketing e ficam fora (seção 7).

## Princípio: a frequência decide

Tela usada o dia todo responde a gesto e informa estado; ela não se apresenta. Os valores de site de marketing (entrada de 800 ms, menu de 280 a 500 ms, cascata de 100 ms por item) cansam quem repete a ação duzentas vezes por dia. Tetos: `--motion-state` (160 ms) para estado e `--motion-layer` (200 ms) para camada, de [acabamento.md](acabamento.md). No carregamento de dados, só o skeleton se move.

## 1. Camadas: gaveta, folha e menu móvel

- **Curva de folha:** `--ease-sheet: cubic-bezier(.32, .72, 0, 1)` para gaveta lateral e folha inferior, entrada no token de camada, saída em cerca de 70% do tempo da entrada. Modal e popover continuam com `--motion-out`.
- **Contrato da camada modal:** botão com `aria-expanded` e `aria-controls`; ao abrir, `inert` no resto da página (só `aria-modal` não impede o Tab de sair), foco no título ou no primeiro controle, Esc e clique no fundo fecham, o foco volta ao botão, a camada fecha na navegação e quando a largura passa para o layout de desktop.
- **Rolagem:** o painel rola sozinho com `overscroll-behavior: contain` e mantém a ação principal visível. `body { overflow: hidden }` não trava a página no iOS: fixe o `body` com `top: -scrollY` e restaure a posição ao fechar.
- **Sem JS a navegação existe:** os links estão no HTML; a gaveta é melhoria.
- **Só `transform` e `opacity`.** Animar `width`, `left` ou `height` faz o layout recalcular a cada quadro; o `inspect-ui` acusa como `motion-layout`.
- **Interrupção:** clique durante a animação inverte ou conclui a camada. Trava que descarta o clique por 650 ms parece travamento. Transição CSS inverte sozinha; em JS, cancele a anterior antes de começar outra.
- **Montado até a saída terminar:** toast, popover e menu tocam a saída e só então desmontam; desmontar no clique pula a saída e a camada some num quadro (stageshow@299140f motion.md:90, teaching.md:17).
- **Popover, menu e paleta presos pela borda de onde abriram:** medidos e posicionados antes do primeiro quadro, sem corrigir tamanho enquanto abrem, com altura reservada para a lista mais longa. Sinal de erro: a borda de ancoragem anda com a camada aberta enquanto a pessoa filtra (stageshow@299140f motion.md:100, motion.md:101).
- **Superfície que muda de tamanho** move tamanho, posição e conteúdo numa transição só, sem esticar o texto (nada de `scale` sobre texto legível), e, interrompida, parte da geometria atual (stageshow@299140f motion.md:94, teaching.md:24).

```css
:root { --ease-sheet: cubic-bezier(.32, .72, 0, 1); }
.drawer { transform: translateX(-100%); transition: transform var(--motion-layer) var(--ease-sheet); }
.drawer[data-open] { transform: none; }
.drawer:not([data-open]) { transition-duration: calc(var(--motion-layer) * .7); }
@media (prefers-reduced-motion: reduce) { .drawer { transition-duration: 0ms; } }
```

```js
// Modal drawer: the rest of the page is inert while open; focus goes in and comes back.
function setDrawer(open, drawer, button, page) {
  drawer.toggleAttribute('data-open', open);
  button.setAttribute('aria-expanded', String(open));
  page.inert = open;
  (open ? drawer.querySelector('h2, a, button, input') : button)?.focus();
}
```

## 2. Troca de estado e lista

- **Filtro, aba, ordenação, item expandido:** View Transitions no mesmo documento quando a stack permitir, de 150 a 250 ms; com movimento reduzido ou sem suporte, a atualização acontece direto.
- **Reordenar, inserir ou expandir linha:** FLIP (mede antes, aplica o novo layout, anima o desvio com `transform` até zero). A inserção muda duas coisas, o que chega e o espaço dos vizinhos: anime as duas, e as linhas de baixo descem junto com a nova; ícone que entra ao lado de um rótulo abre largura e gap no mesmo tempo (stageshow@299140f motion.md:92, motion.md:93, teaching.md:36).
- **Cascata:** só na primeira exibição de um conjunto pequeno (até 8 itens, 20 a 30 ms por item, teto de 150 ms). Nunca em refetch, paginação, filtro ou linha de tabela.
- **Item removido com Desfazer:** sai com `opacity` e só depois a lista fecha o espaço, sem animar altura, ou por FLIP (stageshow@299140f teaching.md:22).
- **Mudança dependente vem depois da causa:** editou a célula, o total recalcula 40 a 80 ms depois, com os movimentos sobrepostos; nunca tudo no mesmo quadro nem o total antes da célula. Causa e efeito não é cascata de linha (stageshow@299140f motion.md:61, motion.md:63, teaching.md:30, kit.md:128).
- **Indicador de aba ou segmented** fica montado e, se o clique muda o alvo no meio do caminho, retoma de onde está; recriar o elemento (nova `key`) reinicia da origem (stageshow@299140f teaching.md:18, motion.md:115).
- **Rótulo que troca se move por `transform`** com as duas versões na mesma célula de um grid estável; `margin` animada em itens sobrepostos de inline-grid move a linha de base dos vizinhos. Sinal de erro: o texto ao lado pula um pixel ao fim da troca (stageshow@299140f teaching.md:27).
- **Troca de corpo com o chrome fixo:** cabeçalho, abas e posição das ações ficam; só o corpo faz crossfade, no token de camada, com subida de 8 px. Nunca deslizar a página inteira para o lado (stageshow@299140f motion.md:96, motion.md:169).
- **Região que rola** começa com linhas inteiras; depois de rolar, esmaece só a borda que esconde conteúdo, e o esmaecido some no fim da rolagem (stageshow@299140f motion.md:149).
- **Arrastar com pegada fixa:** o item sai de onde a pessoa o pegou, segue o ponteiro sem transição e mantém o deslocamento da pegada até soltar; o lugar de soltar não viaja, aparece na posição e pula para a próxima (stageshow@299140f motion.md:135, motion.md:141, motion.md:142, motion.md:143).

```js
function swap(update) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) return update();
  document.startViewTransition(update);
}
```

## 3. Chips de filtro e seleção

Cada chip é `button` com `aria-pressed`; o estado aparece no fundo e num ícone de marcação que entra com escala de 0,8 a 1 em 160 ms com `cubic-bezier(.34, 1.56, .64, 1)`, só no ícone. O resumo ("3 filtros, 128 resultados") fica numa região `aria-live="polite"`. Conteúdo recolhido sai do Tab (`inert` ou `hidden`), não só da vista.

## 4. Número que muda

`font-variant-numeric: tabular-nums` em todo número. Transição de valor só quando ele muda por ação ou atualização ao vivo, de 400 a 600 ms. Só o dígito que mudou rola, do último para o primeiro, num slot de largura estável; os inalterados ficam parados, sem interpolação quadro a quadro que borra (stageshow@299140f motion.md:81). Nunca contagem a partir de zero no carregamento: atrasa a leitura e parece dado sendo inventado. O leitor de tela ouve só o valor final (a animação em `aria-hidden`, o valor final em texto acessível). Em movimento reduzido, troca direta.

## 5. Carregamento e conteúdo que chega

- Skeleton com as dimensões finais ([estados.md](estados.md)); brilho linear com ciclo de até 1,5 s, desligado em movimento reduzido.
- Dado chegou, aparece. Conteúdo nunca nasce escondido à espera de animação: se houver entrada, o estado escondido só existe sob uma classe posta pelo próprio script, e um temporizador força o estado final se algo travar.
- Laço de `requestAnimationFrame` para quando não há mudança ou o elemento sai da tela.

## 6. Mídia em tela de produto

Painel de marca do login dividido, onboarding e estado vazio com demonstração:

- Captura parada ou o componente real vêm antes. Vídeo só quando mostra um fluxo que a imagem não mostra, marcado como ilustrativo.
- Clipe de 6 a 12 s, `muted playsinline`, pôster com o primeiro quadro, sem autoplay com movimento reduzido ou `Save-Data`, pausa fora da tela e em aba oculta. Loop de mais de 5 s ganha botão de pausa (WCAG 2.2.2). Passos mostrados no vídeo também existem em texto; vídeo decorativo leva `aria-hidden="true"`.
- Encode: `ffmpeg -i in.mp4 -an -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 28 -pix_fmt yuv420p -movflags +faststart demo.mp4`, pôster com `-frames:v 1`.
- `inspect-ui --reduced-motion reduce` acusa vídeo tocando em `motion-reduced`.

## 7. O que não entra em tela de trabalho

Vídeo de fundo, entrada coreografada da página, título palavra por palavra, embaralhamento, máquina de escrever, palavra rotativa, marquee, órbitas, hover magnético, holofote no cursor, parallax, brilho correndo, borda animada, contagem no carregamento e carrossel automático. Exceção só com motivo registrado: o produto é uma ferramenta de mídia, ou o design system do projeto já usa o efeito.

## 8. Prova

`inspect-ui` com `--reduced-motion no-preference,reduce` (`motion-duration`, `motion-layout`, `motion-reduced`). À mão: abrir e fechar a camada duas vezes rápido (interrupção), Tab não sai da gaveta aberta, Esc devolve o foco ao botão, 390 px com rolagem só no painel, zoom de 200%.
