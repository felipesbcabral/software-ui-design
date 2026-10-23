# Hallmark em tela de app

Regras de tela de trabalho tiradas do Hallmark v2.0.0 (nutlope/hallmark, MIT, Together AI, commit 7ec8682), seção "App screens" de `flow.md`, `interaction-and-states.md`, `data-viz.md`, `dark-mode.md`, `craft.md` seção 9 e `review-finish.md`. Original em `biblioteca-ui-software/fontes/nutlope--hallmark/`. Adaptado: o foco segue a preferência do proprietário (estado sem contorno), e o alvo mínimo de 24 px do WCAG continua sendo o piso.

## Conteúdo

- A barra: familiaridade conquistada
- O que sai e o que fica
- Os dez compromissos da tela de app
- Três níveis de portão
- Oito estados de controle
- Receita do campo
- Dados: quatro estados por região
- Gráfico e número
- Tema escuro por derivação
- Revisão fria da tela

## A barra: familiaridade conquistada

A ferramenta some dentro da tarefa, e quem domina a categoria confia nela à primeira vista. Bonito em tela de app é hierarquia clara, densidade uniforme e um objeto pelo qual a ferramenta é lembrada (o livro-razão, a linha do tempo, a fila), não uma saudação acima de quatro cartões de número.

## O que sai e o que fica

Saem as regras de marketing: herói, dobra, orçamento de palavras por tela, ritmo de seção, foto ilustrativa, revelação ao carregar. Fica o piso inteiro: tokens, contraste, foco, estados, nenhum sobretítulo, nenhum cabeçalho de tabela em caixa alta espaçada, nenhum número inventado.

## Os dez compromissos da tela de app

1. **Tema empresta paleta, famílias, raio e superfícies**, nunca layout, navegação ou ornamento. Uma família costuma bastar; fonte de sistema é válida. Escala tipográfica fixa com razão de 1,125 a 1,2, sem título fluido, sem fonte de display em rótulo, botão ou dado.
2. **Cor contida.** O acento marca a ação principal, a seleção atual e o estado, nada mais. Um segundo neutro carrega sidebar, barra de ferramentas e painéis.
3. **Casca do próprio projeto.** Casca nova é barra superior; sidebar se justifica com mais de sete destinos, nunca por reflexo, e vira menu abaixo de 60rem (960 px). Abas, breadcrumb e paleta de comandos antes de padrão inventado.
4. **Modal é a última resposta**, depois de edição inline e de disclosure.
5. **Densidade é o design.** Controle de 32 a 40 px com 44 px de área de toque no ponteiro grosso; uma receita de contêiner; tabela antes de cartão; tabela pode ser mais larga que qualquer medida de prosa.
6. **Toda região que carrega dado tem quatro estados** (abaixo). Construir só o estado cheio é desenhar um quarto da tela.
7. **Estado na URL**: filtros, abas e paginação sobrevivem a recarregar e a compartilhar o link.
8. **Desfazer antes de confirmar.** Ação reversível roda na hora e oferece Desfazer por 5 a 10 s. Irreversível (apagar conta, derrubar tabela) mantém a confirmação, e a pessoa digita o nome do que vai destruir.
9. **Movimento é estado, nunca decoração**: durações micro e curtas, nada orquestrado.
10. **Números do produto.** Um indicador é o número e o rótulo em algarismos tabulares; sem ícone em moeda colorida, sem degradê, sem seta de tendência que ninguém mediu. Em redesign, número que a tela já mostra fica.

## Três níveis de portão

- **Piso (nunca dispensável):** contraste, foco visível, nome acessível, estados reais, nada inventado, sobretítulo (rótulo curto acima do título que anuncia o título), rótulo em caixa alta com espaçamento largo, palavra destacada por cor ou itálico dentro do título, pontos médios em série como separador de metadado (`Ana · 3 dias · Alta`), cartão dentro de cartão.
- **Reflexo (corrija ou dispense com motivo da tela):** ponto colorido de status sem texto, ícone dentro de círculo colorido, toast para um efeito que já está visível na tela, paleta de oito cores para categorias, sidebar com três destinos, KPI em parede.
- **Acabamento (responda, não bloqueia):** alinhamento de números à direita, cabeçalho de tabela que não quebra, rótulo de campo a 4 a 8 px do campo.

