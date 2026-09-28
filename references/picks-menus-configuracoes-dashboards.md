# Síntese R3: menus, configurações, dashboards e fluxos

> Revisão profunda de 26/09/2026. IDs como `08-tabelas-grids-04` são fichas do acervo; caminhos `capturas/...`, `paginas/...` e `codigo.txt` são relativos a `<acervo>/revisao-profunda/` ou à pasta do item. Registros completos: `<acervo>/revisao-profunda/componentes-revisados.json`.

Revisão profunda de 49 itens (registros em `componentes-R3.json`). Cada item teve código lido, captura em 1440x900 e 390x844 (exceto 07-03 e 07-04, protegidos por login) e interação exercida com Playwright: recolher e expandir sidebar, Tab nos itens, hover em itens só com ícone, abertura de menu de usuário, troca de seção de configurações, abertura de diálogos. Complementa os 22 itens de `componentes.json` sem repetir IDs.

Contagem por veredito: 15 recomendado como padrão, 21 adaptar, 5 referência especializada, 7 não recomendado como direção visual padrão, 1 descartar.

## Achado transversal: rótulo de item só com ícone precisa aparecer no foco

O R1 registrou que o Mantine NavbarMinimal (04-08) mostra tooltip no hover e não no foco por teclado. O mesmo teste foi repetido em todo menu recolhido ou só com ícone desta rodada:

| Item | Hover | Foco por Tab | Nome acessível | Evidência |
|---|---|---|---|---|
| 04-10 shadcn sidebar-07 (trilho) | tooltip | tooltip | sim | `capturas/04-menus-laterais-10-rail-foco.jpg` |
| 04-16 Untitled slim | tooltip | tooltip | aria-label | `capturas/04-menus-laterais-16-foco.jpg` |
| 04-15 Untitled, botão de busca | tooltip | tooltip | aria-label | `capturas/04-menus-laterais-15-foco-busca.jpg` |
| 05-13/04-17 Nuxt recolhido | tooltip | tooltip | não: link sem aria-label nem texto | `capturas/05-menus-superiores-13-recolhido-foco2.jpg` |
| 09-07 CoreUI trilho | expande a sidebar por cima | nada: 64px, sem rótulo | texto oculto | `capturas/09-dashboards-07-recolhido-foco.jpg` |
| 05-11 Untitled header, ícones | tooltip via NavButton | não testado isoladamente | aria-label | `05-menus-superiores-11/codigo.txt:75-83` |
| 04-08 Mantine NavbarMinimal (R1) | tooltip | nada | aria-label | `capturas/mantine-minimal-tooltip-keyboard.jpg` |

Dois defeitos novos aparecem além do tooltip:

1. Painel de segundo nível aberto só por ponteiro. Untitled dual-tier (04-14) e slim (04-16) usam `onPointerEnter` no contêiner; pelo teclado os subitens nunca ficam alcançáveis no desktop, e o painel mostra os filhos do item clicado, não do apontado.
2. Grupos que somem no trilho. No shadcn sidebar-07 o grupo Projects fica oculto e os subitens de Playground não abrem quando a barra recolhe (Enter só alterna um Collapsible invisível).

## Ranking: sidebar

### Expandida

1. **04-15 Untitled, seções com títulos**: grupos rotulados sem cartão por item, contorno de foco de 2px, contadores e atalhos alinhados. Padrão.
2. **04-17 Nuxt shell (R1)**: destinos curtos, equipe no topo, usuário no rodapé.
3. **04-03 Cloudscape SideNavigation (R1)** para console empresarial com seções expansíveis.
4. **04-13 Untitled simples**: bom foco e painel móvel; retirar o cartão "Used space" e aumentar o gatilho do menu de conta, hoje um botão pequeno no canto.

### Trilho recolhível

1. **04-10 shadcn sidebar-07**: único trilho observado com tooltip no hover e no foco, atalho e rail de borda. Condição: grupos com filhos precisam abrir popover no trilho e grupos ocultos precisam de alternativa.
2. **05-13/04-17 Nuxt**: tooltip no foco correto; falta aria-label nos links e no botão de equipe e usuário recolhidos (`05-menus-superiores-13/codigo.txt:54`, `05-menus-superiores-14/codigo.txt:174`).
3. **04-16 Untitled slim**: trilho de 68px bem nomeado; só serve sem segundo nível ou com painel aberto por clique.
4. Evitar: 09-07 CoreUI (sem rótulo no foco), 04-08 Mantine (R1).

### Aninhada

1. **04-13 Untitled simples** com details/summary: Enter expande, subitens recuados, foco visível.
2. **04-01 Fluent Nav (R1)** para um nível de filhos.
3. Não usar: **04-14 Untitled dual-tier** (segundo nível por hover), **04-11 shadcn sidebar-15** como shell de dados (painel direito some abaixo de lg e o miolo fica em `max-w-3xl`).

