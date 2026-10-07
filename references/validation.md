# Validação e evidência

## Portão de seleção antes do código visual

A implementação começa depois de consultar os [dez sites obrigatórios](research-and-skills.md#dez-sites-obrigatórios-em-toda-invocação) e inspecionar uma solução pronta compatível, existente no projeto, salva no acervo ou encontrada online. Registre uma linha por site com URL, achado e decisão; vale também para correções pequenas, revisões e modo acompanhante. Reutilize a consulta durante os ajustes da mesma invocação; uma nova invocação exige consulta atual aos dez. Mudança de necessidade ou candidato exige nova inspeção. Buscas além dos dez sites dependem de lacunas, desatualização relevante ou pedido explícito.

Registre no artefato de trabalho já usado pelo projeto:

| Família afetada | Fonte inspecionada | Escolha | Uso no projeto |
|---|---|---|---|
| Nome concreto do componente | ID e arquivos do acervo, ou URL e data; código/demo observado | Reuso local, reuso externo ou adaptação; motivo | Arquivo/componente alvo e, na entrega, integração verificada |

O portão está atendido quando há registro da consulta aos dez sites e cada família afetada tem uma escolha compatível sustentada por inspeção real. Falhas de acesso seguem a tentativa de alternativa e o registro de pendência de research-and-skills.md; não contam como consulta concluída. Ler apenas nomes num índice não basta; examine os arquivos do item salvo ou os candidatos online. Quando reutilizar código, registre sua licença. Quando adaptar só um padrão, diga isso. Código salvo não dispensa a prova visual e funcional da integração.

Sem internet, prossiga com candidatos locais suficientes; registre apenas verificações externas que faltarem. Sem candidato que possa ser usado/adaptado, declare o impedimento e amplie a busca disponível. Criar um equivalente do zero exige a exceção consciente já descrita na skill. Nunca registre inspeção, reuso ou integração que não aconteceu.

Auditoria sem implementação também consulta os dez sites, com foco nas famílias avaliadas; não exige uma busca adicional de componente para cada achado. Aprofunde quando precisar fundamentar a alternativa proposta. Backend e lógica sem efeito visual estão fora desta skill.

## Verificação da tarefa

Exercite o caminho que justifica a tela com dados representativos. Em uma lista: localizar, filtrar, abrir, editar e voltar. Em formulário: preencher, falhar, corrigir e salvar. Em calendário: localizar período, criar ou editar e confirmar a data resultante. Escolha os passos realmente presentes no escopo.

Teste os estados afetados: carregamento, vazio, sem resultado, falha, permissão, somente leitura ou ação pendente. Use o volume esperado e um caso alto plausível; não valide lista extensa com apenas dois itens.

Confira concorrência de busca, seleção e paginação quando afetadas. Para ações em lote, verifique o escopo selecionado e o comportamento diante de falha parcial. Para datas, confira semântica e fuso, não apenas a formatação.

## Verificação visual

| Dimensão | Evidência e pergunta |
|---|---|
| Hierarquia | Captura da tela: localização, ação e informação principal são reconhecíveis? |
| Espaço e densidade | Primeira linha útil, linhas visíveis, margens e truncamentos: a área de trabalho serve ao volume? |
| Componentes | Estados e variantes: campos, ícones e botões parecem pertencer ao mesmo sistema? |
| Responsividade | Capturas e interação em tamanhos relevantes: conteúdo e ações continuam acessíveis? |
| Legibilidade | Contraste medido, zoom e conteúdo longo: informação continua compreensível? |

Para web desktop, inclua uma viewport habitual e outra larga ao alterar largura. Examine alturas baixas se houver barras fixas. Para celular, use os tamanhos suportados e uma largura intermediária quando o layout mudar. Evite transformar um conjunto fixo de pixels em prova universal.

Teste zoom de 200% e reflow conforme o alvo do projeto. A referência WCAG para reflow inclui largura equivalente a 320 CSS px, com exceções para conteúdo que exige duas dimensões. Uma tabela ou calendário que precise rolar horizontalmente ainda deve preservar cabeçalhos, operação e contexto. Veja [fontes WCAG](sources.md).

A medição automática vem de `scripts/inspect-ui.mjs`: largura usada numa tela de dados, posição da primeira linha, overflow, alvos menores que 24 px, nomes e rótulos ausentes, foco invisível, tooltip só no hover e contraste amostrado. Rode antes e depois da mudança na mesma viewport e cole o resumo na entrega. Um achado pode ter justificativa (tabela que rola dentro do próprio contêiner, texto desabilitado); escreva qual. Zero achados não aprova a tela: olhe as capturas que o script salva.

Não aprove qualidade visual apenas com lint, teste unitário ou ausência de overflow. Compare renderização e uso. Se não conseguir abrir o runtime, informe o limite e entregue apenas a conclusão sustentada pelo que foi inspecionado.

## Acessibilidade de interação

Percorra por teclado os controles afetados, confirme foco visível, sequência lógica e retorno de foco de sobreposições. Use semântica nativa antes de acrescentar ARIA. Teste nome, papel e estado acessíveis; automação não substitui leitura por tecnologia assistiva quando o fluxo a exigir.

Na web, texto normal tem mínimo AA de 4,5:1; texto grande, 3:1. Texto grande significa pelo menos 18 pt ou 14 pt em negrito, aproximadamente 24 CSS px ou 18,67 CSS px em negrito. Componentes e indicadores visuais necessários seguem o critério de contraste não textual aplicável. Não reduza o contraste de texto pequeno só por chamá-lo de secundário.

O alvo mínimo de WCAG 2.2 AA é 24 por 24 CSS px, ou satisfação das condições/exceções do critério. Para conforto no toque, alvos próximos de 44 por 44 CSS px podem ser uma escolha de projeto. Não confunda esse objetivo com o mínimo AA, nem unidades web com pt de iOS ou dp de Android. Áreas ampliadas não podem se sobrepor.

Verifique rótulos persistentes, mensagens de erro associadas, anúncios sem roubo de foco, operação sem hover e alternativa a arrastar. Respeite movimento reduzido. Nenhum estado essencial depende só de cor.

## Gates e revisões

Rode os comandos obrigatórios do repositório e os testes necessários para a mudança. Preserve código de saída, resumo e log. Corrija falhas introduzidas antes de declarar concluído; identifique falhas preexistentes com evidência.

Se frontend-quality ou o projeto exigir juiz independente, preserve a separação entre avaliação visual sem justificativas e avaliação com contexto. A revisão de software deve observar hierarquia, localização, densidade e tarefa. Hero, footer e originalidade de marketing não são critérios de aceite de um painel operacional.

Não use média de notas para ocultar bloqueadores. Perda de dados, caminho principal quebrado, ação inacessível, conteúdo necessário cortado e pesquisa não realizada impedem concluir o escopo correspondente. Uma sugestão opcional de acabamento não exige polimento interminável.

## Entrega

Informe o resultado concreto, os componentes reutilizados/adaptados, os testes executados e qualquer pendência relevante. Cole o output de comando quando o projeto exigir. Distinga revisão estrutural da skill, teste funcional do produto e julgamento visual; nenhum deles prova os demais.

## Matriz obrigatória e acabamento

Use [inspection.md](inspection.md) para sessão/mock e as opções do inspector; [estados.md](estados.md) para o contrato dos estados. Cubra os temas suportados e estados afetados em 1440, 768 e 390 px, acrescente 320 px para reflow quando aplicável. Preserve seletor esperado por estado e confira o conteúdo da captura. Sem sessão válida, mock de contrato ou estado comprovado, a linha correspondente fica pendente.

Antes da prova, aplique [acabamento.md](acabamento.md): papéis de fonte, tokens, microinterações pertinentes, movimento reduzido e identidade observável. O relatório de consistência/motion traz heurísticas, com justificativas necessárias para exceções. Avaliação cega de aparência segue [visual-evaluation.md](../evals/visual-evaluation.md).
