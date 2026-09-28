# Componentes e estados de software

Use esta referência sobre a família afetada. Pesquise e adapte componentes prontos conforme [pesquisa e especialistas](research-and-skills.md); estas orientações são critérios de seleção e integração.

## Contrato de comportamento

Defina para cada controle: ação, entrada, resultado, estado durante espera e recuperação de erro. Implemente apenas os estados aplicáveis. Um link de navegação não precisa de um estado de validação de formulário.

| Situação | Resposta da interface |
|---|---|
| Carregamento inicial | Indicação com dimensões estáveis; skeleton quando a estrutura for conhecida, progresso quando houver medida real |
| Atualização de dados existentes | Preserve conteúdo e contexto enquanto for seguro; mostre a atualização sem piscar ou zerar a lista |
| Vazio inicial | Explique o que pode ser criado ou importado, conforme as permissões |
| Busca sem resultado | Mostre a consulta e um caminho para ajustar ou limpar filtros |
| Falha ou indisponibilidade | Diga o que não foi concluído, preserve entradas e ofereça recuperação possível |

Permissão insuficiente, modo somente leitura e ação desabilitada têm significados diferentes. Não exponha dados ou ações protegidos para tornar a tela mais explicativa. Quando permitido pelo produto, explique por que uma ação está indisponível. A interface não substitui autorização no servidor.

## Botões, menus e sobreposições

Use botão para executar ação e link para navegar. Hierarquia visual segue o fluxo: ação principal do contexto, alternativas e ações de risco. Nem toda seção precisa de um botão preenchido.

Rótulos nomeiam o resultado. Um botão de busca pode dizer Buscar; um ícone de lupa precisa de nome acessível e contexto claro. Preservar a largura durante envio evita deslocamento. Informe pendência e previna submissão duplicada sem esconder o erro ou impossibilitar recuperação.

Ações frequentes ficam próximas do objeto. Um menu de overflow serve a ações secundárias; não esconda nele a ação central só para reduzir ruído. Confirme operações de impacto quando o fluxo exigir; desfazer pode ser melhor para mudanças reversíveis. Não prometa desfazer sem suporte real.

Escolha edição inline, painel ou página pelo tamanho e pela necessidade de contexto. Modal atende uma decisão ou tarefa delimitada. Sobreposições precisam escapar de contêineres que cortam conteúdo, manter camadas coerentes e gerir foco conforme o padrão usado.

## Busca e filtros

Declare o escopo: busca global, desta lista ou deste campo. Rótulo e posição devem tornar isso claro. Mostre consulta atual, resultado e filtros ativos. Limpar busca e limpar todos os filtros são ações distinguíveis.

Para busca instantânea, trate respostas fora de ordem, composição de texto e indicação de pendência. Debounce pode reduzir requisições; não faça o campo esperar para refletir a digitação. Busca por submissão deve aceitar o caminho de teclado esperado pelo controle.

Busca e filtros globais precisam considerar o conjunto completo, não apenas a página carregada. Alterações podem reiniciar a página quando necessário. Preserve filtros e posição ao abrir um detalhe e voltar, conforme o contrato de navegação existente. Não troque o roteador para implementar isso.

Filtros avançados podem recolher, mas o estado aplicado continua visível. Ofereça remoção individual e limpeza quando fizer sentido. Não acrescente filtros decorativos ou chips sem comportamento. Seleção múltipla deixa claro se vale para a página, os registros carregados ou todos os resultados.

## Formulários

| Decisão | Critério de seleção |
|---|---|
| Campo e rótulo | Rótulo persistente e associado, tipo e teclado adequados; placeholder é exemplo ou ajuda |
| Agrupamento | Campos que respondem à mesma pergunta ficam juntos; fieldset e legend quando úteis na web |
| Validação | Momento compatível com a entrada; erro próximo do campo, explicação corrigível e resumo se houver vários |
| Salvamento | Estado claro, valores preservados após falha e prevenção de envio duplicado |
| Saída e retomada | Cancelamento e navegação previsíveis; aviso ou rascunho quando houver risco real de perder trabalho |