## Ranking: barra superior

1. **05-01 Cloudscape TopNavigation**: 56px, utilitários nomeados, overflow "More" em 390px, menu de usuário com grupos. Observação: o arquivo arquivado só testa identidade; o exemplo com utilities veio da demo `non-console.html`.
2. **05-03 Primer PageHeader** como cabeçalho de página (não global): link de volta, abas que migram para "More" e ações em menu no celular.
3. **05-12 Untitled cabeçalho móvel**: botão nomeado, painel modal, Escape devolve o foco ao botão.
4. **05-11 Untitled header em duas linhas**: bom para 4 a 6 áreas com subpáginas, mas os rótulos quebram em 1024px.
5. Não usar como navegação de software: 05-06 mega menu (HoverCard não abre por teclado), 05-07 HeaderTabs (sem navegação entre 576 e 767px e sem menu de conta no celular), 05-08 DoubleHeader (portal institucional).

## Layout de configurações

| Forma | Quando usar | Melhor exemplo | Evitar |
|---|---|---|---|
| Abas superiores por rota | até 5 seções, cada uma com uma tarefa | 07-11 Nuxt (validação inline no blur, rota por aba) | abas que cortam sem indicação no celular |
| Seções laterais locais | 5 a 10 seções ou grupos com título | 07-07 shadcn-admin (rota por seção, select no celular) | 07-01 Tabler com itens de 60px e lista inteira antes do conteúdo no celular |
| Página única com cartões | até 3 grupos curtos | 07-13 Nuxt notificações (grupos com switch à direita) | 07-02 Flowbite com um "Save all" por cartão |
| Diálogo | 2 ou 3 preferências rápidas | nenhum aprovado | 07-10 shadcn: navegação some abaixo de md e seção ativa fixa no código |

Regras observadas nos itens aprovados: rótulo e descrição à esquerda e controle à direita (07-11, 07-13); formulário em coluna de 600 a 700px dentro da área, aceitável porque é leitura e preenchimento; erro junto ao campo; zona de risco separada (07-12) com confirmação, que o exemplo ainda não implementa.

Defeitos a bloquear: seleção atual não refletida (07-08 com os dois radios de tema desmarcados), dados incoerentes entre leitura e edição (07-06), consentimento de marketing pré-marcado (15-11), senha só com placeholder (07-12), plano atual não indicado e texto contradizendo preços (07-14).

## Dashboard por densidade

- **Alta (operação, monitoramento)**: 09-01 Cloudscape. Contadores clicáveis, status com ícone e texto, tabelas curtas com "View all", grade de duas colunas na largura inteira. Corrigir eixo com rótulo "2k" duplicado e popover que abre sozinho sobre a saúde do serviço.
- **Média (SaaS geral)**: 09-03 shadcn dashboard-01. KPIs, gráfico com período e tabela com colunas, seleção e paginação na largura útil. Reduzir os KPIs no celular, onde quatro cartões ocupam a primeira tela.
- **Personalizável**: 09-02 Cloudscape configurável, só quando o usuário precisa montar o painel.
- **Evitar**: 09-07 CoreUI (quatro cartões saturados sem semântica, trilho sem rótulo no foco), junto com AdminLTE e Volt já rejeitados no R1.

## Onboarding, estados vazios e fluxos

- Onboarding contextual: **15-07 Cloudscape** (balão ancorado ao campo, lista de passos, Dismiss). Em 390px o painel cobre o formulário; abrir fechado no celular.
- Ativação inicial: **15-11 Tabler** é aceitável em coluna estreita, desde que as etapas tenham número e rótulo e o consentimento venha desmarcado.
- Estado vazio: o melhor observado é o da tabela em 05-01 (`capturas/05-menus-superiores-01.jpg`): título "No pages", explicação curta e a mesma ação primária "Create page".
- Cadastro longo: **15-05 wizard** (etapas à esquerda viram "Step 1 of 4" no celular).
- Perda de dados: **15-06** (modal "Leave page" mais beforeunload).
- Confirmação: **15-01 Fluent** para decisão neutra; **15-02 Spectrum** para destrutiva, com foco inicial fora do botão destrutivo.
- Upload: **15-03 Cloudscape** (botão, restrição e erro por arquivo); **15-04 Spectrum DropZone** só com botão de seleção junto.
- Detalhe e comparação: **15-09 sheet** para editar sem sair da lista; **15-13 split panel** para comparar linhas selecionadas.
- Paginação: **15-08 Primer** (aria-current e rótulos). Tooltip: descartar 15-10 (Tooltip v1 descontinuado) e usar a v2.

## Anti-padrões observados

