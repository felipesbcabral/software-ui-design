# Juízo visual final cego

**Status: nota final cega registrada; nenhum conjunto aprovado.** A/B continuam anônimos. A indicação de exatamente cinco passagens veio do coordenador; não auditei histórico, custo, autoria ou condições de produção.

## Fontes e cobertura efetiva

Li somente o manifesto final e examinei suas capturas. Reutilizei a rubrica `frontend-quality/references/design-rubric.md` e a avaliação inicial já disponíveis no contexto. Não li mapa A/B, código, dados, métricas, relatórios de produtores ou prompt original. O [relatório inicial](C:/Users/felip/Dev/software-ui-design/work/blind/initial/judge-blind.md) permanece inalterado.

O manifesto final lista 120 imagens de 900 px de altura. **Vi 74 imagens com `view_image`, em resolução original**. A cobertura de 72 imagens segue exatamente a mesma regra da rodada inicial, aplicada a cada um dos seis pares A/config, B/config, A/list, B/list, A/form e B/form:

| Estado | Temas/larguras efetivamente vistos por par | Imagens |
|---|---|---:|
| default | light/1440, light/390, dark/1440, dark/390 | 4 |
| loading | light/390, dark/1440 | 2 |
| empty | light/390, dark/1440 | 2 |
| error | light/390, dark/1440 | 2 |
| long | light/390, dark/1440 | 2 |

`6 × (4 + 2 + 2 + 2 + 2) = 72`, mais [A-list-light-long-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-light-long-1440.jpg) e [B-list-light-long-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-long-1440.jpg), para conferir o limite do corpo da tabela nos dois temas. Total: **74**; as outras **46** não foram abertas.

Os nomes das 72 imagens da regra são `{A|B}-{config|list|form}-{light|dark}-{estado}-{1440|390}.jpg`, neste diretório. Esta regra é uma enumeração da cobertura, não uma afirmação de inspeção das combinações excluídas. `errors=0` no manifesto não prova acessibilidade, fluxo ou ausência de defeitos.

## Resultado e comparabilidade

Minha preferência visual geral é **A, por margem limitada e com confiança moderada**. A reúne composição mobile compacta, maior densidade da lista, mais contexto no config e um caminho de recuperação mais simples no form. B tem boa redação para edição e loading, além de um config compacto. A diferença de nota não demonstra equivalência funcional nem efeito causal de uma condição de produção.

Os problemas de comparabilidade anteriores **impedem delta causal**: a rodada inicial tinha nomes de comprimentos diferentes e distribuição diferente do stress em `long`. Na final, o nome principal do config aparece com a mesma repetição visível e as linhas vistas de list estão alongadas em ambos; isso melhora a comparação dessas imagens, mas não reconstrói uma linha de base pareada. Também continuam diferentes o contexto de pendências, filtros, ações e paginação. Não atribuo mudanças de nota exclusivamente a design, skill, método ou às cinco passagens.

Confiança alta para textos e geometria visíveis nas 74 imagens; moderada para preferência visual; baixa para interação, acessibilidade completa, motion e performance. Não verifiquei pixels abaixo do limite das capturas, estados não fornecidos ou os 46 cenários restantes.

## Rubrica SaaS

Notas de 0 a 10; pontos = `nota × peso / 10`. Os limites de evidência de motion e acessibilidade permanecem. Não atribuo nota máxima a comportamento que a fotografia não demonstra.

| Dimensão | Peso | A: nota → pontos | B: nota → pontos | Fundamento e evidência |
|---|---:|---:|---:|---|
| Hierarquia | 20 | 8,3 → 16,6 | 8,2 → 16,4 | [A form mobile](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-light-default-390.jpg) e [B form mobile](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-form-light-default-390.jpg): labels, campos e ação têm sequência clara; A agora usa navegação compacta. B nomeia a edição diretamente. |
| Densidade | 15 | 7,8 → 11,7 | 7,2 → 10,8 | [A list mobile](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-light-default-390.jpg) e [B list mobile](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-default-390.jpg): A exibe mais linhas e reúne filtro/limpeza; B tem filtro adicional, mas mais altura por registro. M3 limita B. |
| Estados | 20 | 7,2 → 14,4 | 6,8 → 13,6 | [A empty](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-light-empty-390.jpg), [B empty](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-empty-390.jpg): contadores agora coerentes. M2 em A; M3/M4 em B. Recuperação real continua desconhecida. |
| Motion | 10 | 4,0 → 4,0 | 4,0 → 4,0 | [A loading](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-config-dark-loading-1440.jpg), [B loading](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-config-dark-loading-1440.jpg): skeletons visíveis. Movimento, transições, reduced-motion, cleanup e desempenho não verificados. |
| Identidade | 15 | 7,0 → 10,5 | 6,0 → 9,0 | [A config](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-config-light-default-1440.jpg), [B config](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-config-light-default-1440.jpg): A mostra contato, pendências e histórico; B é mais compacto. A necessidade desse contexto e o perfil real permanecem desconhecidos. |
| Acessibilidade | 20 | 6,5 → 13,0 | 6,3 → 12,6 | [A dark mobile](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-dark-default-390.jpg), [B dark mobile](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-dark-default-390.jpg): labels permanentes, estados escritos e reflow aparente. A tem botões de edição visíveis; hitboxes reais, foco, semântica, contraste medido, teclado, zoom e anúncios não verificados. |

