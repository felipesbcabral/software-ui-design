# software-ui-design

Skill para projetar, redesenhar e revisar telas de software: SaaS, painel administrativo, dashboard, ERP, CRM e app interno, na web, no celular e em app nativo. Ela escolhe componentes já revisados em vez de desenhar do zero, aplica valores de design systems oficiais e prova o resultado com medição e captura de tela.

Funciona no Claude Code e no Codex. As instruções estão em português. Versão 3.0.0.

A 3.0.0 estende a skill ao celular e ao app nativo. [mobile-app.md](references/mobile-app.md) traz os valores conferidos na Apple HIG, no Material 3 e no WCAG (44 pt, 48 dp, 3 a 5 destinos na barra inferior, sheet e diálogo, gesto com alternativa), regras de composição, antipadrões e como provar um app nativo. O PanelUI entra inteiro: 145 itens de app React Native/Expo e 47 web, cada um com código lido, captura vista e veredito, em [picks-panelui.md](references/picks-panelui.md). `find-resources.mjs --mobile` busca só componentes de app. O cenário 11 de `evals/evals-2.9.json` avalia uma tela de app em campo.

A 2.9.0 acrescenta [movimento em telas de trabalho](references/movimento-saas.md), filtrado da auditoria das técnicas da MotionSites feita para a web-design-craft: curva de folha para gaveta e folha inferior, contrato da camada modal com fundo inerte, interrupção sem descartar clique, chips com `aria-pressed`, número que muda sem contagem no carregamento, vídeo de produto no login e no onboarding, e a lista do que não entra em tela de trabalho. A inspeção passa a acusar vídeo tocando com movimento reduzido. O cenário de avaliação novo fica em `evals/evals-2.9.json`, lido junto de `evals/evals.json`.

A 2.8.0 acrescenta [componentes bonitos](references/componentes-bonitos.md): o que separa o componente fraco do forte em nove famílias de tela de trabalho, seis alavancas comuns e um teste de olho por família, usado na passada de acabamento, com âncoras de nível na avaliação visual e prova por equivalência demonstrada.

A 2.7.0 abre com a barra visual de tela de app tirada do [Hallmark](references/hallmark-app.md) (objeto pelo qual a ferramenta é lembrada, escala de 1,125 a 1,2, acento só para ação, seleção e estado, quatro estados por região, oito por controle, gráfico honesto, tema escuro derivado e revisão fria), integra o [acervo de 5 sites](references/acervo-5-sites.md) (contrato de componente e estados por família) e escala o trabalho em `quick`, `standard` e `deep`: os onze sites e as 30 especialistas deixam de ser lidos em toda invocação e entram pelo tier e pelo gatilho.

## Instalar

No Claude Code:

```bash
git clone https://github.com/felipesbcabral/software-ui-design ~/.claude/skills/software-ui-design
```

Depois, peça a tela normalmente ou chame `/software-ui-design`.

No Codex, clone na pasta de skills da sua versão (`~/.codex/skills/` ou `~/.agents/skills/`):

```bash
git clone https://github.com/felipesbcabral/software-ui-design ~/.codex/skills/software-ui-design
```

Para atualizar, rode `git pull` dentro da pasta da skill.

## Inspeção de tela

`scripts/inspect-ui.mjs` abre a tela em várias larguras, salva capturas e aponta o que dá para medir: rolagem lateral, largura útil, primeira linha abaixo da dobra, colunas esmagadas, alvos pequenos, controles sem nome, foco invisível, dica só no hover e contraste. Reutilize o Playwright do harness quando disponível. Se faltar o runtime ou Chromium, execute dentro da pasta da skill, com Node 20 ou superior:

```bash
npm run setup
```

Exemplo, com a tela rodando em `localhost:3000`:

```bash
node ~/.claude/skills/software-ui-design/scripts/inspect-ui.mjs http://localhost:3000/clientes --data-screen --widths 1440,768,390
```

O script procura o Playwright em `PLAYWRIGHT_HOME`, na pasta atual e acima, na pasta da skill e acima, e no npm global. `--data-screen` liga as checagens de largura e de primeira linha; não use em formulário ou login.

## Acervo de componentes

A skill cita componentes por ID (por exemplo `08-tabelas-grids-10`), sempre com o nome e a origem, em `references/component-picks.md` e nos arquivos `references/picks-*.md`. Esses arquivos explicam a escolha, o que corrigir e o que evitar em cada família de tela.

O Cult UI entra por componente: `references/cult-ui-components.json` traz os 137 itens do registry (U001 a U137) com comando de instalação, encaixe e veredito, e `references/picks-cult-ui.md` dá a escolha por necessidade. Esse índice funciona sem o acervo.

O PanelUI entra do mesmo jeito: `references/panelui-components.json` traz 145 itens de app (P001 a P141 e os blocos PB01 a PB04) e 47 web (W001 a W047), com plataforma, instalação, encaixe e veredito; `references/picks-panelui.md` dá a escolha por necessidade.

O acervo com o código arquivado, as capturas e a licença de cada componente não está neste repositório: tem cerca de 500 MB de projetos de terceiros, com licenças diferentes. Sem ele, `scripts/find-resources.mjs` avisa "Acervo não encontrado" e o resto da skill funciona. Use o nome e a origem de cada escolha para achar o componente no site oficial e confira a licença antes de copiar código. Quem tiver uma cópia do acervo aponta a variável `SOFTWARE_UI_LIBRARY` para a pasta dele.

## Estrutura

| Caminho | O que tem |
|---|---|
| `SKILL.md` | Contrato, projeto/componentes, composição, implementação, acabamento, prova e entrega |
| `references/` | Escolha rápida de componentes, valores de partida com fonte, antipadrões, leis de UX aplicadas a software, padrões de tela, navegação, linguagem visual, design systems e critérios de aceite |
| `scripts/` | `inspect-ui.mjs`, `find-resources.mjs`, `check-skills.mjs` (registro das 31 especialistas por gatilho) e os testes deles |
| `evals/` | Cenários de avaliação com critérios verificáveis, para manter a skill |
| `agents/openai.yaml` | Nome e descrição da skill no Codex |

## Testes

```bash
node --test scripts/find-resources.test.mjs scripts/inspect-ui.test.mjs scripts/check-skills.test.mjs
```

A suíte de inspeção ampliada exige Playwright e Chromium; falta do runtime não é aprovação.

## Aplicações logadas, estados e acabamento

Use [references/inspection.md](references/inspection.md) para --storage-state, --mock, --states, --color-scheme, --rules e --compare. O inspector produz report.json, grade index.html e imagens antes/depois. [references/estados.md](references/estados.md) define a prova de carregamento, vazio, erro e conteúdo longo. [references/acabamento.md](references/acabamento.md) cobre tokens de motion, microinterações e padrões de SaaS. A skill pode acompanhar outra direção visual, preservando o design system do projeto.

A avaliação independente usa [evals/visual-evaluation.md](evals/visual-evaluation.md); testes automáticos e nota visual são evidências diferentes. O [piloto de 2.2.0](evals/results/2.2.0/README.md) preserva resultados e nove imagens antes/depois.
