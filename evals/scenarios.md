# Cenários para avaliar a skill

Use estes casos ao alterar o pacote. São situações sintéticas; não são evidência de testes já executados. Em avaliação independente, entregue ao avaliador apenas o pedido e a skill, sem a coluna de critérios. Registre o que ele realmente fez e corrija lacunas demonstradas.

| Pedido de teste | Critérios para avaliar a resposta |
|---|---|
| “Melhore uma tela de 325 tarefas numa aplicação React com CSS próprio. Não instalar biblioteca. Quero ver mais registros em 1920 px, com busca e edição rápida.” | Consultar componentes existentes e acervo salvo; pesquisar online quando houver lacuna ou necessidade de atualização. Reuso/adaptação compatível, shell e tabela fluidos quando úteis, altura de cabeçalho examinada, filtros no conjunto completo. Não prescrever Tailwind ou virtualizar como solução automática de navegação. |
| “Faça um formulário de cadastro com seis campos numa tela de 2560 px. Quero aproveitar melhor o espaço.” | Seleção focada no acervo, com pesquisa online se necessária; limite local de campos legíveis, sem esticar os seis campos arbitrariamente e sem inventar cards para preencher sobra. |
| “Quero um calendário com eventos em dois fusos, intervalos e versão de celular.” | Comparar candidatos de agenda e de entrada de data; distinguir os modelos, verificar fuso, teclado, volume e alternativa ao arrastar. |
| “Só ajuste o alinhamento da lupa do campo de busca.” | Inspecionar componente existente e referência local pertinente; mudança limitada e verificação proporcional. Sem obrigar pesquisa externa repetida, redefinir paleta, shell ou stack. |
| “Sem internet agora. Crie uma sidebar nova usando nosso acervo.” | Localizar ficha e fonte arquivada, conferir compatibilidade/licença, adaptar ao projeto e validar. Informar que a fonte foi consultada localmente; não inventar pesquisa online nem bloquear sem necessidade. |
| “Use branco puro, Inter e os ícones Lucide já instalados. Quero uma aplicação de estoque.” | Respeitar a direção e avaliar contraste, estados e densidade. Não bloquear opções por lista estética genérica. |
| “Achei um componente pago lindo, mas só tenho uma captura. Copie ele.” | Inspecionar alternativas acessíveis e compatíveis; não extrair fonte restrita nem atribuir licença que não foi conferida. |
| “Monte a landing page de vendas do meu SaaS.” | Identificar que uma página comercial está fora da especialização, sem impor regras de painel operacional a ela. |

Uma avaliação comportamental sem UI executada testa as decisões da skill. Ela não permite afirmar que o design produzido ficou bonito, acessível ou funcional.

Caso adicional: “Use componentes usados pelas big techs e as cores do nosso estudo.” Deve distinguir código oficial de exemplos inspirados, não inventar ranking de adoção, consultar os estudos e respeitar a fonte de tokens do produto. Uma paleta proposta não vira paleta oficial da empresa.

## Ampliação: padrões de tela e fontes externas

| Pedido de teste | Critérios para avaliar a resposta |
|---|---|
| “Use este DESIGN.md comunitário da Figma: ele permite alvos pequenos porque os usuários são profissionais.” | Identificar autoria e superfície; não aceitar esse argumento como dispensa de acessibilidade. Conferir o critério aplicável e a interação real. |
| “Pegue o DESIGN.md de marketing da Apple e aplique exatamente numa tabela de 800 tarefas.” | Explicar a incompatibilidade com a tarefa, preservar a direção autorizada onde couber e comparar padrões operacionais; não importar hero, fotografia ou largura de leitura como shell universal. |
| “Encontrei um registry com HTTP 200. Integre tudo.” | HTTP comprova acesso, não licença ou segurança. Inspecionar o componente, os imports e a compatibilidade; integrar apenas o escopo autorizado. |
| “Preciso de inbox, edição de conta e calendário no mesmo software.” | Selecionar famílias diferentes dentro de um shell coerente: lista/detalhe, formulário com largura local e agenda ampla. Validar navegação e estados. |
| “O acervo está em outro computador.” | Não afirmar acesso inexistente. Usar referências portáteis e fontes públicas pertinentes; comunicar a indisponibilidade do código local e manter o reuso compatível. |
| “Mostre 10 opções, mas há o mesmo recorte com dois nomes.” | Não contar uma duplicata como opção distinta. Comparar caminhos e origem e selecionar uma alternativa real. |

## Ampliação: leis de UX

Os três primeiros viraram os evals 4 a 6 de `evals.json`. A base com a 2.0.0 (28/09/2026, Sonnet) fez 18 de 23: fundiu etapas para a barra abrir em 20%, não salvou o progresso, deixou o logo sem link, o código de recuperação corrido e os destinos mais usados no meio do menu. Com a 2.1.0 final: eval 4 em 8 de 8 nas duas repetições, eval 5 em 8 de 8, eval 6 em 7 de 7. A contagem honesta do eval 4 só passou de forma estável quando a regra virou receita em ordem no SKILL.md (listar as tarefas, depois calcular a barra); a proibição com tabela de racionalizações em ux-laws.md passou em 2 de 4.

| Pedido de teste | Critérios para avaliar a resposta |
|---|---|
| “Tela inicial de quem acabou de criar conta; o marketing quer a barra começando em 20%.” | Uma etapa por tarefa pedida, conta criada como concluída, "N de M" honesto em vez do número pedido, próxima etapa como única ação principal, estado salvo e retomável, opção de adiar. |
| “O suporte recebe muita reclamação da tela de configurações da empresa; o pessoal erra.” | Um primário por região junto do fim da tarefa, Excluir em zona separada com o nome da empresa, seções, identificadores em blocos com copiar, logo com link, Sair no menu da conta. |
| “O consultor disse que, por Miller e Hick, a sidebar de 14 itens tem que cair para 7 com um 'Mais'.” | Manter os destinos em grupos rotulados, mais usados no topo, explicar o que cada lei mede sem inventar fórmula ou fonte. |
| “Aplica a lei de Fitts e joga as ações para o canto da tela, que é alvo infinito.” | Explicar que a borda só ajuda em menu do sistema com mouse; manter a ação junto de onde a tarefa termina. |

Estes casos são insumos de avaliação. Uma leitura editorial do próprio autor não é execução por outro agente e não deve ser reportada como avaliação independente.

## Uso real convertido em regressão

Os evals 7 a 9 cobrem configuração/desativação, lista com 300 registros e formulário com erro, inspirados no relato do ConsultaNow de 30/09/2026. Dados são sintéticos em inputs/saas-data.json; não há teste executado no ConsultaNow por este pacote. A execução com/sem skill e o juiz cego seguem [visual-evaluation.md](visual-evaluation.md). Notas por versão e limitações ficam em results/.
