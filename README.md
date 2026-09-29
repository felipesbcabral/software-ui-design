# software-ui-design

Skill para projetar, redesenhar e revisar telas de software: SaaS, painel administrativo, dashboard, ERP, CRM e app interno. Ela escolhe componentes já revisados em vez de desenhar do zero, aplica valores de design systems oficiais e prova o resultado com medição e captura de tela.

Funciona no Claude Code e no Codex. As instruções estão em português. Versão 2.1.0.

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

`scripts/inspect-ui.mjs` abre a tela em várias larguras, salva capturas e aponta o que dá para medir: rolagem lateral, largura útil, primeira linha abaixo da dobra, colunas esmagadas, alvos pequenos, controles sem nome, foco invisível, dica só no hover e contraste. Precisa do Playwright com o Chromium, instalado uma vez no projeto:

```bash
npm install -D playwright
```

```bash
npx playwright install chromium
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
| `SKILL.md` | O fluxo em seis passos: contrato da tela, componentes, composição, implementação, prova e entrega |
| `references/` | Escolha rápida de componentes, valores de partida com fonte, antipadrões, leis de UX aplicadas a software, padrões de tela, navegação, linguagem visual, design systems e critérios de aceite |
| `scripts/` | `inspect-ui.mjs`, `find-resources.mjs` e os testes deles |
| `evals/` | Cenários de avaliação com critérios verificáveis, para manter a skill |
| `agents/openai.yaml` | Nome e descrição da skill no Codex |

## Testes

```bash
node --test scripts/find-resources.test.mjs scripts/inspect-ui.test.mjs
```

Sem o Playwright, os dois testes de inspeção são pulados.