1. Conteúdo de dados espremido em coluna centrada estreita. sidebar-15 (04-11) limita o miolo a 768px dentro de 1184px disponíveis; HeaderTabs (05-07) e o header Untitled (05-11) centram tudo em contêiner fixo em 1440px. Em tabela, quadro ou dashboard o conteúdo deve ocupar a largura da área de trabalho; coluna estreita só para formulário e leitura.
2. Rótulo de ícone visível só no hover (04-08, 09-07) e segundo nível aberto só por ponteiro (04-14, 04-16, 05-06).
3. Destinos que somem ao recolher a sidebar (04-10) ou ao entrar no breakpoint de celular (04-11 painel direito, 05-07 menu de conta, 07-10 navegação do diálogo).
4. Faixa de breakpoint sem navegação (05-07, 576 a 767px).
5. Navegação duplicada: as mesmas seções na sidebar global e na navegação local (07-07, 07-11) sem ganho.
6. Promoção dentro da navegação: cartões "Upgrade plan" e itens "Upgrade to Pro" (04-10, 04-13, 05-11).
7. Botões só com ícone sem nome (Nuxt topo direito, 05-13) e campos sem rótulo (07-12).
8. Vários botões de salvar com o mesmo texto na mesma página (07-02, 07-05).
9. Tabela que estoura no celular sem rolagem nem versão em lista (15-12).
10. Popover ou painel de ajuda que abre sozinho sobre o conteúdo (09-01, 15-07 no celular).

## Regras de seleção para uma skill de design

1. Menu só com ícone só é aceito se: cada item tem nome acessível próprio (aria-label ou texto oculto), o tooltip aparece no hover e no foco por teclado, e o item ativo tem sinal além da cor. Teste: Tab sem ponteiro até o item e verificar tooltip visível.
2. Sidebar recolhível: todo destino do modo expandido precisa continuar alcançável no trilho (popover para grupos com filhos). Grupo oculto no trilho reprova.
3. Segundo nível de navegação abre por clique ou foco e fecha por Escape; hover pode antecipar, nunca ser o único gatilho.
4. Breakpoints de navegação precisam ser contínuos: em qualquer largura entre 320 e 1920px existe um caminho visível para todas as áreas e para o menu de conta. Teste em 390, 640, 1024 e 1440.
5. Sidebar expandida: grupos com título, 8 a 15 destinos, altura de item entre 32 e 40px, sem cartão por item, rodapé para conta e ajuda, sem promoção.
6. Barra superior de software: até 64px, identidade, busca, até 3 utilitários com nome e menu de conta; overflow em "Mais" abaixo de 768px.
7. Configurações: até 5 seções use abas por rota; 5 a 10 use navegação lateral local com rota por seção e select no celular; até 3 grupos curtos use página única. Diálogo só para ajustes rápidos.
8. Cada seção de configuração tem uma ação de salvar com texto específico ou salvamento imediato com confirmação visível; nunca "Save all" repetido.
9. Estado atual sempre refletido no controle (tema, plano, preferência); consentimentos opcionais começam desmarcados.
10. Zona de risco separada visualmente e ação destrutiva sempre com diálogo cujo foco inicial fica fora do botão destrutivo.
11. Dashboard: escolha por densidade. Operação usa tabelas curtas e status com ícone e texto antes de gráficos grandes; gerencial usa até 4 KPIs, um gráfico com período e uma tabela na largura inteira. Cor de cartão só com significado de estado.
12. Tela de dados (tabela, quadro, dashboard) ocupa a largura da área de trabalho; `max-width` centrado só em formulário, leitura e onboarding.
13. Estado vazio traz título, uma frase e a mesma ação primária da tela cheia.
14. Upload oferece botão de seleção; área de soltar é complemento.
15. Antes de reutilizar código, confirmar que o arquivo arquivado contém o que a demo mostra (05-01 arquivou só variações de identidade; 15-12 só o wrapper; 15-10 a versão descontinuada).

## Limites e falhas

- 07-03 e 07-04 (Devias): demo redireciona para login (`paginas/07-configuracoes-conta-03-login.txt`); login não foi feito e a revisão ficou só no código, `visual: []`.
- 04-05 (Angular sidenav): a documentação não executa o exemplo fora do StackBlitz; capturas mostram só o aviso.
- 05-14: o clique por ponteiro no botão de usuário dentro do painel móvel não abriu em automação; abriu com foco e Enter. Causa não confirmada.
- Avisos de cookies foram ocultados por CSS na captura, sem aceitar nem recusar.
- Contraste não foi medido com ferramenta; observações de contraste baixo são visuais e estão marcadas como aparentes.
- Leitor de tela não foi usado; nomes acessíveis vieram de atributos lidos no DOM.
