---
name: software-ui-design
description: "Cria, redesenha e revisa telas de trabalho de SaaS, painéis, ERP, CRM e apps internos, na web, no celular e em app nativo (React Native/Expo, iOS, Android). Prioriza o design system do projeto e componentes revisados; cobre densidade, estados, acabamento e padrões de interação. Inspeciona aplicações logadas com sessão ou mock, temas, estados, regras locais e capturas comparadas. Atua como acompanhante quando outra skill conduz a direção visual. Use para telas operacionais, inclusive pedidos de melhorar aparência ou mostrar mais registros. Não use para landing pages ou marketing."
metadata:
  version: "3.0.0"
---

# Software UI Design

Telas de software existem para a pessoa localizar, comparar, editar e concluir trabalho. Esta skill escolhe componentes já revisados em vez de desenhar do zero, aplica valores de design systems oficiais e prova o resultado com medição e captura. Serve à web e ao celular, inclusive app nativo.

## Limites

As instruções do projeto vencem esta skill: tokens, componentes, stack e regras de teste existentes vêm primeiro. Uma ficha do acervo não autoriza instalar dependência, trocar o design system ou migrar CSS. Se o projeto exigir `frontend-quality`, siga o fluxo dele com superfície `Operate` e use esta skill como fonte de critérios e componentes.

Nenhuma cor, fonte, raio ou pacote de ícones é universal. Branco puro, tema escuro, Inter, fonte de sistema e Lucide são escolhas válidas quando justificadas.

## Barra visual de tela de app (vale em todo tier)

Bonito em tela de trabalho é **familiaridade conquistada**: a ferramenta some dentro da tarefa e quem domina a categoria confia nela à primeira vista. Passar na inspeção não prova isso; a captura prova. Regras completas em [hallmark-app.md](references/hallmark-app.md).

1. **Um objeto pelo qual a ferramenta é lembrada** (a fila, o livro-razão, a linha do tempo, a tabela cheia) abre a tela. Nunca uma saudação acima de quatro cartões de número.
2. **Hierarquia por tipo e espaço:** escala fixa de razão 1,125 a 1,2, pesos em extremos, sem fonte de display em rótulo, botão ou dado; algarismos tabulares em todo número.
3. **Cor com significado:** o acento marca só a ação principal, a seleção atual e o estado; um segundo neutro carrega sidebar, barras e painéis; um botão preenchido por região.
4. **Densidade uniforme:** controles de 32 a 40 px, uma receita de contêiner, tabela antes de cartão, nada espremido numa coluna central.
5. **Menos números, mais verdadeiros:** um número herói, um gráfico de apoio, uma tabela; uma série de acento, base no zero, um eixo y; nada de parede de KPI, rosca, medidor ou seta de tendência sem medição.
6. **Quatro estados por região de dado** (carregando no formato do conteúdo, vazio com a ação que preenche, erro com o que fazer, cheio com volume real) e oito estados por controle. Construir só o estado cheio é desenhar um quarto da tela.
7. **Piso visual:** sem sobretítulo, sem caixa alta espaçada em cabeçalho de tabela ou grupo de menu, sem pontos médios em série, sem cartão dentro de cartão, sem ícone em círculo colorido, sem ponto de status sem texto (itens 41 a 50 de [anti-patterns.md](references/anti-patterns.md)).

## Tamanho do trabalho (2.7.0)

Declare o tier no contrato da tela (passo 1). Ele decide o que roda.

| Tier | Quando | Pesquisa externa | Especialistas | Prova | Entrega |
|---|---|---|---|---|---|
| `quick` | Correção ou ajuste num componente existente, revisão pontual | Nenhuma: projeto e acervo; um site pertinente se o acervo não cobre | `fixing-accessibility` e as de gatilho disparado | Inspeção do componente afetado, captura vista | Bloco curto |
| `standard` | Tela nova ou redesign de uma tela | 2 ou 3 dos onze sites, os pertinentes à família | Idem | Matriz da tela, revisão fria | Bloco completo |
| `deep` | Sistema novo, várias telas, identidade, pedido de pesquisa ampla | Os onze sites | Registro das 30 (acionada, `sem gatilho` com motivo ou ausente) | Matriz completa, revisão fria | Bloco completo |

