# Layout, densidade e navegação

## Escolha a largura pelo conteúdo

| Família | Distribuição inicial | Sinal de problema |
|---|---|---|
| Lista ou tabela operacional | Área principal fluida, com colunas dimensionadas pelo dado e margens do sistema | Dados truncados ou muitas quebras enquanto há espaço livre nas laterais |
| Formulário | Campos com largura compatível com a resposta; limite de leitura no grupo de campos | Campo de CEP atravessa a tela ou formulário inteiro fica espremido para caber num card |
| Lista com detalhe | Duas regiões quando a tarefa envolve consultar e editar repetidamente | Abrir um registro faz perder filtros, seleção ou posição na lista |
| Calendário, quadro ou editor | Área de trabalho usa o espaço disponível; painel secundário pode recolher | Cabeçalho e cartões de resumo deixam pouco espaço para o trabalho |
| Análise | Grade orientada às comparações e decisões que a pessoa precisa fazer | Muitos indicadores sem unidade, contexto, ação ou relação entre si |

Um limite de largura pode ser correto em telas grandes. Justifique-o pela tarefa e pelo conteúdo. Formulários, ajuda e parágrafos podem ter limites próprios dentro de um shell fluido. Não aplique um único `max-width` a todas as rotas.

Também não estique tudo até as bordas. Em monitores largos, mantenha rótulos e valores relacionados próximos. Use agrupamentos, colunas com limites locais ou um painel contextual quando houver trabalho real para ele. Espaço livre é aceitável quando favorece a leitura; não invente conteúdo para ocupá-lo.

## Densidade verificável

Antes de ajustar espaçamento, registre em uma viewport representativa: onde começa a primeira linha útil, quantas linhas ficam visíveis, quais dados quebram ou truncam e o que exige rolagem. Compare antes e depois com a mesma viewport e o mesmo conteúdo.

Escolha entre confortável e compacta pela frequência, quantidade e dispositivo. Densidade compacta reduz o espaço repetido, mantém fontes legíveis e preserva alvos de interação. Um seletor de densidade só faz sentido quando usuários ou tarefas diferentes precisam dele.

Em listas de trabalho, priorize um título curto, as ações pertinentes, busca e filtros. Resumos extensos, banners e instruções recorrentes podem sair do caminho depois do primeiro uso. Não é necessário manter todos os filtros expandidos, mas filtros ativos e sua remoção precisam continuar claros.

Para muitos registros, escolha o mecanismo de navegação pelo trabalho. Paginação dá posição estável; carregar mais favorece exploração contínua; virtualização resolve custo de renderização quando medido. Virtualizar não reduz a distância até um registro. Busca, filtros, ordenação e navegação entre resultados tratam esse problema.

Não imponha uma quantidade universal de linhas por página ou um limiar fixo para virtualizar. Teste volume representativo e custo real. Não colapse todos os grupos para fazer a página parecer curta; a pessoa precisa encontrar os itens prioritários e entender quantos estão ocultos.

## Estrutura da aplicação

Separe a navegação global da navegação de uma área e das ações sobre um registro. Use sidebar, barra superior, abas ou breadcrumbs quando cada um representar um nível distinto. Evite apresentar os mesmos destinos em três lugares concorrentes.

No desktop, um shell com navegação lateral e área principal fluida costuma servir a produtos com vários módulos. Uma ferramenta de poucos destinos pode funcionar melhor com barra superior. Essa escolha depende da arquitetura da informação, não do rótulo SaaS.

Na web, `min-width: 0` nas regiões flexíveis e `minmax(0, 1fr)` nas grades evitam que conteúdo largo force a página. Defina altura de viewport apenas quando houver uma área de trabalho que realmente precisa dela. Formulários longos podem rolar no documento.

Declare quem rola: documento, lista, calendário ou painel de detalhe. Regiões independentes podem preservar contexto em um editor. Cada uma deve ter limite visível, alcance por teclado e comportamento previsível. Não esconda overflow para disfarçar corte de conteúdo.

## Sidebar

| Parte | Critério |
|---|---|
| Identidade e contexto | Identifique o produto e o espaço de trabalho quando isso altera os dados. Não dedique um bloco grande só à marca. |
| Destinos | Nomes reconhecíveis, agrupados pelas tarefas. A ordem atende à frequência e às dependências do trabalho. |
| Localização atual | Destaque selecionado claramente diferente de hover e foco. Use `aria-current` em links na web. |
| Ícones e contadores | Ícones consistentes podem acelerar reconhecimento; os rótulos explicam destinos. Contadores têm significado e escopo. |
| Configurações e conta | Agrupe ações menos frequentes sem tornar o rodapé inacessível em telas baixas. |

Uma sidebar recolhível precisa de comando explícito, estado expandido acessível e rótulos disponíveis por foco e toque. Tooltip sozinho não resolve descoberta em tela touch. Evite esconder por padrão os nomes que iniciantes precisam ler.

Hierarquias expansíveis usam botões para expandir e links para navegar. Diferencie essas ações. A navegação comum de um site pode usar `nav`, listas e links; não aplique `role="menu"` sem implementar o comportamento de teclado correspondente.

Atalhos e command palette complementam os caminhos visíveis. Se existirem, não devem capturar digitação em campos nem substituir atalhos do sistema. Uma command palette não é condição para um menu parecer atual.

## Responsividade estrutural

Escolha breakpoints quando o conteúdo deixar de caber, usando os tokens do projeto. Valide também larguras intermediárias e alturas baixas. Use a mesma ordem de leitura visual e de foco.

No celular, a navegação pode virar um drawer ou outro padrão existente. Um drawer modal exige foco contido, fechamento acessível, restauração do foco e fundo inerte. Um painel não modal precisa permitir acesso coerente às regiões restantes.

Uma tabela pode reduzir colunas opcionais, oferecer detalhe por linha ou manter rolagem horizontal em região identificada quando a comparação bidimensional for essencial. Não transforme toda tabela em cards automaticamente; isso pode destruir a comparação. Preserve campos e ações necessários.

Em formulários, recomponha grupos para uma coluna quando necessário. Em calendários, considere agenda ou dia em telas estreitas. Barras fixas precisam respeitar teclado virtual, áreas seguras e o espaço do conteúdo. Nada importante deve ficar atrás de um cabeçalho ou botão fixo.
