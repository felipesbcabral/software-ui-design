# software-ui-design

Skill para projetar, redesenhar e revisar telas de software: SaaS, painel administrativo, dashboard, ERP, CRM e app interno. Ela escolhe componentes já revisados em vez de desenhar do zero, aplica valores de design systems oficiais e prova o resultado com medição e captura de tela.

Funciona no Claude Code e no Codex. As instruções estão em português. Versão 2.3.1.

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

O acervo com o código arquivado, as capturas e a licença de cada componente não está neste repositório: tem cerca de 500 MB de projetos de terceiros, com licenças diferentes. Sem ele, `scripts/find-resources.mjs` avisa "Acervo não encontrado" e o resto da skill funciona. Use o nome e a origem de cada escolha para achar o componente no site oficial e confira a licença antes de copiar código. Quem tiver uma cópia do acervo aponta a variável `SOFTWARE_UI_LIBRARY` para a pasta dele.

## Estrutura

| Caminho | O que tem |
|---|---|
| `SKILL.md` | Contrato, projeto/componentes, composição, implementação, acabamento, prova e entrega |
| `references/` | Escolha rápida de componentes, valores de partida com fonte, antipadrões, leis de UX aplicadas a software, padrões de tela, navegação, linguagem visual, design systems e critérios de aceite |
| `scripts/` | `inspect-ui.mjs`, `find-resources.mjs` e os testes deles |
| `evals/` | Cenários de avaliação com critérios verificáveis, para manter a skill |
| `agents/openai.yaml` | Nome e descrição da skill no Codex |

## Testes

```bash
node --test scripts/find-resources.test.mjs scripts/inspect-ui.test.mjs
```

A suíte de inspeção ampliada exige Playwright e Chromium; falta do runtime não é aprovação.

## Aplicações logadas, estados e acabamento

Use [references/inspection.md](references/inspection.md) para --storage-state, --mock, --states, --color-scheme, --rules e --compare. O inspector produz report.json, grade index.html e imagens antes/depois. [references/estados.md](references/estados.md) define a prova de carregamento, vazio, erro e conteúdo longo. [references/acabamento.md](references/acabamento.md) cobre tokens de motion, microinterações e padrões de SaaS. A skill pode acompanhar outra direção visual, preservando o design system do projeto.

A avaliação independente usa [evals/visual-evaluation.md](evals/visual-evaluation.md); testes automáticos e nota visual são evidências diferentes. O [piloto de 2.2.0](evals/results/2.2.0/README.md) preserva resultados e nove imagens antes/depois.