Na dúvida entre dois, use o maior. **Orçamento em todo tier:** uma inspeção em lote, um lote de correções, no máximo uma rodada de confirmação; cada revisão acrescenta um lote e sua recaptura.

**Pesquisa e especialistas:** os [onze sites](references/research-and-skills.md#onze-sites-por-tier-270) são fontes, não obrigação: uma linha por site (URL, achado, decisão). As [30 especialistas](references/research-and-skills.md#trinta-especialistas-por-gatilho-270) entram pelo gatilho observável, no máximo três vivas, registradas em `.software-ui-design/skills.md` no formato daquela seção. Ler não autoriza instalar pacote. `node <skill-dir>/scripts/check-skills.mjs --tier <tier>` imprime `PASS` antes da entrega.

## Modo acompanhante

Quando o projeto ou o usuário atribuir a direção a impeccable, design-taste-frontend, ui-ux-pro-max ou outra skill, use esta como acompanhante. Direção e fundação ficam com a skill designada; esta fornece contrato, densidade, padrões operacionais, estados, acabamento compatível e prova medida. Reutilize o workflow ativo, sem segundo redesign, preset ou nova escolha de marca. Sem diretiva concorrente, conduza o fluxo abaixo.

## Mobile e app nativo (3.0.0)

No celular (web a 390 px ou app nativo), nesta ordem:

1. **Contrato:** superfície (`web no celular` ou `app nativo`), plataforma, postura (uma mão, em campo) e conexão. px não é pt nem dp.
2. **Valores:** [mobile-app.md](references/mobile-app.md): toque de 44 pt (iOS) e 48 dp (Android); barra inferior com 3 a 5 destinos, nunca ações; sheet para tarefa curta, diálogo só para o que bloqueia.
3. **Componentes:** projeto primeiro; no app, `find-resources.mjs --mobile "<termo>"` e [picks-panelui.md](references/picks-panelui.md); captura vista, condição aplicada.
4. **Gesto e estados:** todo gesto também por toque simples ou `accessibilityActions`; cubra teclado aberto, offline, permissão negada, maior fonte e tema escuro.
5. **Prova:** web com `--widths 390,320`; app com captura de simulador ou aparelho e VoiceOver/TalkBack. Expo web não prova o nativo.

## Fluxo

Progresso no artefato do projeto. Em `quick`: contrato local, implementação, acabamento e prova do componente afetado.

```
- [ ] Contrato, tier, volume e matriz de temas/estados/larguras
- [ ] Pesquisa do tier, design system do projeto, componentes inspecionados e composição
- [ ] Especialistas pelo gatilho; check-skills.mjs --tier com PASS
- [ ] Implementação funcional, quatro estados por região e acabamento compatível
- [ ] Prova medida, capturas vistas contra a barra visual, revisão fria, web-design-guidelines e correções verificadas
- [ ] Entrega com evidências, identidade e limites
```

### 1. Contrato da tela

Escreva em uma frase: quem usa, com que frequência, quanto dado, qual a ação principal, e o tier. Exemplo: "Lista de tarefas usada todo dia, 325 registros, busca frequente e edição rápida sem sair da lista; `standard`." Escolha a família em [screen-patterns.md](references/screen-patterns.md) e decida largura, densidade e região que rola com [layout-navigation.md](references/layout-navigation.md). Pergunte só o que mudaria a solução e não dá para descobrir no código. Em redesign, registre antes cada link, formulário, campo, handler, rota, `id` e `data-testid`, e compare depois: a fiação não muda.

### 2. Design system e componentes prontos

Antes do acervo, procure DESIGN.md, tokens, componentes compartilhados, variantes, ícones e harness visual do projeto; registre fundação, papéis de fonte e temas. Adoção: projeto, acervo, fontes online. Comece pela [escolha rápida](references/component-picks.md) (atalho das famílias mais pedidas, primeira escolha, o que corrigir e evitar). Ficha, código arquivado e captura:

```sh
node <skill-dir>/scripts/find-resources.mjs --recommended "tabela"
node <skill-dir>/scripts/find-resources.mjs --saved "date range"
node <skill-dir>/scripts/find-resources.mjs --all "kanban"   # catálogos externos
```

Para cada família afetada, inspecione primeiro a implementação do projeto; faltando solução, busque e anote o ID (resultado ordenado pelo veredito: recomendado, adaptar, referência). Busca não é inspeção: para cada ID que entra na tela, (1) abra a ficha, (2) abra a captura indicada nela com a ferramenta de imagem, (3) só então decida. ID sem captura vista vai como "referência não inspecionada" e não sustenta a escolha. Locais e IDs vão para **Componentes**; a pesquisa do tier, para **Pesquisa**. Stack compatível: reutilize ou adapte o código; senão, adapte o padrão aos componentes do projeto e diga o que foi aproveitado. Confira a licença antes de copiar. Pesquisa online além do tier só quando o acervo não cobre (lacunas no fim da escolha rápida), quando licença ou versão pedem conferência, ou a pedido.

### 3. Composição

**Decida a composição antes de expandir o código** (`standard` e `deep`): escolha a tela representativa, a ordem de atenção (localizar, comparar, decidir, agir, recuperar), o tamanho de cada região e a densidade. Renderize essa tela com dado representativo, estado cheio e um estado difícil (texto longo, erro, seleção ou vazio), olhe a captura e só então construa o resto. Direção aberta: duas composições com o mesmo conteúdo. Direção aprovada: use-a e registre a evidência.

Use os [valores de partida](references/defaults.md) quando o projeto não tiver token: sidebar de 240 a 320 px, rail de 48 a 80 px, barra superior de 48 a 56 px, linha de tabela de 32 ou 40 px, escala de espaço 4/8, corpo de 14 px, alvo mínimo de 24 px (44 px de área de toque no celular). Passe a tela pelos [antipadrões](references/anti-patterns.md) antes de implementar. Os erros que mais estragam um painel são estes:

- **Tela de dados espremida numa coluna central.** Lista, tabela, quadro e calendário ocupam a área fora da sidebar. Limite de largura vale só para texto e formulário.
- **Trabalho abaixo da dobra.** Título curto, busca e filtros numa barra; o primeiro registro aparece na primeira tela.
- **Card alto por registro em lista grande.** Linha compacta com colunas comparáveis.
- **Menu sem hierarquia.** Grupos rotulados, item ativo distinto de hover, um conjunto de ícones, conta e ajuda no rodapé.
- **Informação só no hover.** Tooltip abre também no foco; o que é essencial fica visível.
- **Paleta apagada.** Superfícies com degraus claros, texto secundário com 4,5:1, cor de ação separada da cor de estado.
- **Sidebar escondida por padrão.** No desktop a partir de 1280 px a sidebar abre expandida, com grupos e nomes visíveis; o rail só com ícones fica para quando a pessoa recolhe (e a escolha é lembrada) ou para 1024 a 1279 px. Casca nova com poucos destinos é barra superior: sidebar se justifica com mais de sete.
- **Dashboard de cartões e login genérico** (antipadrões 47 e 32). Objeto da ferramenta e um número herói antes de parede de KPI; login de SaaS a partir de 1024 px dividido, com prévia real do produto marcada como ilustrativa; no celular, só o formulário.
- **Correto e sem identidade.** Em criação/redesign, três traços observáveis em papéis de fonte, ritmo/densidade e ação/estado ([acabamento.md](references/acabamento.md)); em refinamento, preserve os existentes. Compare capturas com referência aprovada da mesma família.
- **Tudo com o mesmo peso.** Vários botões preenchidos lado a lado, Salvar só no topo de um formulário longo, Excluir colado em Salvar. Um botão preenchido por região, junto de onde a tarefa termina; ação destrutiva em zona separada.
- **Modal como primeira resposta.** Edição inline e disclosure antes; ação reversível roda na hora com Desfazer por 5 a 10 s; confirmação só para o irreversível, com o nome digitado. Filtros, abas e paginação ficam na URL.
- **Progresso inventado ou perdido.** Barra que "já começa em X%": (1) um item por tarefa do pedido, opcionais marcadas e ainda na lista, mais o já feito (conta criada); (2) só então N de M. Número que não bate fica N de M, com a troca registrada. Checklist salvo e retomável ao recarregar.
- **Convenção quebrada.** Logo sem link ao início, Sair fora do menu da conta, destino mais usado enterrado, CNPJ ou código sem separação (itens 34 a 40 dos antipadrões).

[Leis de UX](references/ux-laws.md) com regra, sinal de erro e limite: 7 ± 2 não limita menu; Hick não vale para destino conhecido.

Cor, tipo e acabamento: [visual-language.md](references/visual-language.md); tema escuro derivado, nunca invertido ([hallmark-app.md](references/hallmark-app.md#tema-escuro-por-derivação)). Para comparar com empresas ou usar um DESIGN.md, leia [design-systems.md](references/design-systems.md): documento de marketing não vira regra de dashboard.

### 4. Implementação

Siga [components.md](references/components.md) para o comportamento de cada controle. Para cada componente novo ou trocado, escreva entrada, ação, estado e saída antes da aparência ([acervo-5-sites.md](references/acervo-5-sites.md#contrato-de-componente)). Implemente a tarefa principal e os estados que existem de fato: carregando, vazio, sem resultado, erro, sem permissão, salvando; cada controle com os oito estados e cada campo com a receita de [hallmark-app.md](references/hallmark-app.md#receita-do-campo) (borda de espessura constante, slot à direita reservado, ajuda que o erro substitui). Use [estados.md](references/estados.md) para comportamento e prova; defina dados, gatilho e seletor esperado de cada estado antes de capturar. Busca, filtro, ordenação e seleção operam sobre o mesmo conjunto. Dados digitados sobrevivem a falhas. Não acrescente gráfico, aba, atalho ou animação para preencher espaço. Use conteúdo representativo: nomes longos, volume real e todos os estados. Número que falta vira lacuna visível, nunca valor inventado.

### 5. Acabamento

Fraco e forte por família: [componentes-bonitos.md](references/componentes-bonitos.md), nas três que dominam a tela. [acabamento.md](references/acabamento.md): tokens de motion, microinterações, desfazer, atualização otimista, edição inline, atalhos e recibos, só os que servem à tarefa. Confira papéis de fonte, alinhamento, hover/foco/ativo e interrupção de camadas. Foco sem contorno: sublinhado, fundo ou cor com 3:1, em `:focus-visible`. Sucesso é o resultado na tela; toast só para o que acontece fora da vista ou para Desfazer. Traços de identidade como no passo 3, sem decoração para cumprir contagem. Motion: [movimento-saas](references/movimento-saas.md), depois design-motion-principles e emil-design-eng. No modo acompanhante, vale a direção da skill principal.

### 6. Prova

Renderize a tela e rode a inspeção compartilhada, sem copiá-la para injetar sessão ou mocks. Leia [inspection.md](references/inspection.md) para setup, contrato de mock, regras do projeto e comparação, e [prova-e-entrega.md](references/prova-e-entrega.md) para a tabela de achados, os estados em camada (modal, drawer, validação, vazio) e a descoberta do Playwright. Ela salva a matriz em report.json e index.html e aponta problemas mensuráveis:

```sh
node <skill-dir>/scripts/inspect-ui.mjs <url-ou-file://> --data-screen --widths 1440,768,390 --color-scheme light,dark --reduced-motion no-preference,reduce
```

Não entregue sem rodar a inspeção: as telas entregues sem ela voltaram com rolagem lateral no celular, foco invisível e textos abaixo do contraste. Aplicação logada usa `--storage-state` ou `--mock` com `--expect` da rota; camada não capturada é pendência, não prova. Só declare a prova pendente depois de tentar rodar, citando o erro. `focus` acusa parada de Tab sem nenhuma mudança visível: a correção é estado de foco sem contorno (sublinhado, fundo ou cor) com 3:1.

Depois de rodar, **olhe as capturas** com a ferramenta de imagem contra a barra visual: a medição não julga hierarquia nem acabamento. Em `standard` e `deep`, peça uma **revisão fria** a um agente sem o contexto da construção ([hallmark-app.md](references/hallmark-app.md#revisão-fria-da-tela)), com a primeira palavra `recapture`, `fix` ou `ship`. `web-design-guidelines`, quando instalada, lê os arquivos de UI alterados e pega o que a captura não mostra (semântica de formulário, `autocomplete`, `aria-live`, foco e tecla, confirmação destrutiva); conflito com o projeto, vence o projeto, com o motivo na entrega. Corrija tudo num lote, rode de novo uma vez, e pare sem achado ou com justificativa escrita para cada um. Rode os testes e gates do projeto. Sem navegador, revisão visual pendente. Critérios: [validation.md](references/validation.md).

### 7. Entrega

A resposta final termina com o bloco do tier. Se houver documento de decisões do projeto, o bloco vai nele e a resposta aponta o caminho. Os blocos dos três tiers estão em [prova-e-entrega.md](references/prova-e-entrega.md#bloco-de-entrega-quick): `quick` com Tela, Componentes, Inspeção, Testes e Pendente; `standard` e `deep` acrescentam Pesquisa, Especialistas, Valores, Convenções, Acabamento, Estados e revisão fria.

Conformidade técnica e qualidade visual são conclusões separadas; não afirme a segunda sem ter olhado a captura. Sem arquivo local inspecionado, ID ou fonte na linha de componentes, volte ao passo 2. Zero achados não prova beleza: a aparência requer capturas e avaliação visual; para manter a skill, use a comparação independente em evals/visual-evaluation.md.

## Referências

| Necessidade | Arquivo |
|---|---|
| Regras de tela de app do Hallmark: barra, estados, campo, gráfico, tema escuro, revisão fria | [hallmark-app.md](references/hallmark-app.md) |
| Contrato de componente, estados por família, catálogo dentro do produto, evidência | [acervo-5-sites.md](references/acervo-5-sites.md) |
| Primeira escolha por família (`picks-*.md`); Cult UI (137) e PanelUI (145 de app, 47 web) com veredito | [component-picks.md](references/component-picks.md), [picks-cult-ui.md](references/picks-cult-ui.md), [picks-panelui.md](references/picks-panelui.md) |
| Mobile e app nativo: valores com fonte, composição e prova | [mobile-app.md](references/mobile-app.md) |
| Tabela de achados, estados em camada, Playwright, bloco de entrega completo e exemplos | [prova-e-entrega.md](references/prova-e-entrega.md) |
| Números com fonte | [defaults.md](references/defaults.md) |
| O que evitar e como corrigir | [anti-patterns.md](references/anti-patterns.md) |
| Leis de UX | [ux-laws.md](references/ux-laws.md) |
| Família de tela e prova de aceite | [screen-patterns.md](references/screen-patterns.md) |
| Largura, densidade, sidebar e responsividade | [layout-navigation.md](references/layout-navigation.md) |
| Controles, formulários, tabelas e datas | [components.md](references/components.md) |
| Cor, tipografia e acabamento | [visual-language.md](references/visual-language.md) |
| Design systems oficiais e leitura de DESIGN.md | [design-systems.md](references/design-systems.md) |
| Acervo local, estudos e caminho | [local-library.md](references/local-library.md) |
| Catálogos externos, onze sites por tier e especialistas por gatilho | [research-and-skills.md](references/research-and-skills.md) |
| Sessão, mock, temas, estados, regras e comparação | [inspection.md](references/inspection.md) |
| Comportamento e prova dos estados | [estados.md](references/estados.md) |
| Motion, microinterações, identidade e padrões de SaaS | [acabamento.md](references/acabamento.md) |
| Critérios de aceite e evidência | [validation.md](references/validation.md) |
| Origem e atribuições | [sources.md](references/sources.md) |

Manutenção: `evals/evals.json`, `evals/evals-2.9.json` e `evals/scenarios.md`.
