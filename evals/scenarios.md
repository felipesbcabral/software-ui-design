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

Estes casos são insumos de avaliação. Uma leitura editorial do próprio autor não é execução por outro agente e não deve ser reportada como avaliação independente.
