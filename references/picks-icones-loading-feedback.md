# Síntese R5: ícones, carregamento, skeletons e feedback

> Revisão profunda de 26/09/2026. IDs como `08-tabelas-grids-04` são fichas do acervo; caminhos `capturas/...`, `paginas/...` e `codigo.txt` são relativos a `<acervo>/revisao-profunda/` ou à pasta do item. Registros completos: `<acervo>/revisao-profunda/componentes-revisados.json`.

Revisão profunda de 46 itens (11-icones-01 a 10, 12-loading-progresso-01 a 13, 13-skeletons-01 a 10,
14-feedback-estados-01 a 13). Registros completos em `componentes-R5.json`. Cada afirmação abaixo
aponta para a evidência que está no registro do item: captura em `capturas/`, texto em `paginas/`,
arquivo local ou fonte no GitHub fixada no commit do acervo.

Vereditos: 13 recomendados como padrão, 24 adaptar, 3 referência especializada, 5 não recomendados
como direção visual padrão, 1 descartar.

Não há tooltip entre os 46 itens; o tema ficou fora desta rodada.

## Como a revisão foi feita

- 87 capturas olhadas, entre páginas de documentação, iframes de Storybook (Fluent, Carbon, Primer)
  e uma folha comparativa de ícones montada com 8 SVGs (search, settings, trash, bell, user, check,
  close, warning) de cada conjunto, baixados nos commits fixados e renderizados a 16 px e 24 px
  (`capturas/11-icones-comparativo.jpg`).
- Interações executadas: envio no InlineLoading do Carbon, Start no overlay do Carbon, Load content
  no Spinner do Primer, Toggle overlay e Toggle Skeleton no Mantine, exemplos de erro e sucesso no
  ProgressBar e no StatusIndicator do Cloudscape, pilha e dispensa no Flashbar, fechar no Banner do
  Kibo, Tab até o botão de fechar nas notificações Carbon e no Blankslate do Primer, viewport 390 px
  em Carbon, Untitled e Kibo.
- Código lido na fonte de implementação, não só nas stories: busca por `prefers-reduced-motion`,
  `aria-live`, `role`, `aria-busy` e rótulo acessível em 60 arquivos baixados nos commits fixados,
  mais o código arquivado nos zips de Untitled, Kibo e shadcn.

## Achados que mudam decisão

1. **Movimento reduzido é desigual.** Respeitam no próprio componente: Fluent (spinner desacelera,
   barra vira pulso, skeleton para), Carbon (loading e skeleton com `animation: none`), Cloudscape
   (mixin `with-motion` e `useReducedMotion` no Flashbar) e o SkeletonBox do Primer (só anima com
   `no-preference`). Não respeitam: barloader e circleloader do Spectrum v3, Loader e Skeleton do
   Mantine (a opção do tema vem `false`), Skeleton e Spinner do shadcn, variantes do Kibo, spinners
   do Untitled. O Spinner do Primer continua girando: o `useMedia` só desliga a sincronização.
2. **Anúncio para leitor de tela quase nunca vem pronto no skeleton.** Só o Fluent coloca
   `role="progressbar"` e `aria-busy` na raiz. Carbon, Primer, Mantine e shadcn entregam blocos
   mudos.
3. **Polidez do anúncio.** InlineLoading e Loading do Carbon usam `aria-live="assertive"` quando
   ativos; o ProgressBar do Cloudscape limita o anúncio a um a cada 5000 ms. O segundo é o modelo a
   copiar.
4. **Toast não traz fila.** O ToastNotification do Carbon tem `role="status"` e `timeout` 0 por
   padrão, mas posição, pilha e limite ficam com o produto. O Flashbar do Cloudscape é o único item
   com pilha, contador por tipo e foco movido para mensagem com `ariaRole="alert"`.
5. **Primer Flash está obsoleto.** A story arquivada está em `Deprecated/Components/Flash` e a URL
   de documentação redireciona para a home; o substituto é Banner.
6. **Ícones: o formato de distribuição pesa mais que o desenho.** A fonte Material Symbols Outlined
   arquivada tem 4.001.608 bytes e não passa por tree-shaking. `feather-icons` e `bootstrap-icons` não
   declaram `module` nem `sideEffects`. Lucide, Tabler, Phosphor, Heroicons, Octicons e Carbon
   publicam ESM com `sideEffects: false`.
7. **Traço entre conjuntos.** Lucide, Tabler e Feather usam grid 24 com traço 2 e ficam
   indistinguíveis na folha comparativa. Heroicons outline usa 1.5. Fluent, Material, Octicons,
   Bootstrap e Carbon desenham por preenchimento. Heroicons outline e Phosphor regular somem a 16 px;
   esses conjuntos exigem o set de 16 (micro) ou outro peso.

