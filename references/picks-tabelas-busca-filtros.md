# Síntese R4: tabelas, grids, busca, filtros e command palettes

> Revisão profunda de 26/09/2026. IDs como `08-tabelas-grids-04` são fichas do acervo; caminhos `capturas/...`, `paginas/...` e `codigo.txt` são relativos a `<acervo>/revisao-profunda/` ou à pasta do item. Registros completos: `<acervo>/revisao-profunda/componentes-revisados.json`.

Revisão profunda de 34 itens (`08-tabelas-grids-01..18` e `10-busca-filtros-comandos-01..16`).
Registros completos em `componentes-R4.json`. Capturas em `capturas/<id>*.jpg` (129 arquivos, todos
vistos) e logs de interação em `paginas/<id>.txt`. Data: 2026-09-26.

Método: leitura do `codigo.txt` e do `componente.zip` de cada item, captura da demo em 1440x900 com
roteiro por item (ordenar pelo cabeçalho, selecionar linhas, abrir filtro, abrir paleta, forçar estado
vazio, arrastar separador de coluna) e repetição em 390x844 com medição de `scrollWidth`. Métricas de
DOM registradas no log: altura de linha, `aria-sort`, checkboxes marcados, linhas no DOM em listas
virtuais. Guias lidos: Cloudscape Table (usage), Cloudscape filter patterns, Cloudscape property filter
(usage), Carbon Data table (usage), Primer DataTable.

## Contagem por veredito

| Veredito | Itens |
|---|---|
| recomendado como padrão | 9: 08-04, 08-05, 08-17, 08-18, 10-01, 10-04, 10-08, 10-09, 10-16 |
| adaptar | 14: 08-01, 08-02, 08-08, 08-09, 08-10, 08-11, 08-13, 08-14, 10-03, 10-06, 10-07, 10-11, 10-12, 10-15 |
| referência especializada | 6: 08-03, 08-06, 08-12, 08-16, 10-05, 10-14 |
| não recomendado como direção visual padrão | 4: 08-07, 08-15, 10-10, 10-13 |
| descartar | 1: 10-02 (FilterPanel depreciado pela própria IBM) |

## Escolhas ranqueadas

### Tabela de lista simples (leitura, ordenar, paginar)
1. **08-05 Primer DataTable.** Título e subtítulo ligados à tabela, `aria-sort`, paginação "1-10 of 1000",
   skeleton e Blankslate vazio, três densidades de célula. Risco: marcado como experimental no Storybook.
2. **08-14 Untitled UI.** Melhor referência visual para entidades com avatar; em 390 px esconde colunas em
   vez de espremer. Paginação do exemplo é estática e as linhas têm 72 px.
3. **08-08 Mantine TableSort.** Código curto com busca e estado vazio; precisa de `thead` e `aria-sort`.
4. **08-11 HyperUI.** Só marcação estática com rolagem interna correta.

### Grade operacional densa
1. **08-04 Cloudscape Table.** Cabeçalho fixo, resize verificado (179 px para 269 px), preferências com
   página 10/30/50, compacto, listrado, colunas fixas e visibilidade; contador (2/150); linhas de 39 a 40 px.
2. **08-02 Carbon batch actions.** Referência para a barra de ações em lote. Falta estado vazio e a seleção
   continua ativa com linhas ocultas pelo filtro.
3. **08-10 shadcn-admin tasks.** Melhor opção em stack shadcn/Tailwind: facetas com contagem, estado na URL,
   barra de lote flutuante. Sem `aria-sort` e "Page 1 of 0" no vazio.
4. **08-01 Fluent DataGrid.** Boa API; a história padrão faz a página rolar na horizontal em 390 px.

### Grade editável
1. **08-17 Cloudscape inline edit.** Lápis no cabeçalho das colunas editáveis, botão no hover, motivo de
   bloqueio em popover, controles desabilitados durante o envio. Único candidato forte do conjunto; o fluxo
   de erro de validação não foi visto na captura.

### Grande volume
1. **08-18 Cloudscape server-side.** Paginação no servidor com skeleton, contagem "(120+)", filtro com
   atraso e seleção limitada à página. Falta cancelar respostas antigas.
2. **08-16 ReUI virtualizado.** Quando a tarefa exige rolagem contínua: 10.000 linhas com 22 a 34 no DOM e
   carga por rolagem. Falta `aria-rowcount`/`aria-rowindex`.
3. **08-06 Material** (rolagem virtual com 2500 linhas e 36 no DOM) e a história de virtualização do
   **08-01 Fluent** como referências por stack.

