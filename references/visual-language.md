# Linguagem visual de software

## Direção sem preset obrigatório

Leia a identidade existente, o pedido e as referências aprovadas. Em redesign, identifique o que o usuário rejeitou antes de preservar a aparência por hábito. Em refinamento, mantenha a identidade e resolva o problema dentro dela.

Não substitua um preset bege por um preset cinza. Branco, neutros frios ou quentes, superfícies coloridas e temas escuros podem funcionar. A combinação deve distinguir conteúdo, navegação, controles, seleção e camadas temporárias.

Teste a paleta numa tela completa com sidebar, tabela, formulário, botão, erro e seleção. Amostras de cor isoladas não mostram se a aplicação ficou apagada ou cansativa. Compare alternativas com os mesmos dados e a mesma estrutura.

## Cores e estados

Comece pelos tokens existentes. Mapeie papéis antes de propor novos valores:

| Papel | O que precisa distinguir |
|---|---|
| Superfícies | Fundo da aplicação, conteúdo, painel secundário e sobreposição |
| Texto | Principal, secundário, ajuda e conteúdo sobre ações preenchidas |
| Controles | Contorno, hover, foco, pressionado, selecionado e desabilitado |
| Semântica | Erro, alerta, sucesso, informação e categorias de dados |

A cor de marca não substitui toda a semântica. Um status precisa de texto ou outro sinal além da cor. Diferencie seleção, erro e ação principal sem saturar toda a tela. Bordas e sombras são recursos válidos quando tornam agrupamento e profundidade compreensíveis.

Confira contraste nos pares reais e nos estados. Texto secundário em tamanho normal continua exigindo o contraste de texto normal. Reduzir opacidade sem medir o resultado pode apagar informação útil. Não declare acessibilidade só porque o token tem um nome semântico.

Implemente tema adicional quando o produto ou pedido exigir. Avalie cada tema separadamente. Não inverta cores automaticamente nem acrescente tema escuro como requisito universal.

## Tipografia e alinhamento

Uma família bem escolhida pode atender títulos, rótulos e dados. Fontes de sistema, Inter e Geist não são defeitos por si mesmas. Considere licença, idiomas, leitura em tamanhos de interface e custo de carregamento.

Use a escala do projeto e contraste moderado entre títulos e conteúdo. Títulos de tarefas e configurações não precisam ocupar a primeira dobra como um anúncio. Teste acentos, nomes longos, zoom e expansão de texto.

Alinhe números comparáveis por coluna e use algarismos tabulares quando houver benefício. Indique unidade, moeda e período. Em conteúdo textual, alinhe pelo início da leitura. Truncamento só é aceitável quando a informação completa permanece acessível por um caminho funcional em teclado e toque.

## Acabamento dos componentes

Reutilize famílias de controles e escalas de raio, borda e espaço. Variações podem comunicar hierarquia, como botão primário preenchido e ação secundária discreta. Não faça todo controle parecer igualmente importante.

Ícones prontos são válidos. Preserve uma família coerente, tamanhos e alinhamento óptico. Ícone decorativo não ganha nome acessível redundante; botão de ícone precisa de nome que descreva a ação. Não redesenhe ícones comuns só para alegar originalidade.

Cards servem para agrupar entidades ou regiões independentes. Uma lista de cem tarefas costuma precisar de linhas comparáveis. Evite empilhar card dentro de card quando borda, fundo ou espaçamento já separa o conteúdo.

## Movimento e percepção de resposta

Use movimento para explicar abertura, fechamento, mudança de estado ou posição. Operações repetidas devem responder sem esperar uma apresentação. Respeite movimento reduzido e preserve o resultado mesmo quando a animação for removida.

Use os tempos e curvas existentes. Não introduza biblioteca de animação para hover simples. Animações de entrada em cada linha, deslocamento do botão ao passar o mouse e fundos em movimento podem atrapalhar o trabalho; avalie o efeito observado, sem proibir toda técnica de antemão.

## Revisão de aparência

Verifique se a tela parece pertencer ao mesmo produto e se os controles são reconhecíveis. Observe se a área de trabalho recebe mais atenção que o entorno, se a seleção é evidente, se a paleta tem contraste suficiente e se o espaçamento ajuda a agrupar.

“Bonito”, “moderno” e “premium” não bastam como achados. Descreva o efeito: o item ativo se perde, a busca fica distante da lista, títulos empurram dados para baixo, ou todos os botões competem pela atenção. Uma interface familiar e bem resolvida pode ser a melhor escolha.

Para a passada de acabamento antes da prova, use [acabamento.md](acabamento.md). Para tempo e comportamento de skeleton, erro, vazio e conteúdo longo, use [estados.md](estados.md). Os tokens do projeto prevalecem; o inspector pode conferir papéis por seletor em ui-rules.json.