## Escolhas ranqueadas por subtipo

### Conjunto de ícones

| Ordem | Item | Veredito | Motivo principal |
|---|---|---|---|
| 1 | 11-icones-05 Lucide | recomendado como padrão | 1854 ícones, traço 2 uniforme, ESM sem efeitos colaterais, commit de 2026-09-24 |
| 2 | 11-icones-01 Fluent System Icons | recomendado como padrão | 16 a 48 px desenhados, regular/filled/light/color; escolha natural em Fluent UI |
| 3 | 11-icones-07 Tabler | adaptar | 5166 outline mais filled, mesmo traço do Lucide; usar no lugar dele, nunca junto |
| 4 | 11-icones-10 Carbon | adaptar | grid 32 com pastas 16/20/24; `warning` é círculo, não triângulo |
| 5 | 11-icones-04 Phosphor | adaptar | seis pesos; fixar peso por tamanho |
| 6 | 11-icones-06 Heroicons | adaptar | grids 16/20/24, mas 316 ícones |
| 7 | 11-icones-02 Material Symbols | adaptar | eixos variáveis; só com subset |
| 8 | 11-icones-03 Octicons | referência especializada | 16 e 24 desenhados; identidade GitHub |
| 9 | 11-icones-09 Bootstrap Icons | referência especializada | grid 16 por preenchimento, sem pacote React oficial |
| 10 | 11-icones-08 Feather | não recomendado | 287 ícones, último commit em 2025-03-11; Lucide é o fork mantido |

### Indicador de espera e progresso

| Ordem | Item | Veredito | Uso |
|---|---|---|---|
| 1 | 12-loading-progresso-07 Cloudscape ProgressBar | recomendado como padrão | tarefa medida com resultado e Retry; anúncio a cada 5 s |
| 2 | 12-loading-progresso-03 Carbon InlineLoading | recomendado como padrão | salvar/enviar no lugar da ação; trocar para `polite` |
| 3 | 12-loading-progresso-02 Fluent ProgressBar | recomendado como padrão | barra determinada ou indeterminada com movimento reduzido |
| 4 | 12-loading-progresso-01 Fluent Spinner | recomendado como padrão | espera curta com rótulo em quatro posições |
| 5 | 12-loading-progresso-09 Primer Spinner | recomendado como padrão | texto oculto para leitor e opção de atraso |
| 6 | 12-loading-progresso-05 e 06 Spectrum | adaptar | API acessível, animação sem movimento reduzido, v3 |
| 7 | 12-loading-progresso-10 shadcn botão | adaptar | anúncio duplicado e `disabled` que tira o foco |
| 8 | 12-loading-progresso-08 Mantine overlay | adaptar | campos continuam focáveis sob a camada |
| 9 | 12-loading-progresso-04 Carbon overlay | adaptar | bloqueia a tela inteira |
| 10 | 12-loading-progresso-11 e 12 Untitled | adaptar | sem nome acessível |
| 11 | 12-loading-progresso-13 Kibo | não recomendado | oito variantes sem papel ARIA |

### Skeleton

| Ordem | Item | Veredito | Uso |
|---|---|---|---|
| 1 | 13-skeletons-02 Carbon DataTableSkeleton | recomendado como padrão | mantém cabeçalhos reais da tabela |
| 2 | 13-skeletons-01 Fluent Skeleton | recomendado como padrão | único com `role` e `aria-busy` na raiz |
| 3 | 13-skeletons-05 e 04 Primer | adaptar | tamanhos ligados à tipografia e ao Avatar, com `delay`; experimental |
| 4 | 13-skeletons-06 Mantine com conteúdo | adaptar | geometria exata, conteúdo provisório no DOM |
| 5 | 13-skeletons-09, 10, 07 shadcn | adaptar | moldura real (Card), sem ARIA nem motion-reduce |
| 6 | 13-skeletons-03 Carbon SkeletonText | adaptar | story padrão é uma barra única |
| 7 | 13-skeletons-08 shadcn tabela | não recomendado | sem cabeçalho nem colunas reais |

### Feedback e estados

