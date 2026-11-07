# Componentes bonitos em tela de trabalho

Em SaaS a beleza mora no componente que a pessoa usa o dia inteiro, não na página. Este guia mostra, por família, o que separa o componente fraco do forte, e um teste de olho para conferir na captura. Comportamento e estados continuam em [hallmark-app.md](hallmark-app.md), [components.md](components.md) e [estados.md](estados.md); a primeira escolha de implementação, em [component-picks.md](component-picks.md). Use na passada de acabamento e na revisão fria: escolha as três famílias que dominam a tela e compare cada uma com a sua linha.

## Seis alavancas que valem para todo componente

| Alavanca | Fraco | Forte |
|---|---|---|
| Alinhamento | Rótulo, ícone e texto em bordas diferentes; colunas que não se encontram | Poucas linhas verticais de alinhamento na tela inteira; ícone centrado na altura da linha de texto, não na caixa |
| Ritmo de espaço | Valores soltos (13, 18, 22 px) | Uma escala (múltiplos de 4) e uma regra: espaço dentro do grupo menor que espaço entre grupos; título sobre subtítulo com 4 a 6 px de tinta entre as linhas (line-height 1,3 mais 2 px de gap), e o ar vem do padding da linha (stageshow@299140f craft.md:55) |
| Papéis de tipo | Cinco tamanhos e três pesos sem função | Três ou quatro papéis (título da tela, título de região, corpo, auxiliar) com a escala de 1,125 a 1,2 |
| Hierarquia por contraste | Tudo no mesmo cinza médio, ou tudo em preto | Texto principal forte, secundário um degrau abaixo com contraste de texto normal medido; o peso faz o trabalho antes da cor |
| Cor contida | Acento em ícones, títulos e bordas | Acento só na ação principal, na seleção e no estado |
| Detalhe consistente | Raios 4, 6, 8 e 12 na mesma tela; ícones de 16, 18 e 20 px | Um raio para controles, outro para contêineres; uma família e um tamanho de ícone por densidade |

Medidas que a captura confere em card, painel, gaveta, popover e linha com hover:

- **Texto a 12 px da borda** de janela, card, painel ou linha em hover; 8 px em lista densa. Sinal de erro: texto a menos de 8 px da borda (stageshow@299140f craft.md:53).
- **Vizinhos separados por `gap` fixo de 8 a 12 px**, nunca pela sobra de `justify-content: space-between`; texto nunca encosta na caixa ao lado. Sinal: rótulo e valor colados quando o contêiner estreita (stageshow@299140f craft.md:58).
- **Bordas a 1 a 3 px uma da outra parecem acidente:** alinhe exato ou afaste 8 px ou mais; confira também os cantos (stageshow@299140f craft.md:73).
- **O recuo dá a volta pelo rodapé:** a ação no pé do card ou da gaveta tem o padding do topo; topo folgado não desculpa rodapé espremido (stageshow@299140f craft.md:62).
- **Forma aninhada tem padding igual em todos os lados** (pill dentro do campo, ícone dentro do botão), e raio externo = raio interno + padding: card de 12 px com padding de 4 px leva botão interno de 8 px (stageshow@299140f craft.md:61).

## Por família

### Tabela

- **Fraco:** linhas zebradas e bordas em toda célula, cabeçalho em caixa alta espaçada, números alinhados à esquerda, ações repetidas como ícones em toda linha, coluna de status com ponto colorido sem texto.
- **Forte:** fio horizontal fino entre linhas ou só espaço; cabeçalho no papel auxiliar, em caixa normal, que não quebra; números à direita com algarismos tabulares e unidade no cabeçalho; primeira coluna identifica o registro e é a mais legível; ações da linha aparecem no hover e no foco, com menu de mais ações sempre acessível por teclado e toque; seleção com fundo distinto do hover. Avatar com nome leva cor própria, opaca e discreta; disco cinza só para quem não tem nome; avatares sobrepostos (facepile) recortam um ao outro com fundo opaco, sem transparência que escurece na sobreposição (stageshow@299140f craft.md:16, craft.md:112, kit.md:127).
- **Teste de olho:** desfoque a captura. Ainda se vê qual coluna identifica o registro e onde está a ação principal da tela?

### Barra de ferramentas, busca e filtros

- **Fraco:** busca pequena num canto, filtros espalhados em cinco selects iguais, botão primário longe da lista, filtros ativos invisíveis, barra com um controle só e um lado vazio.
- **Forte:** busca larga junto da lista que ela filtra; dois ou três filtros frequentes visíveis e o resto num controle de mais filtros; filtros ativos como fichas removíveis com contagem de resultados ao lado; altura igual para busca, filtros e botões da barra. Barra equilibrada: os dois lados levam o que o produto põe ali (busca de um lado, ação do outro), ou a barra sai (stageshow@299140f teaching.md:108).
- **Teste de olho:** com três filtros aplicados, dá para dizer quais são e desfazer um em um clique?

