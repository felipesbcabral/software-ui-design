# Juízo visual cego — rodada inicial

Status: avaliação cega concluída; **nenhum conjunto aprovado**. Os rótulos A/B foram tratados como anônimos. Não li código, perfil, pedido original, mapas, relatórios ou outros artefatos do projeto.

## Insumos e cobertura

Insumos: `manifest.json`, capturas nele listadas e `frontend-quality/references/design-rubric.md`. O manifesto contém 120 cenários. Examinei **72 imagens com `view_image`, em resolução original**; não atribuo inspeção às 48 restantes.

A cobertura abaixo define todas as imagens vistas, sem depender de uma amostra implícita. Para cada um dos seis pares conjunto/página — A/config, B/config, A/list, B/list, A/form e B/form — examinei:

| Estado | Temas/larguras vistos por conjunto/página | Quantidade |
|---|---|---:|
| default | light/1440, light/390, dark/1440, dark/390 | 4 |
| loading | light/390, dark/1440 | 2 |
| empty | light/390, dark/1440 | 2 |
| error | light/390, dark/1440 | 2 |
| long | light/390, dark/1440 | 2 |

`6 × (4 + 2 + 2 + 2 + 2) = 72`. Nomes: `{A|B}-{config|list|form}-{light|dark}-{estado}-{1440|390}.jpg`, no mesmo diretório deste relatório. Todas as capturas têm altura de 900 px.

## Resultado e limites

B apresenta composição mais estável nos estados mobile examinados e redação mais direta para editar dados. A apresenta mais contexto de trabalho no config e recuperação mais simples no erro de formulário. Ambos têm uma inconsistência importante no vazio da lista. As notas gerais são próximas: a diferença não sustenta uma conclusão causal sobre a origem das implementações.

Confiança **alta** para conteúdo visível, quebras de linha e geometria dos cenários vistos; **moderada** para preferências visuais; **baixa** para usabilidade funcional, acessibilidade completa e motion/performance. A imagem não demonstra clique, tecla, leitura assistiva, anúncio, preservação real de dados, persistência ou transição temporal.

Há um limite adicional de comparação: os dados de `long` não estão pareados. No config, A repete o sobrenome mais vezes que B. Na list, A alonga a primeira linha, enquanto B alonga várias linhas. Não atribuo a diferença de altura nesses cenários somente ao design.

## Rubrica SaaS

Notas de 0 a 10. Pontos = `nota × peso / 10`. Notas de estados ficam abaixo de 5 por H1; motion e acessibilidade têm desconto por evidência ausente, sem afirmar que o comportamento desconhecido é defeituoso.

| Dimensão | Peso | A: nota → pontos | B: nota → pontos | Evidência e fundamento |
|---|---:|---:|---:|---|
| Hierarquia | 20 | 7,2 → 14,4 | 8,0 → 16,0 | [A form mobile](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-form-light-default-390.jpg): navegação toma muito espaço. [B form mobile](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-form-light-default-390.jpg): sequência título, dados e ação mais estável. |
| Densidade | 15 | 6,5 → 9,75 | 7,2 → 10,8 | [A config desktop](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-config-light-default-1440.jpg): contexto útil, resumo lateral repetido. [B list mobile](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-light-default-390.jpg): filtros em duas colunas; cabeçalho ainda ocupa 240 px. |
| Estados | 20 | 4,8 → 9,6 | 4,9 → 9,8 | [A empty](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-list-light-empty-390.jpg) e [B empty](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-light-empty-390.jpg): contagem e mensagem incompatíveis. Erros têm recuperação visível; execução não verificada. |
| Motion | 10 | 4,0 → 4,0 | 4,0 → 4,0 | [A loading](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-config-dark-loading-1440.jpg) e [B loading](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-config-dark-loading-1440.jpg): skeletons visíveis. Animação, propósito temporal, reduced-motion, cleanup e desempenho não verificados. |
| Identidade | 15 | 7,0 → 10,5 | 6,0 → 9,0 | [A config](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-config-light-default-1440.jpg): atendimentos pendentes, contato e histórico dão contexto clínico. [B config](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-config-light-default-1440.jpg): linguagem de equipe clínica, identidade visual discreta. Marca real e perfil não foram fornecidos. |
| Acessibilidade | 20 | 5,8 → 11,6 | 6,3 → 12,6 | [A dark mobile](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-list-dark-default-390.jpg) e [B dark mobile](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-dark-default-390.jpg): labels e estados escritos; reflow aparente. Contraste medido, semântica, alvos reais, foco, zoom, teclado e anúncios não verificados. |