| Ordem | Item | Veredito | Uso |
|---|---|---|---|
| 1 | 14-feedback-estados-03 Cloudscape Flashbar | recomendado como padrão | resultado global persistente, pilha e live region |
| 2 | 14-feedback-estados-02 Cloudscape Alert | recomendado como padrão | aviso ligado a seção; anúncio fica com o consumidor |
| 3 | 14-feedback-estados-04 Carbon InlineNotification | recomendado como padrão | erro ou aviso no fluxo; reflow em 390 px |
| 4 | 14-feedback-estados-01 Cloudscape StatusIndicator | recomendado como padrão | ícone mais texto em nove estados |
| 5 | 14-feedback-estados-06 Primer Blankslate | adaptar | vazio com ação; título configurável |
| 6 | 14-feedback-estados-10 shadcn Empty | adaptar | vazio com busca de recuperação |
| 7 | 14-feedback-estados-11 Untitled vazio | adaptar | bom texto; `h1` fixo |
| 8 | 14-feedback-estados-05 Carbon Toast | adaptar | falta gerenciador de fila |
| 9 | 14-feedback-estados-08 Spectrum StatusLight | adaptar | ponto de 8 px depende do rótulo |
| 10 | 14-feedback-estados-09 Spectrum IllustratedMessage | referência especializada | páginas 403/404/5xx; licença das ilustrações |
| 11 | 14-feedback-estados-12 e 13 Kibo | não recomendado | pulso infinito; fechar sem nome acessível e sem severidade |
| 12 | 14-feedback-estados-07 Primer Flash | descartar | obsoleto; usar Banner |

## Tabela de decisão: como mostrar espera

Os limiares vêm do que os próprios sistemas documentam: Fluent recomenda spinner e barra só para
esperas acima de 1 s e skeleton quando a estrutura é conhecida; o SkeletonBox do Primer oferece
atraso de 300 ms e 1000 ms. Interface otimista não tem item no acervo; a linha abaixo é regra
proposta, sem componente de referência.

| Situação | Layout final conhecido? | Avanço medível? | Usar | Exemplo no acervo |
|---|---|---|---|---|
| Resposta costuma chegar em menos de 300 ms | qualquer | não | nada visível; atrasar o indicador 300 ms | Primer `delay="short"` |
| Ação do usuário com resultado quase certo (favoritar, renomear, marcar) | sim | não | UI otimista, com desfazer e reversão explícita em caso de erro | sem item |
| Carga inicial de lista, tabela, card ou formulário | sim | não | skeleton com a geometria final | Carbon DataTableSkeleton, Fluent Skeleton |
| Recarga de conteúdo já exibido | sim | não | manter conteúdo e marcar `aria-busy`; skeleton envolvendo o conteúdo ou overlay local com `inert` | Mantine Skeleton `visible`, Mantine LoadingOverlay |
| Salvar ou enviar a partir de um botão | não se aplica | não | indicador inline no lugar da ação, com texto de estado | Carbon InlineLoading |
| Espera curta em região sem estrutura definida | não | não | spinner com rótulo, atrasado | Fluent Spinner, Primer Spinner |
| Upload, importação, exportação, processamento em lote | não se aplica | sim | barra determinada com valor, anúncio espaçado e estado de erro com nova tentativa | Cloudscape ProgressBar |
| Tarefa longa sem medida de avanço | não | não | barra indeterminada com texto do que está acontecendo; permitir sair da tela | Fluent ProgressBar indeterminada |
| Bloqueio inevitável da tela inteira | não | qualquer | overlay de página, só com foco preso e rótulo | Carbon Loading overlay (adaptar) |

## Tabela de decisão: como mostrar mensagem

| Severidade | Precisa de ação? | Persistência | Alcance | Usar | Exemplo no acervo |
|---|---|---|---|---|---|
| Sucesso ou informação rotineira | não | pode sumir; nunca some com instrução dentro | a ação que o usuário acabou de fazer | toast `role="status"`, com pausa em hover e foco | Carbon Toast (adaptar) |
| Resultado de tarefa longa ou de fundo | às vezes | até o usuário dispensar | aplicação inteira | faixa global empilhável no topo | Cloudscape Flashbar |
| Aviso ou erro de uma seção ou formulário | sim | até resolver | a seção | alerta inline ao lado do conteúdo afetado | Cloudscape Alert, Carbon InlineNotification |
| Condição que afeta a conta ou o produto todo (manutenção, cobrança, limite) | às vezes | enquanto a condição existir | página ou aplicação | banner com severidade e fechar nomeado | Primer Banner (substituto do Flash); Kibo Banner só como base visual |
| Decisão destrutiva ou irreversível | sim, antes de seguir | bloqueia até resposta | tarefa atual | modal de confirmação (`alertdialog`) | Carbon ActionableNotification usa `alertdialog`; modal fora desta rodada |
| Estado de um recurso (ativo, pendente, falhou) | não | enquanto o estado valer | a linha ou card | indicador de status com ícone e texto | Cloudscape StatusIndicator |
| Coleção vazia ou sem resultado | sim, próximo passo | até haver conteúdo | a região da lista | estado vazio com causa e ação | Primer Blankslate, shadcn Empty, Untitled |