Dispensa registrada assim: `dispensa <item> · <evidência na tela> · <motivo>`, com motivo de verdade (24 caracteres ou mais).

## Oito estados de controle

| Estado | Quando | Tratamento |
|---|---|---|
| Padrão | Em repouso | Estilo base |
| Hover | Ponteiro em cima, dentro de `@media (hover: hover)` | Um sinal só: degrau de cor, elevação de 1 px ou degrau de borda |
| Foco | Teclado ou foco programático | Na hora, sem contorno: sublinhado, mudança de fundo ou de cor de texto com 3:1 contra o vizinho; `:focus-visible` |
| Ativo | Durante o clique | 1 px para baixo ou um degrau mais escuro |
| Desabilitado | Não interativo | Três canais juntos: `opacity: 0.55`, `cursor: not-allowed` e o atributo `disabled` (ou `aria-disabled="true"` quando precisa continuar focável); perto da atenção, diz por quê |
| Carregando | Processando | Progresso inline; o rótulo continua legível e a largura não pula |
| Erro | Falhou | Cor de erro na borda e na mensagem, `aria-invalid`; nunca só cor |
| Sucesso | Concluiu | O resultado em si, vindo da resposta do servidor; no máximo um ícone; sem toast; sem sucesso onde não houve requisição |

Controle sem um destes não está pronto. Um botão preenchido por região (diálogo conta como região própria); secundários em contorno ou tipográficos; no máximo dois tamanhos de botão, com 6 px ou mais de diferença; Excluir em estilo secundário, salvo quando excluir é a ação da tela.

## Receita do campo

- **A borda nunca muda de espessura.** Estado vai para `background-color`, `border-color` ou cor do texto; nunca `border-width`, `padding` ou `height`, e nada disso é animado.
- Padrão: borda de 1 px com 3:1 contra o fundo (um fio decorativo não tem isso). Hover: fundo um degrau acima, borda igual. Foco: fundo do campo muda e a borda escurece na mesma espessura. Erro: borda de erro, texto de erro na linha de ajuda, ícone de erro no slot da direita. Sucesso só depois de uma checagem real; some quando a pessoa edita. Carregando: spinner pequeno no slot da direita, campo continua editável.
- Altura igual à do botão ao lado. Slot de cerca de 24 px reservado à direita para limpar, erro ou spinner, para nada reflowar.
- Rótulo visível acima, a 4 a 8 px; placeholder mostra formato (`01 jan 2026`), nunca instrução nem rótulo. Ajuda a cerca de 4 px abaixo numa linha com `min-height: 1lh`; o erro substitui a ajuda nessa linha.
- Valide ao sair do campo depois de tocado, e a cada digitação a partir daí. Erro diz o que quebrou, por quê e o que fazer, ligado por `aria-describedby`. Obrigatório com `aria-required` e palavra visível. Envio desabilitado só durante a requisição; envio que falha leva o foco ao primeiro campo inválido. 16 px no celular; `name`, `autocomplete`, `type` e `inputmode` certos; colar nunca bloqueado; `type` explícito em todo `<button>`.
- Select nativo com chevron no wrapper; checkbox e radio nativos com `accent-color`; switch é checkbox com o mesmo contrato; combobox abre abaixo sem empurrar o conteúdo, `aria-expanded` acompanha, setas navegam, Enter escolhe, Escape fecha.
- Diálogo: `<dialog>` com `showModal()`, `inert` atrás, fecha com Escape, clique no fundo e controle visível; primeiro foco no primeiro elemento interativo.

## Dados: quatro estados por região

