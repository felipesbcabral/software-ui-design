---
name: software-ui-design
description: "Cria, redesenha e revisa telas de trabalho de SaaS, painéis, ERP, CRM e apps internos. Prioriza o design system do projeto e componentes revisados; cobre densidade, estados, acabamento e padrões de interação. Inspeciona aplicações logadas com sessão ou mock, temas, estados, regras locais e capturas comparadas. Atua como acompanhante quando outra skill conduz a direção visual. Use para telas operacionais, inclusive pedidos de melhorar aparência ou mostrar mais registros. Não use para landing pages ou marketing."
metadata:
  version: "2.4.0"
---

# Software UI Design

Telas de software existem para a pessoa localizar, comparar, editar e concluir trabalho. Esta skill escolhe componentes já revisados em vez de desenhar do zero, aplica valores de design systems oficiais e prova o resultado com medição e captura. Serve a web e a software em geral; em app nativo, use os controles e as unidades da plataforma.

## Limites

As instruções do projeto vencem esta skill: tokens, componentes, stack e regras de teste existentes vêm primeiro. Uma ficha do acervo não autoriza instalar dependência, trocar o design system ou migrar CSS. Se o projeto exigir `frontend-quality`, siga o fluxo dele com superfície `Operate` e use esta skill como fonte de critérios e componentes.

Nenhuma cor, fonte, raio ou pacote de ícones é universal. Branco puro, tema escuro, Inter, fonte de sistema e Lucide são escolhas válidas quando justificadas.

## Regra obrigatória em toda utilização