## Anti-padrões encontrados

- Spinner girando sem texto e sem rótulo acessível (Untitled LoadingIndicator, variantes Kibo).
- `role="status"` no ícone dentro de um botão que já diz Loading... (shadcn): o leitor anuncia duas
  vezes.
- Botão `disabled` durante envio: o foco sai do botão e o usuário de teclado perde a posição
  (exemplo do shadcn).
- `aria-live="assertive"` para carregamento (Carbon InlineLoading e Loading): interrompe o leitor
  sem necessidade.
- Skeleton que não tem a forma do conteúdo final: tabela sem cabeçalho e colunas genéricas (shadcn
  13-skeletons-08), barra única no lugar de parágrafo (story padrão do Carbon SkeletonText).
- Animação infinita sem regra de movimento reduzido em skeleton e spinner (Mantine, shadcn, Spectrum
  v3, Kibo).
- Indicador de status pulsando o tempo todo (`animate-ping` no Kibo Status).
- Overlay visual que deixa os campos abaixo focáveis (Mantine LoadingOverlay, avisado na própria
  documentação).
- Banner sem severidade e com fechar só-ícone sem nome (Kibo Banner).
- Vários estilos de spinner no mesmo produto (oito variantes do Kibo).
- Dois conjuntos de ícones com o mesmo traço misturados (Lucide com Tabler ou Feather).
- Fonte de ícones completa carregada em app (Material Symbols Outlined com 4 MB).
- Ícone de 24 px com traço fino reduzido para 16 px (Heroicons outline, Phosphor regular).
- Título `h1` fixo em componente de estado vazio (Untitled).

## Regras de seleção para a skill de design

1. Escolher um único conjunto de ícones por produto. Padrão: Lucide. Em Fluent UI, Fluent System
   Icons; em Carbon, Carbon Icons; em Primer, Octicons. Registrar a escolha como token.
2. Só aceitar conjunto com pacote ESM e `sideEffects: false`, ou SVG importado por arquivo. Fonte de
   ícones só com subset.
3. Fixar por tamanho: 16 px usa set desenhado em 16 ou traço ajustado; 20 e 24 px usam o grid
   nativo. Nunca reduzir outline 24 com traço 1.5 para 16.
4. Ícone só-ícone sempre com nome acessível no controle; ícone decorativo com `aria-hidden`.
5. Mapear semântica de alerta por conjunto antes de trocar (o `warning` do Carbon é círculo).
6. Escolher o indicador de espera pela tabela acima: layout conhecido vira skeleton; avanço medível
   vira barra determinada; ação local vira indicador inline; o resto vira spinner com rótulo.
7. Todo indicador que aparece por resposta de rede começa com atraso de 300 ms (valor do `delay`
   curto do Primer). Regra proposta, sem item de referência: depois de aparecer, fica um tempo
   mínimo na tela para não piscar.
8. Todo skeleton tem a geometria da tela final (cabeçalhos reais em tabela, alturas dos tokens de
   campo em formulário) e o container carregando recebe `aria-busy="true"`.
9. Toda animação de espera tem regra `prefers-reduced-motion: reduce` que para ou troca por opacidade.
10. Anúncio de carregamento e progresso usa `polite` e é espaçado (referência: 5 s no Cloudscape).
    `assertive` fica para erro que bloqueia.
11. Erro de carregamento nunca fica como skeleton ou spinner infinito: vira mensagem com causa e
    ação de tentar de novo, no mesmo lugar.
12. Toast só para confirmação que o usuário pode perder sem prejuízo. Erro, instrução e ação
    obrigatória vão para alerta inline, faixa global ou modal.
13. Estado de recurso usa ícone mais texto; cor nunca sozinha; sem animação contínua.
14. Estado vazio diz a causa e oferece o próximo passo; vazio de busca repete o termo e oferece
    limpar filtro; nível do título vem da página.
15. Não copiar Primer Flash (obsoleto) nem as variantes decorativas do Kibo Spinner.

## Limitações desta rodada

- Galeria do Tabler não vista: modal promocional não fechou em três tentativas. A avaliação visual
  usou a folha comparativa.
- Fluent System Icons não tem galeria no Storybook do Fluent; a demo do acervo é o repositório.
- Páginas do Cloudscape exibem banner de cookies da AWS; não foi aceito e cobre o rodapé das demos.
- Leitor de tela real e emulação de `prefers-reduced-motion` no navegador não foram executados; os
  achados de movimento e ARIA vêm do código-fonte lido.
- Pausa de toast em hover e foco não foi encontrada no trecho lido do Carbon; não afirmo que exista
  em outro arquivo.