| Estado | O que mostra |
|---|---|
| Carregando | Skeleton no formato do que vem (lista, cartão, tabela); spinner só dentro de botão, no lugar do rótulo |
| Vazio | Uma linha dizendo o que está vazio, uma dizendo por que importa, uma ação que preenche. Nunca só "Sem resultados" |
| Erro | O que quebrou e o que fazer, com a ação de tentar de novo |
| Cheio | O conteúdo com volume real e nomes longos |

Em redesign, desenhe os estados para os quais o app já tem lógica e liste os demais para o dono, sem construir lógica nova.

## Gráfico e número

| O dado é | A forma é |
|---|---|
| Um valor | Bloco de número (número grande e qualificador em palavras), nunca gráfico de uma barra |
| Dois a cinco valores comparados | Linha de números ou barras horizontais |
| Série no tempo | Linha; sparkline quando vive dentro de outro componente |
| Mais de cerca de sete categorias | Tabela; mais cores não é resposta |
| Partes de um todo | Barra horizontal empilhada; nunca pizza, rosca ou medidor |

- Uma série de acento e o resto neutro; se toda série grita, nenhuma é ouvida. Multissérie: rampa de luminosidade no matiz do acento, em ordem fixa.
- Barras com até 24 px de espessura e base sempre no zero; eixo truncado é a versão numérica do número inventado (anote "eixo começa em 94%" quando o dado vive numa faixa estreita).
- Linha de 2 px; marcador só em ponto anotado. Grade de 1 px contínua, 3 a 5 linhas horizontais.
- **Um eixo y.** Duas unidades viram dois gráficos pequenos lado a lado.
- Sem sombra, 3D ou degradê nas marcas (exceto o preenchimento esmaecido da sparkline).
- Texto nunca veste a cor do dado: a série é identificada por uma amostra ao lado do rótulo.
- Algarismos tabulares em toda superfície numérica.
- **A barra do dashboard:** menos números e mais verdadeiros. Um número herói, um gráfico de apoio, uma tabela. A parede de KPI com seis medidores é o tell que esta regra existe para matar.

## Tema escuro por derivação

Tema escuro é uma segunda renderização desenhada do mesmo sistema, nunca `filter: invert()` nem "inverter os cinzas". Só quando o pedido pede os dois modos ou o projeto já tem o sistema.

- Fundo com luminosidade de 12 a 18%, tingido pelo matiz da marca, nunca preto puro. Texto de 92 a 96%, nunca branco puro.
- Elevação é mais clara: +3% de luminosidade por nível. Cartão mais claro que o fundo; cartão mais escuro parece buraco.
- Acento com croma menor e luminosidade 5 a 10% maior; o matiz nunca muda entre modos.
- Fios entre 26 e 34% de luminosidade, conferidos contra a superfície elevada também.
- Corpo de texto 50 unidades mais leve (400 para 350): claro sobre escuro pesa mais à vista.
- Sombra desligada; elevação vem da luminosidade ou de um fio interno.
- Todos os títulos numa cor só. Nunca `invert` ou `brightness` em imagem.
- Os dois modos passam por todas as checagens de contraste, com os pares do escuro conferidos numericamente.
- Alternância: atributo `data-mode` no `html`, salvo em `localStorage` e lido antes da primeira pintura; `color-scheme: light dark` no `:root`.

## Revisão fria da tela

Um agente sem o contexto da construção lê as capturas da tela inteira a 1440 e a 375 (e as de estado), até dez leituras, e responde como alguém fluente na categoria: a hierarquia está clara, a densidade é uniforme, cada controle e tabela funcionam no celular, os estados estão lá. A primeira palavra é `recapture` (captura faltando ou errada), `fix` (achados a seguir, no máximo oito, ordenados por custo) ou `ship`. Fecha com uma linha dizendo o que não pode ser diluído na correção. Em redesign, recebe também as capturas de antes e responde o que a tela antiga fazia melhor.

Orçamento: uma inspeção em lote, um lote de correções, no máximo uma rodada de confirmação.