### Navegação lateral e cabeçalho da tela

- **Fraco:** sidebar com ícone colorido em cada item, item ativo marcado só pela cor do ícone, título da tela grande como anúncio, breadcrumb e título repetindo o mesmo texto.
- **Forte:** sidebar no segundo neutro, ícones monocromáticos do mesmo tamanho, item ativo com fundo e peso diferentes; título da tela no papel de título com a ação principal na mesma linha; contagem ou contexto discreto ao lado do título quando ajuda.
- **Teste de olho:** em dois segundos, dá para dizer onde a pessoa está e qual é a ação da tela?

### Formulário

- **Fraco:** campos de larguras aleatórias, grupos sem título, rótulo ao lado em uns e acima em outros, botões Salvar e Cancelar com o mesmo peso no topo e no rodapé.
- **Forte:** largura do campo proporcional ao conteúdo esperado (CEP curto, endereço longo); seções com título e uma frase quando a seção não é óbvia; uma coluna de leitura, com dois campos lado a lado só quando são um par (início e fim); barra de ações fixa no rodapé da região com um primário. Receita do campo em [hallmark-app.md](hallmark-app.md#receita-do-campo).
- **Teste de olho:** o olho desce numa linha só, sem zigue-zague?

### Estado vazio

- **Fraco:** ilustração grande genérica, "Nenhum dado encontrado", sem ação.
- **Forte:** ocupa o lugar e a largura do conteúdo que virá; uma linha do que está vazio, uma do porquê importa, uma ação que preenche; quando ajuda, uma prévia em esqueleto esmaecido da forma final. Vazio de filtro é outro estado: mostra os filtros ativos e a ação de limpá-los.
- **Teste de olho:** a pessoa sabe o próximo passo sem ler mais que três linhas?

### Bloco de número e painel

- **Fraco:** seis cartões de KPI iguais com ícone em círculo colorido e seta de tendência sem período.
- **Forte:** um número herói com qualificador em palavras e período; um gráfico de apoio; uma tabela. Números em algarismos tabulares, rótulo acima ou abaixo sempre no mesmo lugar. O cartão em destaque sobe pela superfície do produto (fundo próprio, sombra elevada, rótulo no acento), nunca por anel de acento com halo, que parece um foco que ninguém deu (stageshow@299140f craft.md:109). Regras completas em [hallmark-app.md](hallmark-app.md#gráfico-e-número).
- **Teste de olho:** qual é o número que importa hoje? Se a resposta é "todos", o painel falhou.

### Detalhe do registro e gaveta

- **Fraco:** cartão dentro de cartão, pares rótulo e valor desalinhados, ações espalhadas por seções.
- **Forte:** cabeçalho com identificador, status em texto e ações do registro; pares rótulo e valor numa grade de duas colunas alinhadas; seções separadas por espaço ou fio, não por caixas; gaveta com cabeçalho e ações fixos e rolagem só no corpo.
- **Teste de olho:** os rótulos formam uma coluna reta e os valores outra?

### Modal, menu e paleta de comandos

- **Fraco:** sombra pesada e borda ao mesmo tempo, título genérico ("Atenção"), botões invertidos entre modais, menu sem atalho nem agrupamento.
- **Forte:** uma camada de elevação coerente com o resto do produto; título que diz a ação ("Excluir 3 faturas?"); botões na mesma ordem em todo o produto; menus agrupados por fio com atalhos alinhados à direita no papel auxiliar; item focado marcado por fundo, sem contorno.
- **Teste de olho:** abrindo dois modais diferentes, a pessoa encontra o botão de confirmar no mesmo lugar?

### Status, etiqueta e feedback

- **Fraco:** oito cores de etiqueta, ponto colorido sem texto, toast para o que já está visível.
- **Forte:** três ou quatro semânticas (neutro, sucesso, alerta, erro) com texto sempre; etiqueta com fundo tênue e texto escuro do mesmo matiz, raio do sistema; feedback no lugar da ação (linha atualizada, botão que conclui) antes de toast. Ponto de não lido ou badge fica na calha, à esquerda do avatar ou sobre ele, com 6 px livres e dentro do recuo da linha; a linha não anda quando o ponto aparece, e o título em negrito diz o mesmo (stageshow@299140f craft.md:72, kit.md:125). Ponto, badge e anel ficam inteiros dentro da borda do conteúdo; sinal de erro: badge cortado pelo `overflow` do contêiner (stageshow@299140f craft.md:33).
- **Teste de olho:** em escala de cinza, todo status continua legível pelo texto?

## Como usar na entrega

Na linha **Acabamento** do bloco de entrega, cite as famílias revisadas e o que mudou em cada uma ("tabela: números à direita, ações no hover; filtros: fichas ativas com contagem"). Cada mudança precisa de captura antes e depois com os mesmos dados. Uma família que já estava forte fica como está, registrada como preservada.