Use uma coluna como ponto de partida para preenchimento sequencial. Campos curtos e relacionados podem compartilhar linha se a leitura continuar clara. Nome longo, endereço e descrição não precisam ter a mesma largura de quantidade, data ou código.

Seletores pequenos podem usar controles nativos. Combobox atende listas pesquisáveis; autocomplete precisa de semântica, teclado, seleção e anúncio coerentes. Não construa um select personalizado apenas pela aparência. Confira exemplos acessíveis e o componente já disponível.

Não use type="number" para identificadores que podem ter zeros à esquerda. Defina formato de moeda, data e fuso com o contrato do produto. Aceitar texto exige normalização e validação reais; máscara visual não prova validade.

Confirmações e erros precisam permanecer tempo suficiente para serem compreendidos. Mensagens críticas não dependem apenas de toast transitório. Não adote autosave sem contrato para rascunho, conflito e feedback de salvamento.

## Tabelas, listas e tarefas

Use tabela quando comparar atributos entre registros for a tarefa. Use lista quando o item tiver uma identidade principal e poucos atributos auxiliares. Cards são candidatos quando cada entidade exige conteúdo heterogêneo ou mídia.

Cabeçalhos, unidades, alinhamento e ordenação tornam os dados comparáveis. Uma tabela HTML com botões nos cabeçalhos pode atender ordenação sem virar um grid ARIA. Um grid interativo exige o modelo de teclado correspondente. Exponha o estado de ordenação.

Em tarefas, prioridade, prazo, responsável e status precisam de hierarquia. Título é a entrada principal; metadados apoiam a decisão. Edição rápida não deve conflitar com seleção ou navegação da linha.

Para alto volume, combine localização eficiente com navegação de resultados. Paginação, agrupamento, carregar mais e virtualização resolvem problemas diferentes. Grupos recolhidos mostram contagem e critérios; itens importantes não devem desaparecer por uma decisão puramente estética.

Teste ações em lote, seleção parcial, mudança de filtro e falhas parciais. Preserve a identidade dos registros e explique quais ações foram concluídas. Se atualizar a lista mover o item selecionado, mantenha orientação e foco.

## Calendários e datas

Separe escolher uma data de trabalhar numa agenda. Um date picker não substitui uma agenda com eventos. Um campo nativo pode bastar para uma data simples; um componente de calendário existente atende intervalos e disponibilidade quando isso for necessário.

| Aspecto | Decisão necessária |
|---|---|
| Modelo | Data sem horário, instante com fuso, evento de dia inteiro ou intervalo |
| Visualização | Mês, semana, dia ou agenda, escolhidos pela tarefa e pelo espaço |
| Navegação | Hoje, período anterior/próximo e identificação do período atual |
| Volume | Eventos sobrepostos, limite visível por célula e acesso ao restante |
| Edição | Criação, alteração, cancelamento e alternativa ao arrastar |

Não converta datas sem horário em instantes UTC de forma que mudem de dia. Use locale, início da semana e fuso definidos pelo produto. Confira limites de intervalo, passagem de mês/ano e horário de verão quando aplicáveis. Preserve as regras de datas da aplicação.

Ofereça entrada por teclado quando útil e mensagens de formato. Calendário customizado exige navegação de teclado e retorno de foco adequados. Em agenda, eventos conflitantes e indisponibilidade devem ser compreensíveis sem depender só da cor.

No celular, agenda ou dia podem preservar informação melhor que sete colunas comprimidas. Arrastar e redimensionar eventos precisam de alternativa acessível e estados de salvamento/erro. Não use drag-and-drop como único caminho para editar.

## Indicadores e gráficos

Inclua métricas apenas quando ajudarem uma decisão. Mostre definição, período, unidade e origem quando necessária à interpretação. Diferencie zero de ausência de dados.

Escolha a visualização pela comparação. Forneça valor exato e alternativa textual ou tabular acessível quando o gráfico não bastar. Não insira gráficos para ocupar espaço vazio nem invente números em uma tela conectada a dados reais.