A: `14,4 + 9,75 + 9,6 + 4,0 + 10,5 + 11,6 = 59,85 ≈ 59,9/100`.

B: `16,0 + 10,8 + 9,8 + 4,0 + 9,0 + 12,6 = 62,2/100`.

## Rubrica frontend-quality

Pesos originais preservados, sem N/A ou redistribuição. A ausência de imagens decorativas é adequada a estas tarefas administrativas; não recebeu nota máxima sem contexto da direção do produto. Os pontos abaixo avaliam a aparência comprovada e o limite da evidência.

| Categoria | Possível | A | B | Evidência e efeito |
|---|---:|---:|---:|---|
| Especificidade e identidade | 15 | 11,0 | 9,5 | [A config](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-config-light-default-1440.jpg), [B config](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-config-light-default-1440.jpg). Contexto de clínica visível; adequação ao perfil e marca desconhecida. |
| Hierarquia e composição | 15 | 10,5 | 12,0 | [A loading mobile](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-config-light-loading-390.jpg), [B equivalente](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-config-light-loading-390.jpg). M1 reduz A; B mantém composição regular. |
| Tipografia | 10 | 8,0 | 8,5 | [A long config](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-config-light-long-390.jpg), [B long config](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-config-light-long-390.jpg). Roles legíveis e nomes quebram dentro do cartão; fixtures diferentes limitam comparação. |
| Cor e contraste | 10 | 6,5 | 6,8 | [A dark list](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-list-dark-default-1440.jpg), [B dark list](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-dark-default-1440.jpg). Cor de ação/erro coerente e estado escrito; placeholder escuro pouco destacado. Sem razão WCAG medida ou foco capturado. |
| Direção de arte e imagens | 10 | 8,0 | 8,0 | [A list light](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-list-light-default-1440.jpg), [B list light](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-light-default-1440.jpg). Direção funcional, sem decoração que concorra com dados. Proveniência dos ícones e tese de marca não verificadas. |
| Redação UX e conteúdo | 10 | 4,8 | 4,9 | [A empty](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-list-dark-empty-1440.jpg), [B empty](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-dark-empty-1440.jpg). H1 bloqueia nota alta; mensagens de erro são compreensíveis. |
| Interação e estados | 10 | 4,8 | 4,9 | [A erro form](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-form-light-error-390.jpg), [B erro form](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-form-light-error-390.jpg). Campos mantêm valores na imagem; recuperação real e estados success/permission/destructive/validation não verificados. H1 permanece. |
| Acessibilidade e responsividade | 10 | 5,8 | 6,3 | [A form dark mobile](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-form-dark-default-390.jpg), [B equivalente](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-form-dark-default-390.jpg). Sem sobreposição de campos nas vistas; M1 em A. Sem evidência de semântica/teclado/zoom/anúncios. |
| Motion e performance | 5 | 2,0 | 2,0 | [A skeleton](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-form-dark-loading-1440.jpg), [B skeleton](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-form-dark-loading-1440.jpg). Fotografia de skeleton não prova animação, ausência de jank, reduced-motion ou desempenho. |
| Ownership e anti-slop | 5 | 3,5 | 4,0 | [A loading](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-list-light-loading-390.jpg), [B default](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-light-default-390.jpg). Sem clusters de marketing, gradientes gratuitos ou decoração concorrente. A tem CTA de carregamento ambíguo; tokens, reuso e ownership reais desconhecidos. |

A: `11,0 + 10,5 + 8,0 + 6,5 + 8,0 + 4,8 + 4,8 + 5,8 + 2,0 + 3,5 = 64,9/100`.

B: `9,5 + 12,0 + 8,5 + 6,8 + 8,0 + 4,9 + 4,9 + 6,3 + 2,0 + 4,0 = 66,9/100`.

## Achados