Em toda invocação desta skill, consulte os onze sites de [research-and-skills.md](references/research-and-skills.md#onze-sites-obrigatórios-em-toda-invocação) antes de propor a solução ou implementar. Vale também para correções pequenas, revisões e modo acompanhante. A consulta é obrigatória mesmo quando o projeto já cobre a necessidade. Registre uma linha por site com URL consultada, achado e decisão de uso ou descarte; aplique as soluções pertinentes à tarefa. Fonte inacessível exige tentativa de alternativa e registro da pendência, conforme a referência. Evidência de uma invocação anterior não dispensa a consulta atual.

Os onze sites são fontes de pesquisa; a integração segue a necessidade, a stack e o design system do projeto. Consultá-los não exige instalar onze bibliotecas nem acrescentar animação, efeito ou 3D sem função na tela.

## Modo acompanhante

Quando o projeto ou o usuário atribuir a direção a impeccable, design-taste-frontend, ui-ux-pro-max ou outra skill, use esta como acompanhante. A direção e a fundação continuam com a skill designada. Esta fornece contrato, densidade, padrões operacionais, matriz de estados, acabamento compatível e prova medida. Reutilize o workflow ativo; não abra um segundo redesign, não imponha preset nem peça nova escolha de marca. Leia referências só para a decisão atual. Sem diretiva concorrente, conduza o fluxo completo abaixo.

## Fluxo

Registre o progresso no artefato adotado pelo projeto. Numa correção pequena, faça contrato local, implementação, acabamento pertinente e prova do componente afetado; reutilize seleções ainda válidas.

```
- [ ] Contrato, volume e matriz de temas/estados/larguras
- [ ] Consulta aos onze sites, design system do projeto, componentes inspecionados e composição
- [ ] Implementação funcional e acabamento compatível
- [ ] Prova medida, capturas vistas, web-design-guidelines no código e correções verificadas
- [ ] Entrega com evidências, identidade e limites
```

### 1. Contrato da tela

Escreva em uma frase: quem usa, com que frequência, quanto dado, qual a ação principal. Exemplo: "Lista de tarefas usada todo dia, 325 registros, busca frequente e edição rápida sem sair da lista." Escolha a família em [screen-patterns.md](references/screen-patterns.md) e decida largura, densidade e região que rola com [layout-navigation.md](references/layout-navigation.md). Pergunte só o que mudaria a solução e não dá para descobrir no código.

### 2. Design system e componentes prontos

Antes do acervo, procure DESIGN.md, tokens em CSS/tema, componentes compartilhados, variantes, ícones e harness visual do projeto. Registre fundação, papéis de fonte e temas suportados. Reutilize os componentes que cobrem a necessidade; consulte o acervo somente para lacunas ou comparação pertinente. Na entrega, cite o arquivo local e qual lacuna exigiu fonte externa. A prioridade de adoção é projeto, acervo, fontes online; a consulta aos onze sites continua obrigatória em todos os casos. Comece pela [escolha rápida](references/component-picks.md), que dá a primeira escolha por necessidade, o que corrigir e o que evitar. Para abrir a ficha, o código arquivado e a captura:

```sh
node <skill-dir>/scripts/find-resources.mjs --recommended "tabela"
node <skill-dir>/scripts/find-resources.mjs --saved "date range"
node <skill-dir>/scripts/find-resources.mjs --all "kanban"   # catálogos externos
```

As primeiras escolhas mais pedidas, para não começar do zero:

| Família | ID do acervo |
|---|---|
| Sidebar expandida / rail | `04-menus-laterais-15` / `04-menus-laterais-10` |
| Barra superior | `05-menus-superiores-01` |
| Tabela densa / simples | `08-tabelas-grids-04` (ou `08-tabelas-grids-10` em stack Tailwind) / `08-tabelas-grids-05` |
| Filtros facetados / command palette | `10-busca-filtros-comandos-01` / `10-busca-filtros-comandos-08` |
| Criar em modal / editar em drawer / página | `02-formularios-crud-07` / `02-formularios-crud-08` / `02-formularios-crud-01` |
| Tooltip / modal / confirmação destrutiva | `20-sobreposicoes-02` / `20-sobreposicoes-17` / `20-sobreposicoes-18` |
| Login / cadastro / esqueci senha / OTP | `03-logins-09` / `21-autenticacao-05` / `21-autenticacao-11` / `21-autenticacao-17` |
| Status / vazio / aviso de seção | `14-feedback-estados-01` / `14-feedback-estados-06` / `14-feedback-estados-02` |
| Data / período de relatório | `01-calendarios-04` / `01-calendarios-15` |
| Ícones | `11-icones-05` (Lucide) |
| Comentários / copiloto com etapas / Gantt | `19-colaboracao-atividade-11` / `06-chats-ia-20` / `16-quadros-cronogramas-17` |

Para cada família afetada, inspecione primeiro a implementação do projeto. Quando faltar solução, rode a busca e anote o ID escolhido. Arquivos locais ou IDs inspecionados vão para a linha **Componentes** da entrega; a consulta aos onze sites vai para **Pesquisa**, inclusive quando a escolha for manter o componente existente. O resultado vem ordenado pelo veredito da revisão (recomendado, adaptar, referência). Busca não é inspeção. Para cada ID que for entrar na tela, nesta ordem: (1) abra a ficha; (2) abra o arquivo de captura indicado nela com a ferramenta de imagem; (3) só então decida. ID sem captura vista vai para a entrega como "referência não inspecionada" e não sustenta a escolha. Os arquivos `picks-*.md` explicam cada veredito com evidência (linha de código, captura, interação). Reutilize ou adapte o código quando a stack for compatível; se não for, adapte o padrão aos componentes do projeto e diga o que foi aproveitado. Além da consulta obrigatória aos onze sites, amplie a pesquisa online quando o acervo não cobrir (as lacunas estão no fim da escolha rápida), quando a licença ou a versão precisarem de conferência, ou quando o usuário pedir. Confira a licença antes de copiar código. O acervo, os estudos e os DESIGN.md revisados estão descritos em [local-library.md](references/local-library.md).

### 3. Composição

Use os [valores de partida](references/defaults.md) quando o projeto não tiver token: sidebar de 240 a 320 px, rail de 48 a 80 px, barra superior de 48 a 56 px, linha de tabela de 32 ou 40 px, escala de espaço 4/8, corpo de 14 px, alvo mínimo de 24 px. Passe a tela pelos [antipadrões](references/anti-patterns.md) antes de implementar. Os erros que mais estragam um painel são estes:

- **Tela de dados espremida numa coluna central.** Lista, tabela, quadro e calendário ocupam a área fora da sidebar. Limite de largura vale só para texto e formulário.
- **Trabalho abaixo da dobra.** Título curto, busca e filtros numa barra; o primeiro registro aparece na primeira tela.
- **Card alto por registro em lista grande.** Linha compacta com colunas comparáveis.
- **Menu sem hierarquia.** Grupos rotulados, item ativo distinto de hover, um conjunto de ícones, conta e ajuda no rodapé.
- **Informação só no hover.** Tooltip abre também no foco; o que é essencial fica visível.
- **Paleta apagada.** Superfícies com degraus claros, texto secundário com 4,5:1, cor de ação separada da cor de estado.
- **Sidebar escondida por padrão.** No desktop a partir de 1280 px a sidebar abre expandida, com grupos e nomes visíveis; o rail só com ícones fica para quando a pessoa recolhe (e a escolha é lembrada) ou para 1024 a 1279 px.
- **Login e cadastro genéricos.** Em SaaS, use tela dividida no desktop a partir de 1024 px: formulário de um lado, painel de marca do outro com uma prévia real do produto (um card de saldo, uma lista, um gráfico feito com a própria UI, marcado como dados ilustrativos). Cartão centralizado só em ferramenta interna. No celular, só o formulário.
- **Correto e sem identidade.** Passar nas checagens exige também uma revisão de aparência. Em criação/redesign, registre três traços observáveis nos papéis de fonte, ritmo/densidade e tratamento de ação/estado, conforme acabamento.md; em refinamento, preserve a identidade existente. Compare capturas com uma referência aprovada para a mesma família de tela.
- **Tudo com o mesmo peso.** Vários botões preenchidos lado a lado, Salvar só no topo de um formulário longo, Excluir colado em Salvar. Um botão preenchido por região, junto de onde a tarefa termina; ação destrutiva em zona separada.
- **Progresso inventado ou perdido.** Com pedido de barra que "já começa em X%", faça nesta ordem: (1) liste um item por tarefa do pedido, com as opcionais marcadas como opcionais e ainda na lista, mais o que já foi feito (conta criada); (2) só então calcule a barra como N de M. O número pedido não é meta: se não bater, a barra mostra N de M e a entrega registra a troca. Checklist salvo a cada etapa e retomável ao recarregar.
- **Convenção quebrada.** Logo que não leva ao início, Sair fora do menu da conta, destino mais usado abaixo de outros sem uso conhecido, CNPJ ou código de recuperação sem separação. Siga a tabela de convenções e a ordem por uso.

Ações, destaques, progresso, navegação e identificadores seguem as [leis de UX](references/ux-laws.md) (Fitts, Hick, Jakob, Von Restorff, Goal gradient, Zeigarnik, Miller). Cada lei traz a regra, o sinal de erro e o limite de uso: 7 ± 2 não limita itens de menu, e Hick não se aplica a procurar um destino conhecido.

Para a direção visual (cor, tipo, tema escuro, acabamento), leia [visual-language.md](references/visual-language.md). Para comparar com empresas ou usar um DESIGN.md, leia [design-systems.md](references/design-systems.md): documento de marketing não vira regra de dashboard.

### 4. Implementação

Siga [components.md](references/components.md) para o comportamento de cada controle. Implemente a tarefa principal e os estados que existem de fato: carregando, vazio, sem resultado, erro, sem permissão, salvando. Use [estados.md](references/estados.md) para comportamento e prova; defina dados, gatilho e seletor esperado de cada estado antes de capturar. Busca, filtro, ordenação e seleção operam sobre o mesmo conjunto. Dados digitados sobrevivem a falhas. Não acrescente gráfico, aba, atalho ou animação para preencher espaço. Use conteúdo representativo: nomes longos, volume real e todos os estados.

### 5. Acabamento

Use [acabamento.md](references/acabamento.md) para tokens de motion, microinterações e padrões como desfazer, atualização otimista, edição inline, atalhos e recibos. Aplique só os padrões que servem à tarefa. Confira papéis de fonte, alinhamento, hover/foco/ativo e interrupção de camadas. Em criação/redesign, registre três traços observáveis de identidade; em refinamento, registre os preservados, sem criar decoração para cumprir contagem. Para motion além dos tokens, use design-motion-principles e emil-design-eng quando disponíveis. Respeite a direção da skill principal no modo acompanhante.

### 6. Prova

Renderize a tela e rode a inspeção compartilhada, sem copiá-la para injetar sessão ou mocks. Leia [inspection.md](references/inspection.md) para setup, contrato de mock, regras do projeto e comparação. Ela salva a matriz em report.json e index.html e aponta problemas mensuráveis:

```sh
node <skill-dir>/scripts/inspect-ui.mjs <url-ou-file://> --data-screen --widths 1440,768,390 --color-scheme light,dark --reduced-motion no-preference,reduce
```

| Achado | Significa | Correção típica |
|---|---|---|
| `blank` / `route-duplicate` | Região principal vazia ou igual à outra rota | Conferir montagem, sessão e seletor próprio da rota |
| `truncated` / `cta-wrap` | Texto cortado no celular ou ação em duas linhas no desktop | Quebrar recibos; ajustar rótulo e largura da ação |
| `rules` / `state` | Token/papel violado ou estado solicitado não apareceu | Corrigir regra do projeto ou fixture/seletor |
| `consistency` | Quantidade de fontes, cores, raios ou sombras excede limite | Reutilizar tokens ou justificar variação |
| `motion-*` | Duração longa, geometria animada ou movimento reduzido ignorado | Aplicar tokens, transform/opacidade e fallback |
| `width-usage` | Tela de dados usando menos de 70% da área fora da navegação | Remover `max-width` do contêiner da lista |
| `first-row` | Primeiro registro abaixo de 55% da altura | Compactar cabeçalho, filtros e resumo |
| `overflow` | Página rola na horizontal | `min-width: 0`, rolagem dentro da tabela |
| `columns` | Coluna de tabela esmagada (texto em menos de 32 px) | Largura mínima por coluna, esconder colunas secundárias, container query |
| `targets` | Controle menor que 24 × 24 px | Aumentar área clicável |
| `names` | Botão sem nome, campo sem rótulo, imagem sem alt | `aria-label`, `<label for>`, `alt` |
| `focus` | Parada de Tab sem indicador visível | Anel de foco de 2 px com contraste |
| `tooltips` / `keyboard` | Dica só no hover ou controle só-ícone sem foco | `button`/`a` com foco e tooltip no foco |
| `contrast` | Texto abaixo de 4,5:1 (3:1 grande) | Escurecer texto ou clarear fundo |

Para aplicação logada, use --storage-state ou --mock e um --expect próprio da rota; uma tela de login não comprova a tela alvo. Para estados reais, use --states loading,empty,error,long com mock que declare seletor esperado e resposta por estado. Tela com modal, drawer, validação ou estado vazio implementado exige, nesta ordem: (1) um mock com um estado por camada (ex.: `modal`, `invalid`, `empty`), cada um com `expect`; (2) `beforeCapture` que abre a camada, envia o formulário vazio ou filtra até zerar; (3) a mesma matriz de larguras e temas para esses estados. Vale também para arquivo local sem API. Camada que não foi capturada é pendência na entrega, não prova. Prove todos os temas suportados, larguras pertinentes e movimento reduzido; não acrescente tema inexistente só para medir. A grade deve mostrar cada combinação aplicável; uma pendência de estado precisa de motivo explícito. Compare a mesma matriz antes/depois com --compare <pasta-antiga>.

Não entregue sem rodar a inspeção: nos testes desta skill, as telas entregues sem ela voltaram com rolagem lateral no celular, foco invisível e dezenas de textos abaixo do contraste, defeitos que a captura mostraria em um minuto. `--data-screen` liga as checagens de largura e primeira linha; não use em formulário ou login. O script procura Playwright em `PLAYWRIGHT_HOME`, na pasta atual e acima, na pasta da skill e acima e no npm global. Rode o comando antes de concluir que falta Playwright. O pacote inclui package.json: `npm run setup` dentro da skill instala o runtime e Chromium quando necessário; não instale dependência no produto só para inspecionar. Se a descoberta falhar, use o comando indicado pelo erro e repita. Só declare a prova pendente depois de tentar, citando o erro. Depois de rodar, **olhe as capturas** com a ferramenta de imagem: a medição não julga hierarquia nem acabamento. Com a skill `web-design-guidelines` disponível, rode-a em seguida sobre os arquivos de UI alterados: ela lê o código e pega o que a captura não mostra (semântica de formulário, `autocomplete`, `aria-live`, estados de foco e tecla, confirmação destrutiva). Trate cada achado como os da inspeção; quando conflitar com o design system ou com as regras do projeto, vence o projeto e a entrega registra o motivo. Sem a skill, siga sem ela e não declare pendência. Corrija, rode de novo e pare quando não houver achado ou quando cada achado restante tiver justificativa escrita. Rode também os testes e gates do projeto. Sem navegador disponível, declare a revisão visual pendente. Critérios completos em [validation.md](references/validation.md).

### 7. Entrega

A resposta final termina com este bloco preenchido, sempre, também em correção pequena (linhas sem aplicação levam "não se aplica"). Se houver documento de decisões do projeto, o bloco vai nele e a resposta aponta o caminho:

```markdown
**Tela:** <arquivo ou rota> · <família e contrato em uma frase>
**Pesquisa:** <registro dos onze sites com URLs, achados e decisões; caminho do artefato, 11/11 consultados ou pendências de acesso>
**Componentes:** <arquivos do projeto e/ou IDs/URL + commit inspecionados, com a captura do acervo vista> · <lacuna que exigiu acervo, ou nenhuma> · <reuso/adaptação e licença quando houver código externo>
**Valores:** <sidebar, altura de linha, espaço, tipo> · <token do projeto ou fonte de defaults.md>
**Convenções:** <desvios da tabela de convenções de ux-laws.md e o motivo, ou "nenhum"> · <pedido trocado por uma lei, ex.: progresso fixo virou N de M>
**Acabamento:** <tokens e microinterações aplicáveis> · <três traços de identidade em criação/redesign, ou preservados em refinamento>
**Estados:** <matriz rota × tema × largura × estado × movimento, com caminhos das capturas e estado verificado>
**Inspeção:** antes <achados> -> depois <achados>; <report.json, index.html e imagens comparadas>; capturas vistas: <quais>
**Testes:** <comandos e resultado>
**Pendente:** <o que não foi verificado e por quê>
```

Conformidade técnica e qualidade visual são conclusões separadas; não afirme a segunda sem ter olhado a captura. Sem arquivo local inspecionado, ID ou fonte na linha de componentes, volte ao passo 2. Zero achados não prova beleza: a aparência requer capturas e avaliação visual; para manter a skill, use a comparação independente em evals/visual-evaluation.md.

## Exemplos

**Pedido:** "A tela de tarefas tem 325 itens, tudo centralizado e com cards enormes."
**Decisão:** família lista de trabalho; shell fluido; tabela compacta com linha de 40 px, colunas título, status, responsável e prazo; barra única com busca, filtros facetados e contagem; edição rápida em drawer mantendo a lista. Componentes: `08-tabelas-grids-10` (stack Tailwind) ou `08-tabelas-grids-04`, facetas de `10-busca-filtros-comandos-01`, drawer `02-formularios-crud-08`. Prova: `inspect-ui.mjs --data-screen` sem `width-usage` nem `first-row`.

**Pedido:** "Minha sidebar recolhida só mostra ícones e o nome aparece no hover."
**Decisão:** itens como links focáveis com `aria-label` e `aria-current`; tooltip no hover e no foco (`20-sobreposicoes-02` como referência de teclado); botão de expandir com `aria-expanded`; rail de 56 a 80 px. Base: `04-menus-laterais-10`. Prova: sem `tooltips` nem `keyboard`.

**Pedido:** "Só ajusta o alinhamento da lupa no campo de busca."
**Decisão:** consultar os onze sites com foco no controle afetado e registrar as decisões; ajustar o alinhamento no componente existente, preservando paleta e shell; conferir foco e alvo depois do ajuste.

## Referências

| Necessidade | Arquivo |
|---|---|
| Primeira escolha de componente por necessidade | [component-picks.md](references/component-picks.md) |
| Evidência e regras por família | [picks-menus-configuracoes-dashboards.md](references/picks-menus-configuracoes-dashboards.md), [picks-tabelas-busca-filtros.md](references/picks-tabelas-busca-filtros.md), [picks-formularios-login.md](references/picks-formularios-login.md), [picks-autenticacao.md](references/picks-autenticacao.md), [picks-sobreposicoes.md](references/picks-sobreposicoes.md), [picks-calendarios-quadros-graficos.md](references/picks-calendarios-quadros-graficos.md), [picks-icones-loading-feedback.md](references/picks-icones-loading-feedback.md), [picks-chat-ia-arquivos-colaboracao.md](references/picks-chat-ia-arquivos-colaboracao.md), [picks-cronogramas-comentarios-copiloto.md](references/picks-cronogramas-comentarios-copiloto.md) |
| Cult UI: 137 componentes com instalação, encaixe e veredito | [picks-cult-ui.md](references/picks-cult-ui.md), índice em [cult-ui-components.json](references/cult-ui-components.json) |
| Números com fonte (sidebar, linha, espaço, tipo, alvo, breakpoints) | [defaults.md](references/defaults.md) |
| O que evitar e como corrigir | [anti-patterns.md](references/anti-patterns.md) |
| Leis de UX em software: regra, sinal de erro, limite e prova | [ux-laws.md](references/ux-laws.md) |
| Família de tela e prova de aceite | [screen-patterns.md](references/screen-patterns.md) |
| Largura, densidade, sidebar e responsividade | [layout-navigation.md](references/layout-navigation.md) |
| Comportamento de controles, formulários, tabelas e datas | [components.md](references/components.md) |
| Cor, tipografia e acabamento | [visual-language.md](references/visual-language.md) |
| Design systems oficiais e leitura de DESIGN.md | [design-systems.md](references/design-systems.md) |
| Acervo local, estudos e caminho | [local-library.md](references/local-library.md) |
| Catálogos externos e outras skills | [research-and-skills.md](references/research-and-skills.md) |
| Sessão, mock, temas, estados, regras e comparação | [inspection.md](references/inspection.md) |
| Comportamento e prova dos estados | [estados.md](references/estados.md) |
| Motion, microinterações, identidade e padrões de SaaS | [acabamento.md](references/acabamento.md) |
| Critérios de aceite e evidência | [validation.md](references/validation.md) |
| Origem e atribuições | [sources.md](references/sources.md) |

Para manter a skill, use `evals/evals.json` (cenários com critérios verificáveis) e `evals/scenarios.md`.
