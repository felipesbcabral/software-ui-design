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
- **Reordenar ou expandir linha:** FLIP (mede antes, aplica o novo layout, anima o desvio com `transform` até zero).
- **Cascata:** só na primeira exibição de um conjunto pequeno (até 8 itens, 20 a 30 ms por item, teto de 150 ms). Nunca em refetch, paginação, filtro ou linha de tabela.
- **Item removido com Desfazer:** sai com `opacity`; a lista fecha o espaço sem animar altura, ou por FLIP.

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

`font-variant-numeric: tabular-nums` em todo número. Transição de valor só quando ele muda por ação ou atualização ao vivo, de 400 a 600 ms. Nunca contagem a partir de zero no carregamento: atrasa a leitura e parece dado sendo inventado. O leitor de tela ouve só o valor final (a animação em `aria-hidden`, o valor final em texto acessível). Em movimento reduzido, troca direta.

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