**Critical:** nenhum demonstrado por estes insumos. Não afirmo perda de dados, risco clínico, inacessibilidade funcional ou prova fabricada. H1 é uma contradição na apresentação de dados ilustrativos; a fonte de verdade real não foi disponibilizada. Se o contexto confirmar que a tela declara dados reais incompatíveis, a gravidade deve ser reavaliada conforme a regra de verdade do produto da rubrica.

| ID / gravidade | Conjunto | Evidência específica | Aparência comprovada e impacto | Correção/evidência necessária |
|---|---|---|---|---|
| H1 — High | A e B | [A-list-light-empty-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-list-light-empty-390.jpg), [B-list-dark-empty-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-dark-empty-1440.jpg) | O cabeçalho conserva 300 profissionais; A diz nenhum cadastrado, B diz nenhum encontrado; ambos convidam a adicionar o primeiro. Busca vazia e filtros Todos/Todas não explicam a divergência. O vazio não comunica uma condição coerente para orientar o próximo passo. | Parear contador e resultado. Distinguir equipe vazia de busca sem resultados. Reproduzir o vazio com dados e filtros consistentes. Bloqueia aprovação dos estados. |
| M1 — Medium | A | [A-config-light-loading-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-config-light-loading-390.jpg), [A-config-light-default-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-config-light-default-390.jpg), [A-form-dark-default-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-form-dark-default-390.jpg) | A navegação mobile muda de aproximadamente 60 px no config default para aproximadamente 246 px no loading; o item ativo vira uma faixa alta. A mesma expansão ocorre no form default. A posição do título passa de cerca de y=183 a y=366 no config, com espaço vazio sem função. | Fazer a altura da navegação depender de seu conteúdo. Mostrar mesmas vistas após correção; transição/CLS real continua desconhecida. |
| M2 — Medium | A | [A-form-dark-loading-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-form-dark-loading-1440.jpg), [A-list-light-loading-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-list-light-loading-390.jpg) | “Carregando…” aparece junto de “Carregar agora”. A linguagem não esclarece se deve aguardar ou iniciar a operação. Não deduzo a função do botão. | Informar se o carregamento é automático, manual ou simulado; ajustar o CTA à condição. Contexto pode explicar um controle de demonstração. |
| M3 — Medium, requer contexto | B | [B-list-light-default-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-light-default-1440.jpg) | A tabela anuncia “1 a 25”, mostra profissionais 1–12 e já inicia o rodapé de paginação. É uma inconsistência aparente entre faixa anunciada e linhas mostradas. Não concluo que registros estejam inacessíveis: uma área interna rolável/virtualizada não pode ser descartada pela imagem. | Demonstrar onde estão 13–25 ou corrigir a faixa/paginação. Se houver rolagem interna, torná-la perceptível e confirmar por interação. |
| M4 — Medium | B | [B-form-light-error-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-form-light-error-390.jpg) | O erro acrescenta “Tentar novamente” no alerta e conserva “Salvar alterações” no rodapé. Há duas instruções de recuperação com verbos diferentes; a diferença de efeito é desconhecida. O alerta também afasta os campos e aumenta a altura. | Unificar o caminho de recuperação ou explicar a diferença; provar que a ação usa os valores atuais e preserva as edições. |
| L1 — Low | A | [A-config-light-default-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-config-light-default-1440.jpg) | O resumo lateral repete nome/status já exibidos no cartão. A repetição consome largura e enfraquece a densidade; não há falha de tarefa demonstrada. | Manter o resumo se acompanhar uma tarefa diferente; caso contrário, reduzir repetição. |
| L2 — Low | B | [B-list-light-default-390.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/B-list-light-default-390.jpg) | Marca, navegação em duas linhas e breadcrumb/tema consomem aproximadamente 240 px antes da área principal. A composição é estável, mas reduz a área para resultados. | Compactar a navegação mobile se consulta de lista for a tarefa dominante. |
| L3 — Low | A | [A-form-light-default-1440.jpg](C:/Users/felip/Dev/software-ui-design/work/blind/initial/A-form-light-default-1440.jpg) | “Cadastro do profissional” e “Salvar cadastro” não deixam tão explícito quanto B que os dados preenchidos estão sendo editados. “Tema” também não informa a próxima ação. | Usar títulos/CTAs que indiquem criar versus editar e o tema de destino, se esse for o fluxo real. |

