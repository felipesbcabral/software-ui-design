# Prova e entrega

Detalhe dos passos 6 e 7 do [SKILL.md](../SKILL.md), movido para cá na 2.7.0 para o núcleo caber em 20 KB.

## Conteúdo
- Achados da inspeção
- Estados em camada e matriz
- Playwright e ordem da revisão
- Bloco de entrega standard e deep
- Exemplos

## Achados da inspeção

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
| `focus` | Parada de Tab sem nenhuma mudança visível ao receber foco | Estado de foco sem contorno (sublinhado, fundo ou cor) com 3:1 |
| `tooltips` / `keyboard` | Dica só no hover ou controle só-ícone sem foco | `button`/`a` com foco e tooltip no foco |
| `contrast` | Texto abaixo de 4,5:1 (3:1 grande) | Escurecer texto ou clarear fundo |

## Estados em camada e matriz

Para aplicação logada, use --storage-state ou --mock e um --expect próprio da rota; uma tela de login não comprova a tela alvo. Para estados reais, use --states loading,empty,error,long com mock que declare seletor esperado e resposta por estado. Tela com modal, drawer, validação ou estado vazio implementado exige, nesta ordem: (1) um mock com um estado por camada (ex.: `modal`, `invalid`, `empty`), cada um com `expect`; (2) `beforeCapture` que abre a camada, envia o formulário vazio ou filtra até zerar; (3) a mesma matriz de larguras e temas para esses estados. Vale também para arquivo local sem API. Camada que não foi capturada é pendência na entrega, não prova. Prove todos os temas suportados, larguras pertinentes e movimento reduzido; não acrescente tema inexistente só para medir. A grade deve mostrar cada combinação aplicável; uma pendência de estado precisa de motivo explícito. Compare a mesma matriz antes/depois com --compare <pasta-antiga>.

## Playwright e ordem da revisão

Não entregue sem rodar a inspeção: nos testes desta skill, as telas entregues sem ela voltaram com rolagem lateral no celular, foco invisível e dezenas de textos abaixo do contraste, defeitos que a captura mostraria em um minuto. `--data-screen` liga as checagens de largura e primeira linha; não use em formulário ou login. O script procura Playwright em `PLAYWRIGHT_HOME`, na pasta atual e acima, na pasta da skill e acima e no npm global. Rode o comando antes de concluir que falta Playwright. O pacote inclui package.json: `npm run setup` dentro da skill instala o runtime e Chromium quando necessário; não instale dependência no produto só para inspecionar. Se a descoberta falhar, use o comando indicado pelo erro e repita. Só declare a prova pendente depois de tentar, citando o erro.

## Bloco de entrega standard e deep

```markdown
**Tela:** <arquivo ou rota> · <família e contrato em uma frase> · <tier>
**Pesquisa:** <sites do tier com URLs, achados e decisões; caminho do artefato, ou pendências de acesso>
**Especialistas:** <caminho do registro> · saída do check-skills.mjs --tier <tier> · <as que mudaram o código e o quê>
**Componentes:** <arquivos do projeto e/ou IDs/URL + commit inspecionados, com a captura do acervo vista> · <lacuna que exigiu acervo, ou nenhuma> · <reuso/adaptação e licença quando houver código externo>
**Valores:** <sidebar, altura de linha, espaço, tipo> · <token do projeto ou fonte de defaults.md>
**Convenções:** <desvios da tabela de convenções de ux-laws.md e o motivo, ou "nenhum"> · <pedido trocado por uma lei, ex.: progresso fixo virou N de M>
**Acabamento:** <tokens e microinterações aplicáveis> · <três traços de identidade em criação/redesign, ou preservados em refinamento> · <objeto pelo qual a tela é lembrada>
**Estados:** <matriz rota × tema × largura × estado × movimento, com caminhos das capturas e estado verificado>
**Inspeção:** antes <achados> -> depois <achados>; <report.json, index.html e imagens comparadas>; capturas vistas: <quais>; revisão fria: <primeira palavra e achados resolvidos>
**Testes:** <comandos e resultado>
**Pendente:** <o que não foi verificado e por quê>
```

## Exemplos

**Pedido:** "A tela de tarefas tem 325 itens, tudo centralizado e com cards enormes."
**Decisão:** `standard`; família lista de trabalho; shell fluido; tabela compacta com linha de 40 px, colunas título, status, responsável e prazo; barra única com busca, filtros facetados (na URL) e contagem; edição rápida em drawer mantendo a lista. Componentes: `08-tabelas-grids-10` (stack Tailwind) ou `08-tabelas-grids-04`, facetas de `10-busca-filtros-comandos-01`, drawer `02-formularios-crud-08`. Prova: `inspect-ui.mjs --data-screen` sem `width-usage` nem `first-row`; revisão fria.

**Pedido:** "Minha sidebar recolhida só mostra ícones e o nome aparece no hover."
**Decisão:** `quick`; itens como links focáveis com `aria-label` e `aria-current`; tooltip no hover e no foco (`20-sobreposicoes-02` como referência de teclado); botão de expandir com `aria-expanded`; rail de 56 a 80 px. Base: `04-menus-laterais-10`. Prova: sem `tooltips` nem `keyboard`.

**Pedido:** "Só ajusta o alinhamento da lupa no campo de busca."
**Decisão:** `quick`; sem pesquisa externa; ajustar o alinhamento no componente existente, preservando paleta e shell; conferir foco e alvo depois do ajuste; bloco curto.