### Barra de filtro (busca por texto + poucos controles)
1. **08-04 / 08-18 Cloudscape TextFilter** com contagem de correspondências e "Clear filter" no vazio.
2. **08-10 shadcn-admin toolbar**: busca + botões de faceta + "View" para colunas + Reset.
3. **08-13 Nuxt customers**: busca, select de status e menu Display.
4. **10-16 Cloudscape saved filters** quando o usuário repete consultas: conjuntos salvos com padrão,
   Update desabilitado sem alteração e estado "(unsaved)".

### Filtros facetados
1. **10-01 Cloudscape property filter.** Propriedades, operadores, tokens, grupos E/OU, consulta na URL.
2. **08-10 shadcn-admin**: facetas em popover com contagem por valor.
3. **10-12 React Admin FilterList**: lista lateral; um valor por faceta por padrão, variante cumulativa.
4. **10-11 HyperUI conjunto 2**: marcação de painel lateral sem comportamento.
   Não usar 10-02 (depreciado) nem 10-10 (dropdowns não fecham e se sobrepõem).

### Command palette
1. **10-08 shadcn CommandDialog.** Dialog modal, foco no campo, grupos, vazio; atalho aceita Ctrl ou Cmd.
2. **10-07 cmdk Raycast.** Referência para submenu de ações por item; o atalho do submenu só usa metaKey.
3. **10-06 cmdk Linear.** Referência para paleta contextual com selo do objeto e atalhos por comando;
   itens sem `onSelect`.

### Busca global
1. **10-09 shadcn-admin CommandMenu.** Ctrl+K abre, itens vêm da navegação, comandos de tema. Ajustar a
   correspondência: "sett" trouxe páginas de erro antes de Settings.
2. **10-04 Spectrum SearchField** para campo de busca em página: estados válido e inválido, limpar, Escape.
3. **10-15 Dice debounce** para sugestões remotas e **10-14 Dice virtualizado** para listas de milhares de
   opções, ambos com correções.

## Anti-padrões observados

- **Rolagem horizontal da página em 390 px** por tabela com largura mínima sem contêiner próprio: 08-01
  (`scrollWidth` 590) e 08-02 (518, botão Download da barra de lote cortado).
- **Layout fixo que espreme colunas** até cada célula virar reticências em tela estreita: 08-07.
- **Ordenação sem `aria-sort`**: 08-08, 08-10, 08-13, 08-15 (estado só no ícone).
- **Reticências sem tooltip** em células e cabeçalhos: 08-01, 08-04, 10-02.
- **Seleção que sobrevive ao filtro** com linhas ocultas: 08-02 manteve "2 items selected" após a busca
  zerar a tabela.
- **Tabela vazia sem mensagem**: 08-02 após busca; 10-05 fecha o painel sem avisar que nada corresponde.
- **Paginação desconectada ou incoerente**: 08-14 com `page={1} total={10}` fixo; 08-10 com "Page 1 of 0".
- **Estado de ordenação global em módulo** compartilhado entre tabelas: 08-15 (`sortingAtom`).
- **Reordenar só com mouse**: 08-09 não moveu linhas com Space/ArrowDown.
- **Rótulo acessível errado**: 08-06 lê a primeira linha como "select row 2".
- **Filtro que compara o id em vez do rótulo**: 10-13 ("C#" não encontra "csharp").
- **Popover de filtro que não fecha** com Escape nem clique fora, e dois abertos sobrepostos: 10-10.
- **Atalho só para macOS**: 10-07 (metaKey) e rótulo "⌘J" fixo em 10-08.
- **Busca remota sem descarte de resposta antiga**: 10-15 e 08-18.
- **Componente depreciado** exibido como opção: 10-02.
- **Demo que só existe no arquivo**: cmdk.paco.me redireciona para o GitHub; 10-06 e 10-07 foram vistos no
  Wayback Machine.

## Regras de seleção para a skill de design

Cada regra cita a fonte. Onde não há número em guia oficial, a regra diz isso.

1. **Paginação por padrão.** Cloudscape recomenda paginação em vez de carregamento progressivo quando a
   paginação funciona, e desaconselha usar os dois juntos, exceto em linhas expansíveis (Cloudscape Table,
   usage). Use carregamento progressivo ou rolagem virtual só quando o usuário precisa ver e comparar tudo
   numa única vista.
2. **Limite para virtualizar: nenhum guia lido fixa um número.** As demos que virtualizam trabalham com
   2500 linhas (08-06), 10.000 linhas (08-16), 10.000 opções (10-14) e 1000 x 100 células (08-03, story
   ManyColumnsAndRows). A skill deve tratar virtualização como requisito de "lista contínua com milhares de
   itens" e exigir `aria-rowcount`/`aria-rowindex`, não como gatilho numérico.