A: `16,6 + 11,7 + 14,4 + 4,0 + 10,5 + 13,0 = 70,2/100`.

B: `16,4 + 10,8 + 13,6 + 4,0 + 9,0 + 12,6 = 66,4/100`.

## Rubrica frontend-quality

Os pesos originais somam 100. Não usei N/A ou redistribuição. A direção sem imagens decorativas é adequada a estas superfícies administrativas, mas o perfil e a tese de marca continuam fora dos insumos cegos.

| Categoria | Possível | A | B | Evidência e limite |
|---|---:|---:|---:|---|
| Especificidade e identidade | 15 | 11,0 | 9,5 | [A config](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-config-light-default-1440.jpg), [B config](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-config-light-default-1440.jpg). Contexto clínico visível; adequação à regra de negócio e marca real não verificada. |
| Hierarquia e composição | 15 | 12,4 | 12,3 | [A form mobile](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-light-default-390.jpg), [B form mobile](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-form-light-default-390.jpg). Ambos estáveis; A compacto, B mais explícito na edição. |
| Tipografia | 10 | 8,2 | 7,2 | [A long list](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-light-long-1440.jpg), [B long list](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-long-1440.jpg). Roles legíveis, nomes quebram; o registro 12 de B aparece parcialmente junto ao rodapé, com mecanismo de acesso desconhecido. |
| Cor e contraste | 10 | 7,4 | 6,8 | [A dark list](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-dark-default-1440.jpg), [B dark list](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-dark-default-1440.jpg). Estados escritos e papéis de cor coerentes. Placeholder de A está mais destacado; o de B permanece discreto. WCAG e foco não medidos. |
| Direção de arte e imagens | 10 | 8,0 | 8,0 | [A light list](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-light-default-1440.jpg), [B light list](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-default-1440.jpg). Direção funcional, sem efeitos concorrentes com dados; proveniência e perfil desconhecidos. |
| Redação UX e conteúdo | 10 | 7,2 | 7,0 | [A loading](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-light-loading-390.jpg), [B empty](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-empty-390.jpg). H1 não reaparece nas vistas; M2 persiste e B orienta repetir carga no vazio. Fluxo esperado ainda aberto. |
| Interação e estados | 10 | 7,2 | 6,8 | [A erro form](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-light-error-390.jpg), [B erro form](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-form-light-error-390.jpg). Valores visíveis e recuperação proposta; M4 em B. Funcionamento e success/validation/permission/destructive não verificados. |
| Acessibilidade e responsividade | 10 | 6,5 | 6,3 | [A form dark mobile](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-dark-default-390.jpg), [B equivalente](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-form-dark-default-390.jpg). M1 não reaparece. Sem evidência funcional de teclado/semântica/zoom/anúncios; M3 em B exige interação. |
| Motion e performance | 5 | 2,0 | 2,0 | [A skeleton](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-dark-loading-1440.jpg), [B skeleton](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-form-dark-loading-1440.jpg). Captura estática não prova movimento, fallback, cleanup ou orçamento de performance. |
| Ownership e anti-slop | 5 | 3,8 | 4,0 | [A default](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-light-default-390.jpg), [B default](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-default-390.jpg). Sem clusters de marketing ou efeitos gratuitos. M2 reduz clareza de A; tokens, dependências, reuso e ownership reais desconhecidos. |

A: `11,0 + 12,4 + 8,2 + 7,4 + 8,0 + 7,2 + 7,2 + 6,5 + 2,0 + 3,8 = 73,7/100`.

B: `9,5 + 12,3 + 7,2 + 6,8 + 8,0 + 7,0 + 6,8 + 6,3 + 2,0 + 4,0 = 69,9/100`.

Estas notas substituem o juízo da aparência atual. Não representam um delta causal em relação à rodada inicial e não fecham os gates funcionais ou medidos.

