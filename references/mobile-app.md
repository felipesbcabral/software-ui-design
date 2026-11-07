# Mobile: app nativo e web no celular

Vale para duas superfícies que pedem decisões diferentes:

- **App nativo**: React Native/Expo, SwiftUI, Jetpack Compose, Flutter. Unidades em pt (iOS) e dp/sp (Android). A plataforma tem convenções próprias de voltar, sheet, menu e tipografia.
- **Web no celular**: a mesma tela web a 390 e 320 px. Unidades em CSS px; as regras de [layout-navigation.md](layout-navigation.md) e a inspeção com `--widths 390,320` continuam valendo.

Não misture as duas: px de CSS não é pt nem dp, e uma tela web encolhida não vira app. Valores conferidos nas fontes oficiais em 04/11/2026; o link de cada um está na tabela.

## Contrato da tela no celular

Some ao contrato do passo 1: plataforma (iOS, Android, ambas, web), postura (uma mão, em pé, em campo, no balcão), conexão (sempre online, intermitente, offline) e a ação que a pessoa faz mais vezes. Uma tela de app tem uma tarefa principal; o resto vai para a pilha (próxima tela), um sheet ou um menu.

## Valores com fonte

| Decisão | Valor | Fonte |
|---|---|---|
| Área de toque iOS | 44 × 44 pt. O controle pode desenhar menor (mínimo de 28 × 28 pt), mas a área de toque continua 44 | [Apple HIG, Buttons e Accessibility](https://developer.apple.com/design/human-interface-guidelines/buttons) |
| Área de toque Android | 48 × 48 dp, mesmo que passe da borda visual do elemento | [Android, Accessibility](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility) |
| Corpo de texto iOS | 17 pt padrão, 11 pt mínimo | [Apple HIG, Typography](https://developer.apple.com/design/human-interface-guidelines/typography) |
| Corpo de texto Android | Escala do Material com base 14; corpo nunca abaixo de 12 sp | [M3 type scale](https://m3.material.io/styles/typography/type-scale-tokens); [Android, Accessibility](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility) |
| Barra de navegação inferior | 3 a 5 destinos. Menos de 3: abas. Mais de 5: não use a barra. Posições fixas, sem rolar | [M3 Navigation bar](https://m3.material.io/components/navigation-bar/guidelines) |
| Tab bar iOS | Navegação, nunca ação. Menos abas navegam melhor; cinco ou menos na lista padrão | [Apple HIG, Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) |
| Sheet iOS | Detents `medium` (cerca de metade) e `large`; Cancelar ou Fechar dispensa sem salvar; deslizar para baixo dispensa; o grabber indica redimensionar | [Apple HIG, Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) |
| Bottom sheet modal Android | Alternativa a menu ou diálogo simples, boa para lista longa de ações. Abre em no máximo 50 % da altura, pode subir até a tela cheia e rolar por dentro; tocar no scrim dispensa; em tela cheia, mostre como fechar | [M3 Bottom sheets](https://m3.material.io/components/bottom-sheets/guidelines) |
| Diálogo | Só para o que bloqueia a operação ou exige decisão. Baixa prioridade vai para snackbar. Sem "Tem certeza?" | [M3 Dialogs](https://m3.material.io/components/dialogs/guidelines) |
| Voltar no Android | Predictive back vem ligado por padrão e é fortemente recomendado. Não intercepte o voltar sem motivo | [Android, Predictive back](https://developer.android.com/guide/navigation/predictive-back-gesture) |
| Gesto de caminho ou multiponto | Alternativa com um toque simples, salvo quando o gesto é essencial (WCAG 2.5.1, A) | [WCAG 2.5.1](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html) |
| Arrastar | Alternativa sem arrastar, salvo quando arrastar é essencial (WCAG 2.5.7, AA) | [WCAG 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) |

## Regras de composição

1. **Navegação de topo pelo número de destinos.** De 3 a 5: barra inferior com ícone e rótulo sempre visíveis. Mais que isso: os 4 mais usados na barra e o resto numa aba "Mais" ou em drawer. Menu hambúrguer escondendo destinos principais é o erro mais caro: o destino some da vista.
2. **Uma tela, uma tarefa.** Detalhe abre na pilha, com voltar no topo (iOS) e voltar do sistema (Android). Tarefa curta e reversível abre em sheet; decisão que bloqueia abre em diálogo; nunca sheet sobre sheet.
3. **Ação principal ao alcance do polegar.** Barra inferior fixa ou botão no fim do formulário, acima do teclado e da área segura. FAB só para a ação mais frequente da tela, uma por tela.
4. **Lista antes de tabela.** No celular, linha de lista com título, metadado e valor alinhado à direita (algarismos tabulares). Tabela só quando a comparação entre colunas é a tarefa; nesse caso rolagem horizontal identificada e primeira coluna fixa.
5. **Ação escondida em gesto tem porta visível.** Deslizar a linha, segurar para menu de contexto, arrastar para reordenar: cada uma também existe num botão, menu ou `accessibilityActions`. Deslizar ou segurar para confirmar não substitui confirmação acessível. A linha deslizada continua na lista: a ação é o fundo da própria linha, mesma altura, de borda a borda, revelada conforme a linha sai de cima dela, nunca um cartão arredondado separado com folga. Ao soltar, a linha segue na velocidade do dedo; o arremesso cobre cerca de 1/3 da tela em cerca de 250 ms. Confira o quadro no ponto mais aberto do gesto (stageshow@299140f motion.md:160, motion.md:161, teaching.md:105).
6. **Teclado virtual faz parte do layout.** O campo em foco e a ação de enviar ficam visíveis com o teclado aberto. Cada campo declara o teclado certo (`keyboardType`), o preenchimento automático (`textContentType` no iOS, `autoComplete` no Android) e a tecla de retorno (`returnKeyType`: próximo, buscar, enviar).
7. **Área segura e barras do sistema.** Conteúdo e barras fixas respeitam notch, Dynamic Island e indicador de início; nada clicável sob eles.
8. **Fonte dinâmica.** Teste no maior tamanho de acessibilidade: texto quebra em mais linhas em vez de cortar, e nenhuma altura fixa corta rótulo. `allowFontScaling={false}` só em ícone ou número de gráfico, com motivo escrito.
9. **Estados do celular.** Além dos quatro por região ([estados.md](estados.md)): offline (o que funciona sem rede e o que ficou na fila), sincronizando, permissão de sistema negada (câmera, notificação, localização) com caminho para os Ajustes, e retomada depois de o app voltar do fundo.
10. **Movimento e háptico com função.** Animação respeita o movimento reduzido do sistema (Reanimated `ReduceMotion.System` ou `useReducedMotion`). Háptico confirma um evento (salvou, falhou, chegou ao limite), nunca decora o toque.

## Antipadrões do celular

- Tabela de desktop espremida a 390 px, com rolagem horizontal não anunciada.
- Ação disponível só no hover ou no clique longo, sem alternativa visível.
- Toast para erro de validação: o erro fica ao lado do campo.
- Modal em cima de modal, ou diálogo para escolher um item de lista (use sheet ou tela).
- Barra inferior usada para ações (Salvar, Novo) em vez de destinos.
- Altura fixa de botão ou linha que corta texto com fonte aumentada.
- Botão de 32 px de altura sem área de toque estendida (`hitSlop`) até 44 pt ou 48 dp.
- Cor literal fora do tema: quebra o tema escuro e os temas nomeados ao mesmo tempo.

## React Native com Uniwind e Reanimated (PanelUI)

Regras do próprio PanelUI que evitam falha silenciosa ([fonte](https://github.com/panel-ui/PanelUI/tree/73e7e3ad9bd83c611108f86955238742f6560edd/skills/panelui)):

- Um único `PanelUIProvider` na raiz; sem ele, Dialog, BottomSheet, Popover, Select e Toast montam e não aparecem.
- Sobreposição controlada por `open` + `onOpenChange`; não a desmonte para fechar, porque ela tem animação de saída.
- `gap-*` em vez de `space-y-*`, que não existe no React Native. Token semântico (`bg-card`, `text-muted-foreground`), nunca `dark:` nem hex.
- Valor arbitrário novo (`h-[330px]`) exige reiniciar o servidor de desenvolvimento; sem isso, a propriedade some sem erro.
- Animação só com Reanimated 4 (`useSharedValue`, `useAnimatedStyle`); o `Animated` do core volta o trabalho para a thread de JS.
- Campo é `Field` + `Label` + controle; tela de configurações é `Frame` + `Frame.Panel` + `Frame.Row`.

Componentes revisados: [picks-panelui.md](picks-panelui.md), índice em [panelui-components.json](panelui-components.json). Busca só de app: `node <skill-dir>/scripts/find-resources.mjs --mobile "sheet"`.

## Prova no celular

| Superfície | Como provar | O que não prova |
|---|---|---|
| Web no celular | `inspect-ui.mjs` com `--widths 390,320`, tema claro e escuro, movimento reduzido | Gesto, teclado virtual real, fonte dinâmica do sistema |
| App nativo | Captura do simulador ou aparelho: `xcrun simctl io booted screenshot tela.png` (iOS) e `adb exec-out screencap -p > tela.png` (Android). Uma por estado, com teclado aberto, tema escuro e maior fonte de acessibilidade | Expo web (`react-native-web`) não prova o nativo: sheet, gesto, teclado e fonte se comportam diferente |
| Leitor de tela | VoiceOver (iOS) e TalkBack (Android) no fluxo principal: cada controle anuncia papel, nome e estado; ordem de leitura segue a visual | Varredura estática de `accessibilityRole` só prova que o atributo existe |

Sem simulador ou aparelho, a prova visual do app nativo fica pendente, com o motivo na entrega. Gravação de demo de terceiro (como as do PanelUI) é referência de aparência, não prova da tela do projeto.