3. **Filtro, ordenação e paginação só com mais de 5 itens**, e mantidos visíveis quando o filtro zera a
   lista (Cloudscape Table, usage).
4. **Cabeçalho fixo** quando houver mais de 30 itens por página, mais de 5 colunas, colunas ordenáveis ou
   ações dependentes de seleção; não usar em rolagem contínua; não é suportado em viewport móvel
   (Cloudscape Table, usage).
5. **Tamanho de página**: oferecer 10, 30 e 50 como no modal de preferências do 08-04; Primer usa rodapé
   com intervalo e total ("1-10 of 1000").
6. **Densidade**: começar em confortável e oferecer compacto como preferência, sem duplicar se o produto já
   tiver modo de densidade global (Cloudscape Table, usage). Carbon oferece cinco alturas de linha, pede
   cabeçalho com a mesma altura das linhas e reserva a maior para conteúdo de duas linhas (Carbon Data
   table, usage). Alturas medidas nas demos: 37 a 40 px em grades densas (08-05, 08-04, 08-07), 45 a 49 px
   em densidade média (08-01, 08-02 tamanho lg, 08-10), 72 a 73 px com avatar (08-13, 08-14). Linha acima
   de 60 px só para listas de pessoas ou entidades com avatar.
7. **Truncamento**: título de coluna longo quebra em até duas linhas e trunca o resto com tooltip (Carbon);
   largura de coluna definida pelo conteúdo, sem quebrar célula em mais de três linhas, com resize ou quebra
   de linha para garantir leitura (Cloudscape). Toda reticência precisa de tooltip ou texto completo
   acessível.
8. **Seleção**: resetar ao paginar, ordenar, filtrar ou mudar o tamanho de página, e não exibir contador
   quando nada está selecionado (Cloudscape Table, usage). A barra de lote substitui a toolbar enquanto
   houver seleção (08-02, 08-10).
9. **Toolbar da tabela** com até cinco ações; o resto vai para menu (Carbon Data table, usage).
10. **Colunas fixas** sem passar de 70% da área da tabela; desativar quando o espaço encolhe (Cloudscape).
11. **Edição inline**: só input, autosuggest, select, multiselect e time input; largura mínima de 176 px
    nas colunas editáveis; célula bloqueada informa o motivo (Cloudscape Table, usage; 08-17).
12. **Escolha do filtro** (Cloudscape filter patterns e property filter usage):
    - usuário sabe o termo exato: filtro por texto;
    - uma ou duas propriedades de valor único: filtro por select;
    - mais de duas propriedades, vários valores por propriedade ou operadores E/OU: property filter;
    - mostrar o operador só quando houver pelo menos dois filtros;
    - não usar property filter em coleções de texto livre longo.
13. **Estados vazios distintos**: "sem itens" para coleção vazia e "sem correspondência" com ação de limpar
    filtro (Cloudscape; 08-04, 08-18).
14. **Mobile**: a tabela rola dentro do próprio contêiner e a página nunca rola na horizontal; alternativas
    válidas são esconder colunas secundárias (08-14) ou trocar para cartões (08-12). Resize de coluna não
    funciona por toque (Cloudscape).
15. **Command palette**: abrir com Ctrl+K no Windows/Linux e Cmd+K no macOS, com o rótulo do atalho
    conforme o sistema; foco no campo ao abrir; grupos com título; estado vazio; ranquear pelo título do
    destino, não pela URL (10-08, 10-09).
16. **Busca remota**: debounce de 300 ms é o valor usado no 10-15; toda busca remota descarta respostas
    antigas e mostra estado de carregamento e vazio.

## Falhas e limites desta rodada

- `cmdk.paco.me` redireciona (307) para o GitHub; 10-06 e 10-07 foram capturados no Wayback Machine
  (snapshot 2025-01-02).
- `react.lightningdesignsystem.com` redireciona (301) para o GitHub; 08-07 foi capturado no Storybook do
  Chromatic.
- Kibo Tags respondeu "Application error" na primeira carga e funcionou na segunda.
- Resize por arraste não mudou a largura na captura headless em 08-01 e 08-07; confirmado só em 08-04.
- 08-17: a linha escolhida tinha edição bloqueada, então o erro de validação não foi visto.
- 08-03 mobile: a captura ficou encoberta pelo menu de resize aberto antes da troca de viewport.
- Nenhum teste com leitor de tela e nenhuma medição de contraste nesta rodada.