## Revisão dos achados anteriores

**Critical/High atuais:** nenhum confirmado nas imagens finais examinadas. Não declaro encerrados defeitos fora destas vistas ou no comportamento desconhecido. Os Medium abaixo precisam de correção ou esclarecimento com evidência; uma falha funcional confirmada pode elevar sua gravidade.

| ID / gravidade inicial | Situação nas vistas finais | Evidência |
|---|---|---|
| H1 / High: 300 no vazio com convite ao primeiro cadastro | **Não reaparece.** A mostra 0 e oferece adicionar; B mostra 0 e oferece recarregar. A contagem agora é coerente na tela. A transição real até esse vazio não foi verificada. | [A-list-light-empty-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-light-empty-390.jpg), [B-list-dark-empty-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-dark-empty-1440.jpg) |
| M1 / Medium: expansão da navegação A | **Não reaparece na cobertura final.** A mantém a faixa de navegação mobile compacta nos cinco estados e três páginas vistos. B também tem os três itens em uma linha. Não medi CLS/transições. | [A-config-light-loading-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-config-light-loading-390.jpg), [A-form-dark-default-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-dark-default-390.jpg), [B-form-light-default-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-form-light-default-390.jpg) |
| M2 / Medium: espera versus “Carregar agora” em A | **Permanece.** Ver achados atuais. | [A-form-light-loading-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-light-loading-390.jpg) |
| M3 / Medium contextual: faixa da tabela B | **Permanece e ganha evidência de corte no long.** Ver achados atuais. | [B-list-light-default-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-default-1440.jpg), [B-list-light-long-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-long-1440.jpg) |
| M4 / Medium: duas instruções de recuperação B | **Permanece.** Ver achados atuais. | [B-form-light-error-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-form-light-error-390.jpg) |
| L1 / Low: resumo repetido em A | **Permanece.** Nome/status no cartão principal e resumo lateral. | [A-config-light-default-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-config-light-default-1440.jpg) |
| L2 / Low: cabeçalho B ocupa 240 px mobile | **Reduzido.** A área de marca/nav/breadcrumb termina perto de y=188; a navegação já não ocupa duas linhas. A faixa separada de tema/breadcrumb ainda consome altura, mas não é falha de tarefa demonstrada. | [B-list-light-default-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-default-390.jpg) |
| L3 / Low: modo de cadastro e tema A pouco explícitos | **Permanece.** Campos preenchidos sob “Cadastro”/“Salvar cadastro”; botão “Tema” não nomeia destino. Criar versus editar depende do contexto. | [A-form-light-default-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-light-default-1440.jpg) |

## Achados atuais abertos

| ID / gravidade | Aparência comprovada | Impacto e evidência necessária |
|---|---|---|
| M2 — Medium / A | [A-config-dark-loading-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-config-dark-loading-1440.jpg) e [A-list-light-loading-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-list-light-loading-390.jpg) combinam “Carregando…” com “Carregar agora”. | Não esclarece se deve aguardar ou iniciar a carga. Informar se o botão é controle de demonstração, início manual ou recuperação; ajustar linguagem à condição. Não deduzo implementação do botão. |
| M3 — Medium, requer interação / B | [B-list-light-default-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-default-1440.jpg) anuncia 1–25, exibe 1–12 e já começa o rodapé. Em [B-list-light-long-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-light-long-1440.jpg) e [dark](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-list-dark-long-1440.jpg), a linha 12 aparece parcialmente junto ao limite do corpo, acima do rodapé. | O acesso a 13–25 e ao nome completo do registro 12 não é perceptível nestas fotografias. Demonstrar rolagem interna/virtualização acessível ou corrigir faixa e recorte. Não afirmo que registros estejam inacessíveis sem testar a interação. |
| M4 — Medium / B | [B-form-light-error-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/B-form-light-error-390.jpg) tem “Tentar novamente” no alerta e “Salvar alterações” no rodapé. | A diferença de efeito entre ações não está clara; o alerta afasta campos e aumenta altura. Unificar ou explicar os caminhos e provar uso dos valores atuais/preservação de edições. |
| L1 — Low / A | [A-config-light-default-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-config-light-default-1440.jpg) repete dados da seleção no resumo lateral. | Redundância de espaço. Manter se o resumo servir outra tarefa, ou reduzir repetição. Não é falha funcional demonstrada. |
| L3 — Low / A | [A-form-light-default-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/final/A-form-light-default-390.jpg) não distingue diretamente edição de criação, e “Tema” não indica destino. | Clarificar o modo e a ação, conforme fluxo real. A redação de B é mais específica para edição. |