Observação visual adicional: placeholders nos temas dark têm pouco destaque em ambos. **WCAG não verificado**: não medi cores nem contraste, e labels permanentes estão presentes. Não transformo essa observação em achado medido ou bloqueio WCAG.

## Preferência por cenário observado

Para default, cada preferência cobre os dois temas em cada largura. Nos demais estados, a coluna desktop refere-se a **dark/1440** e mobile a **light/390**. Não extrapolo aos pares restantes. Preferência significa aparência e compreensão imediata; não significa equivalência funcional.

| Página / estado | Desktop | Mobile | Motivo e limite |
|---|---|---|---|
| config / default | B | B | Ação e reativação mais próximas e visíveis. A oferece mais contexto de contato/pendências; sua necessidade permanece aberta. |
| config / loading | B | B | B tem uma instrução de espera; A combina espera e CTA manual. Mobile A sofre M1. |
| config / empty | Empate | B | Ambos têm seleção ausente e caminho claro. Em mobile, B evita M1. |
| config / error | A | B | A nomeia o objeto no título do erro; B evita a grande expansão da navegação mobile. |
| config / long | Empate | Empate | Ambos quebram nomes sem sobreposição nas vistas; carga textual diferente impede atribuir vitória de densidade. |
| list / default | B | Empate | B reúne especialidade e faixa/paginação visíveis, com ressalva M3. A expõe mais linhas no mobile; B oferece um filtro adicional. |
| list / loading | B | B | Composição e instrução de espera mais coerentes; M1/M2 em A. |
| list / empty | Empate | Empate | H1 compromete ambos; não escolho vencedor de um vazio contraditório. |
| list / error | A | B | A explicita lista/profissionais no título; B evita M1 no mobile. |
| list / long | Empate | Empate | Fixtures diferentes: primeira linha mais longa em A, várias em B. Não há colisão visível em ambos. |
| form / default | B | B | Edição nomeada diretamente; header mobile estável. Ambos exibem labels e CTA primário claro. |
| form / loading | B | B | Espera sem CTA manual ambíguo; M1/M2 em A. |
| form / empty | Empate | B | Campos vazios com labels em ambos; criar/editar depende de contexto. B usa menos espaço de navegação. |
| form / error | A | A | Uma ação principal de recuperação e formulário mais compacto; B tem M4. Valores visíveis não provam preservação real. |
| form / long | Empate | B | Campos de linha única mantêm geometria. B evita M1; nomes integrais e edição do trecho oculto não foram verificados. |

Não há diferença de preferência por tema nos defaults examinados. As duas paletas preservam separação visual de ações, dados e erros. Isso não substitui medição de contraste.

## Perguntas para a fase contextual

1. A tarefa de config inclui revisar atendimentos pendentes antes da desativação? A mostra essa dependência e B não; sem regra de negócio não posso classificar ausência como defeito nem excesso como benefício obrigatório.
2. O vazio representa equipe sem cadastros, filtro sem correspondência ou simulação? Qual contador deveria aparecer? Os dados de `long` podem ser iguais entre A/B para comparação controlada?
3. A tabela de B contém rolagem interna/virtualização ou apenas 12 registros? O que fazem paginação, filtros e os links Editar nos 300 registros?
4. Criar e editar compartilham o formulário? Como são validados obrigatórios/e-mail, como se recupera erro e como se verifica preservação após uma tentativa de salvar?
5. Quais evidências demonstram teclado, nomes/semântica, foco no erro/diálogo, anúncios, zoom/reflow, alvos de toque, contraste, reduced-motion e desempenho? Skeleton estático e `errors: []` do manifesto não respondem a isso.

## O que permanece desconhecido

Não verificados: conclusão das ações; criação versus edição; sucesso; validação; autorização; confirmação/desativação/reativação; gestão das pendências; anúncios; semântica; foco; teclado; zoom; hitboxes; carga real dos 300 registros; contraste medido; movimento e performance. Também não verificados pixels abaixo do limite das capturas nem as 48 vistas não abertas.

O próximo juízo deve receber contexto e evidência funcional, preservando estas notas cegas. Qualquer ajuste de nota deve declarar qual informação nova o motivou. **Não há aprovação nesta fase.**

