# Escolher o padrão pela família de tela

Leia apenas a família afetada. A biblioteca configurada em [local-library.md](local-library.md) contém a matriz detalhada, código, demos e estudos. Este guia é portátil e não exige a presença daquele acervo para entender os critérios.

## Decisões antes da aparência

Defina tarefa, volume, frequência, contexto que deve permanecer visível, densidade e região de rolagem. Escolha a largura de cada região: o shell pode ser amplo e um texto dentro dele ter limite de leitura. Use a escala do projeto; os nomes abaixo não prescrevem um tamanho fixo.

| Família | Composição inicial para comparar | Sinal de uma escolha ruim | Evidência de aceite |
|---|---|---|---|
| Tarefas | Lista compacta, filtros, agrupamento opcional e detalhe contextual | Cartões enormes para centenas de itens | Localizar, editar e voltar mantendo contexto |
| Kanban | Colunas por etapa com título, contagem e cartões reconhecíveis | Títulos ilegíveis, dezenas de colunas e arraste obrigatório | Mover item por alternativa acessível e mostrar falha |
| Gantt | Lista identificável e eixo temporal com zoom | Cronograma comprimido numa coluna de leitura | Encontrar tarefa, intervalo e dependências relevantes |
| Agenda semanal | Grade temporal, período e fuso explícitos | Conflitos escondidos por sobreposição | Abrir eventos, alterar horário e confirmar o resultado |
| Calendário mensal | Mês amplo, resumo e acesso ao excesso de eventos | Célula lotada ou título cortado sem detalhe | Acessar todos os eventos, inclusive em largura pequena |
| Escolha de data | Campo nativo ou picker compatível com a necessidade | Agenda complexa para preencher uma data | Teclado, formato, intervalo e dia correto |
| Dashboard executivo | Poucas métricas com período e explicação | Números decorativos sem decisão | Interpretar origem, variação e ausência de dado |
| Dashboard operacional | Exceções e filas de trabalho em destaque | Gráfico enorme deslocando ações frequentes | Encontrar pendência e agir no contexto |
| Tabela | Colunas comparáveis, unidades, filtros e ordenação | Uma ficha alta por registro sem necessidade | Ordenar, filtrar e selecionar no conjunto correto |
| Grid editável | Células e modo de edição previsíveis | Tratar tabela comum como planilha sem modelo de teclado | Editar, cancelar, salvar e recuperar falha |
| Detalhe de entidade | Identidade, estado, conteúdo e ações relacionadas | Contexto espalhado em cards equivalentes | Reconhecer o objeto e concluir ação principal |
| Lista e detalhe | Regiões coordenadas, seleção estável | Perder seleção e filtro ao abrir cada registro | Voltar para o ponto anterior e operar por teclado |
| Formulário curto | Coluna legível, campos relacionados e ação clara | Esticar campos para ocupar toda a tela | Preencher, errar, corrigir e salvar |
| Formulário longo | Seções ou etapas com progresso real e retomada | Wizard sem dependências, etapas demais ou perda de dados | Retomar preenchimento e revisar antes de enviar |
| Edição inline | Alteração pequena com estado de salvamento | Editar sem indicar resultado ou tratar clique de seleção como edição | Cancelar e recuperar valor após erro |
| Exclusão | Identidade, escopo e consequência explícitos | Confirmação genérica que omite quantidade ou impacto | Resultado correto; desfazer apenas se existir |
| Login | Identificação, credencial/SSO e recuperação claros | Acesso prejudicado por decoração | Autofill, gerenciador, teclado e erro compreensível |
| MFA e recuperação | Etapa curta com alternativas de recuperação | Contagem arbitrária, colagem bloqueada ou estado ambíguo | Expiração, reenvio e retorno previsíveis |
| Configurações | Navegação local por domínio e largura dos campos | Toda configuração dentro de um único formulário gigantesco | Saber o que foi salvo e qual escopo foi alterado |
| Membros e permissões | Identidade, papel, escopo e ações permitidas | Cor como único sinal ou mudança silenciosa de acesso | Revisar alvo e escopo; autorização real no servidor |
| Cobrança | Plano, consumo, período e histórico distinguíveis | Ocultar preço, recorrência ou consequência | Entender o que muda antes de confirmar |
| Integrações | Estado da conexão, escopos e recuperação | “Conectado” sem erro, reconexão ou permissões | Mostrar situação real e próximo passo |
| Busca global | Entrada contextual, resultados e navegação por teclado | Paleta como único acesso a funções essenciais | Descobrir comando também pela navegação normal |
| Filtros | Escopo, filtros ativos e limpeza visíveis | Filtrar só a página atual sem informar | Resultado coerente com paginação e seleção |
| Notificações | Prioridade e destino da ação | Toasts para toda atualização irrelevante | Entender e retomar o item sem perder trabalho |
| Auditoria | Evento, autor, momento e objeto identificáveis | Timeline decorativa sem evidência | Investigar e filtrar acontecimentos reais |
| Arquivos e upload | Seleção, formatos/limites, estado por arquivo | Porcentagem fictícia e falha sem recuperação | Cancelar, tentar novamente e tratar falhas parciais |
| Editor | Área de leitura/canvas e ferramentas pertinentes | Toolbar excessiva e toda a largura ocupada por parágrafos longos | Digitar, selecionar, desfazer e salvar |
| Inbox | Lista e detalhe; conteúdo e resposta identificáveis | Mensagens como feed infinito sem localização | Localizar, ler, responder e retornar |
| Assistente IA | Contexto, histórico, composer, status e fontes quando existirem | Spinner sem etapa, resposta inventada como sucesso | Cancelar, recuperar falha, preservar texto e confirmar ações |
| Onboarding | Próximo passo útil, progresso e saída | Tour extenso antes de usar o produto | Executar a primeira tarefa e retomar depois |
| Erro/indisponibilidade | O que falhou, o que ficou salvo e recuperação | Tela bonita sem caminho de continuação | Preservar dados e recuperar quando possível |

## Resolver ambiguidades frequentes

**Página, drawer ou modal:** escolha pelo volume de conteúdo e pelo contexto necessário. Tarefa longa tende a merecer uma página; detalhe de consulta pode funcionar ao lado da lista; uma decisão delimitada pode usar diálogo. Não empilhe modais para acomodar um fluxo que cresceu.

**Paginação ou virtualização:** paginação organiza o acesso ao conjunto; virtualização reduz trabalho de renderização. Uma não resolve automaticamente o objetivo da outra. Teste foco, busca, seleção e leitor de tela quando virtualizar.

**Autosave ou botão Salvar:** depende de recuperação, conflito, latência e unidade da alteração. Adote feedback explícito e preserve rascunho quando necessário; aparência instantânea não autoriza confirmar sucesso antes da persistência.

**Alto volume:** melhore localização e comparação antes de apenas reduzir pixels. Compare primeira linha útil, quantidade de registros reconhecíveis e acesso ao conteúdo completo sob a mesma viewport.

**Nova família:** decomponha em tarefa, conteúdo, navegação, ações e estados; busque padrões equivalentes no acervo e em fontes oficiais. Esta matriz não autoriza inventar uma interação complexa sem pesquisa nem garante cobrir qualquer software.