Observação contextual nova: não há CTA “Adicionar profissional” visível nos defaults finais de list de B, nem no vazio, que agora oferece “Recarregar profissionais”. Isso é uma diferença de capacidade aparente entre A/B, não prova de ausência funcional. Se criação não fizer parte do escopo, pode ser uma simplificação válida; se fizer, precisa de caminho demonstrado. **Não classifiquei essa hipótese como High.**

Contraste: o placeholder dark de A tem mais destaque visual que na inicial; o de B ainda é discreto. Labels permanentes continuam visíveis. Não medi razões de contraste e não afirmo violação ou conformidade WCAG.

## Preferência por cenário visto

Default cobre ambos os temas em ambas as larguras. Outros estados: desktop = dark/1440, mobile = light/390; list/long desktop também foi vista em light. Preferência trata aparência e compreensão imediata, com capacidade funcional ainda desconhecida.

| Página / estado | Desktop | Mobile | Razão / limite |
|---|---|---|---|
| config / default | B | B | Desativar/reativar próximos e visíveis. A oferece contexto adicional de contato/pendências, cuja necessidade precisa de confirmação. |
| config / loading | B | B | Espera com instrução coerente; M2 em A. Não há vantagem atribuída a animação. |
| config / empty | Empate | Empate | Seleção ausente e próximo caminho claros; navegações agora compactas. |
| config / error | A | A | Título nomeia o objeto e a recuperação é direta; M1 não reaparece. |
| config / long | Empate | Empate | Nomes principais com mesma repetição visível e sem colisão; diferenças de conteúdo do config impedem inferir equivalência de tarefa. |
| list / default | Empate | A | Desktop: A tem criação evidente, B filtro adicional/paginação, com M3. Mobile: A apresenta mais registros e edição em botões visíveis. |
| list / loading | B | B | Loading sem instrução manual concorrente. Funcionamento de carga não testado. |
| list / empty | A | A | Contador 0 em ambos; A explica cadastro vazio e propõe adicionar. B propõe repetir carga. Preferência depende de criação ser uma tarefa aplicável. |
| list / error | A | A | Objeto explícito no título e recuperação compacta. Fonte da contagem preservada de 300 não foi verificada. |
| list / long | A | A | A mantém os nomes vistos dentro das linhas e maior densidade mobile; B tem M3 no desktop. Não há delta causal em relação às fixtures iniciais diferentes. |
| form / default | B | Empate | B nomeia edição; A usa menos altura mobile. Campos e ação primária claros em ambos. |
| form / loading | B | B | Instrução de espera mais coerente; M2 em A. |
| form / empty | Empate | Empate | Labels visíveis; sem contexto não sei se é criação, edição sem dados ou apenas fixture vazia. |
| form / error | A | A | Um caminho principal de recuperação e formulário mais compacto; M4 em B. Valores fotografados não provam preservação real. |
| form / long | Empate | Empate | Geometria preservada e mesmo nome visível no desktop. Edição do trecho oculto nos inputs mobile não verificada. |

Nos defaults examinados, a troca light/dark não muda a preferência. Os dois temas mantêm separação visual de dados, ações e erros, com medição de contraste ainda pendente.

## Pendências para o juízo contextual

1. Qual é o escopo real: criar profissionais, editar, desativar/reativar e revisar pendências? A/B parecem oferecer capacidades diferentes; onde está a criação em B, se aplicável?
2. O vazio representa resultado legítimo sem cadastros ou simulação? Por que B orienta repetir carga? Os dados e o stress de todas as fixtures finais estão pareados?
3. A tabela B tem rolagem interna/virtualização acessível? Demonstrar registro 12 completo, 13–25 e navegação por todas as páginas dos 300 registros.
4. O retry do alerta B usa os campos atuais ou outra operação? Demonstrar validação, erro, preservação de edições, sucesso e saída de criar/editar.
5. Quais provas fecham semântica/nomes, teclado, foco, anúncios, zoom/reflow, hitboxes, contraste medido, reduced-motion, performance e operações de desativação/reativação?

Não verificados: interação das ações, persistência, fluxo de criação/edição, sucesso, validação, autorização, confirmação/desativação/reativação, gestão de pendências, anúncios, semântica, foco, teclado, zoom, hitboxes, contraste medido, performance e movimento. Não converti ausência de prova em certeza de defeito.

**A fase cega termina aqui.** As notas permanecem registradas antes de receber contexto. Qualquer revisão posterior deverá identificar a informação nova que alterou a decisão; não há aprovação nesta fase.
