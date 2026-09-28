# Síntese C1 — lacunas do acervo

> Revisão feita pelo Codex em 26/09/2026 (lote C1). IDs são fichas do acervo; links relativos `../<categoria>/...` apontam para `<acervo>/`, e `capturas/...` para `<acervo>/revisao-profunda/`. Registros completos: `<acervo>/revisao-profunda/componentes-revisados.json`.

Revisão em 26/09/2026. Escopo: 17 candidatos novos, cada um com fonte no commit fixado, texto da licença, código primário e revisão individual. As fichas documentam possibilidades de reuso; nenhum código foi integrado em um produto.

## Como foi verificado

- Commit consultado pela API REST do GitHub e usado nas URLs raw e nos links de código. Foram salvos 40 arquivos-fonte com SHA-256 individual.
- Licenças lidas no commit: MIT, BSD-3-Clause ou Apache-2.0. Em Liveblocks, foram selecionados `packages/liveblocks-react-ui` e `examples`, fora das duas pastas AGPL indicadas no `LICENSE` da raiz.
- Demos abertas com `pesquisa/capturar.mjs` em Chromium a 1440×1000 e 390×844; cada captura referenciada foi olhada. Ações só aparecem como testadas quando foram executadas.
- Capturas de documentação, imagens publicadas e telas de repositório são identificadas como tal. A ausência de uma demo funcional limita o veredito.

## Seleção por família

### Cronogramas (7)

| Item | Veredito | Evidência visual | Limite decisivo |
|---|---|---|---|
| [16-quadros-cronogramas-11](../16-quadros-cronogramas/16-quadros-cronogramas-11/README.md) | adaptar | captura inspecionada | No celular, o primeiro viewport termina antes do gráfico; a navegação até ele exige rolagem. |
| [16-quadros-cronogramas-12](../16-quadros-cronogramas/16-quadros-cronogramas-12/README.md) | referência especializada | captura inspecionada | Em 390 px só a grade aparece; a linha do tempo fica fora do viewport. |
| [16-quadros-cronogramas-13](../16-quadros-cronogramas/16-quadros-cronogramas-13/README.md) | referência especializada | captura inspecionada | A captura de 390 px não revelou o cronograma utilizável. |
| [16-quadros-cronogramas-14](../16-quadros-cronogramas/16-quadros-cronogramas-14/README.md) | não recomendado como direção visual padrão | captura inspecionada | O formulário de configuração domina a página e dificulta achar o gráfico. |
| [16-quadros-cronogramas-15](../16-quadros-cronogramas/16-quadros-cronogramas-15/README.md) | adaptar | captura inspecionada | No celular, legendas nas barras ficam truncadas e alvos pequenos. |
| [16-quadros-cronogramas-16](../16-quadros-cronogramas/16-quadros-cronogramas-16/README.md) | referência especializada | captura inspecionada | O repositório está arquivado. |
| [16-quadros-cronogramas-17](../16-quadros-cronogramas/16-quadros-cronogramas-17/README.md) | adaptar | captura inspecionada | No celular, a primeira tela mostra só a grade; a linha do tempo exige navegação horizontal. |

### Threads de comentários (5)

| Item | Veredito | Evidência visual | Limite decisivo |
|---|---|---|---|
| [19-colaboracao-atividade-11](../19-colaboracao-atividade/19-colaboracao-atividade-11/README.md) | recomendado como padrão | captura inspecionada | Regras de autorização, persistência e moderação não vêm prontas. |
| [19-colaboracao-atividade-12](../19-colaboracao-atividade/19-colaboracao-atividade-12/README.md) | adaptar | captura inspecionada | Densidade alta para fluxos simples. |
| [19-colaboracao-atividade-13](../19-colaboracao-atividade/19-colaboracao-atividade-13/README.md) | adaptar | captura inspecionada | A demo vazia não permitiu testar thread, resposta ou resolução visualmente. |
| [19-colaboracao-atividade-14](../19-colaboracao-atividade/19-colaboracao-atividade-14/README.md) | referência especializada | captura inspecionada | O estado vazio ocupa a tela móvel e prejudica o contexto do vídeo. |
| [19-colaboracao-atividade-15](../19-colaboracao-atividade/19-colaboracao-atividade-15/README.md) | adaptar | captura inspecionada | Interação e responsividade do produto não foram testadas em runtime. |

### Copilotos em painel lateral (5)

| Item | Veredito | Evidência visual | Limite decisivo |
|---|---|---|---|
| [06-chats-ia-17](../06-chats-ia/06-chats-ia-17/README.md) | adaptar | captura inspecionada | Em 390 px houve corte de 30 px no painel. |
| [06-chats-ia-18](../06-chats-ia/06-chats-ia-18/README.md) | referência especializada | sem preview do componente | Não encontrei preview público do painel para conferir acabamento visual. |
| [06-chats-ia-19](../06-chats-ia/06-chats-ia-19/README.md) | não recomendado como direção visual padrão | captura inspecionada | O visual do demo tem excesso de gradiente e cartões; o painel é genérico. |
| [06-chats-ia-20](../06-chats-ia/06-chats-ia-20/README.md) | adaptar | captura inspecionada | Muita densidade para tarefas simples. |
| [06-chats-ia-21](../06-chats-ia/06-chats-ia-21/README.md) | referência especializada | sem preview do componente | Aparência e responsividade não foram validadas visualmente em runtime. |

## Decisões práticas

- **Cronograma:** Roadline e SVAR são os pontos de partida mais úteis em desktop. Frappe funciona como padrão compacto. Nas capturas de 390 px, DHTMLX, SVAR e gantt-task-react escondem a linha do tempo ou cortam colunas; qualquer adoção precisa de uma vista móvel deliberada. A edição PRO do SVAR não foi confundida com o core MIT.
- **Comentários:** Motiq Comment Thread é a única thread deste lote com resposta, sugestão de menção e resolver/reabrir vistos na demo. O Workspace Motiq reutiliza a mesma thread em uma tela de aprovação, portanto conta como composição diferente, não implementação independente. Liveblocks oferece recursos no código, mas o preview abriu sem discussões; FreeFrame tem imagem do produto e código, sem runtime acessível.
- **Copiloto:** Motiq AI Agent Workspace apresentou o fluxo visual mais completo de passos, resposta e fontes. Sidekick abriu o painel por Ctrl+K, mas o painel de 420 px ocupou x=-30 a 390 px no celular. InAppAI funciona em uma demo de tarefas, porém o visual exige redesign. Anter e AgenticKit permanecem referências de código até haver preview público do painel.
- **Exclusões conscientes:** CopilotKit já está em `06-chats-ia-10`; a fonte localizada neste commit era da API anterior e não correspondia ao showcase atual. PuppyChat não ofereceu demo pública do SDK e o contêiner da barra lateral no código contém `aria-hidden="true"`. Nenhum deles foi duplicado no C1.

## Limites de reuso

`codigo.txt` reúne os arquivos primários selecionados, não uma distribuição instalável. Importações, CSS, serviços, autenticação, persistência, permissões e recursos PRO devem ser avaliados no produto que for usar o padrão. Não foram enviados comentários nem mensagens a serviços externos; threads vazias foram analisadas pelo código e pela demo disponível.

## Verificação local

```text
C1 INTEGRIDADE: PASS | itens=17 | revisões=17 | arquivos-fonte=40 | capturas visuais=39 | IDs únicos=17 | problemas=0
```

## Saída dos comandos de integração

### `python biblioteca-ui-software/pesquisa/merge-componentes.py`

Código de saída: `0`.

```text
catalog items: 323 (added 17), reviews: 323, dupes: [], extra: []
  01-calendarios: 17 | rec 2 · adapt 8 · ref 5 · nrec 2 · desc 0
  02-formularios-crud: 18 | rec 2 · adapt 9 · ref 5 · nrec 2 · desc 0
  03-logins: 10 | rec 0 · adapt 7 · ref 1 · nrec 2 · desc 0
  04-menus-laterais: 17 | rec 4 · adapt 10 · ref 2 · nrec 1 · desc 0
  05-menus-superiores: 14 | rec 3 · adapt 7 · ref 1 · nrec 3 · desc 0
  06-chats-ia: 21 | rec 4 · adapt 8 · ref 6 · nrec 3 · desc 0
  07-configuracoes-conta: 14 | rec 2 · adapt 10 · ref 0 · nrec 2 · desc 0
  08-tabelas-grids: 18 | rec 4 · adapt 8 · ref 4 · nrec 2 · desc 0
  09-dashboards: 13 | rec 1 · adapt 8 · ref 2 · nrec 2 · desc 0
  10-busca-filtros-comandos: 16 | rec 5 · adapt 6 · ref 2 · nrec 2 · desc 1
  11-icones: 10 | rec 2 · adapt 5 · ref 2 · nrec 1 · desc 0
  12-loading-progresso: 13 | rec 5 · adapt 7 · ref 0 · nrec 1 · desc 0
  13-skeletons: 10 | rec 2 · adapt 7 · ref 0 · nrec 1 · desc 0
  14-feedback-estados: 13 | rec 4 · adapt 5 · ref 1 · nrec 2 · desc 1
  15-fluxos-essenciais: 13 | rec 8 · adapt 3 · ref 1 · nrec 0 · desc 1
  16-quadros-cronogramas: 17 | rec 1 · adapt 9 · ref 4 · nrec 3 · desc 0
  17-graficos-analiticos: 10 | rec 4 · adapt 4 · ref 0 · nrec 2 · desc 0
  18-arquivos-editores: 10 | rec 3 · adapt 4 · ref 3 · nrec 0 · desc 0
  19-colaboracao-atividade: 15 | rec 2 · adapt 10 · ref 3 · nrec 0 · desc 0
  20-sobreposicoes: 25 | rec 16 · adapt 7 · ref 2 · nrec 0 · desc 0
  21-autenticacao: 29 | rec 7 · adapt 18 · ref 2 · nrec 2 · desc 0
total: {'adaptar': 160, 'recomendado como padrão': 81, 'referência especializada': 46, 'não recomendado como direção visual padrão': 33, 'descartar': 3}
```

### `python biblioteca-ui-software/pesquisa/gerar-csv.py`

Código de saída: `0`.

```text
323 rows
```

### Conferência posterior

```text
C1 PÓS-MERGE: PASS | catálogo=323 | revisões=323 | CSV linhas de dados=323 | C1 ausentes=0 | IDs duplicados=0
```
