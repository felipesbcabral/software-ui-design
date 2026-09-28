# Síntese R1: calendários, quadros e cronogramas, gráficos analíticos

> Revisão profunda de 26/09/2026. IDs como `08-tabelas-grids-04` são fichas do acervo; caminhos `capturas/...`, `paginas/...` e `codigo.txt` são relativos a `<acervo>/revisao-profunda/` ou à pasta do item. Registros completos: `<acervo>/revisao-profunda/componentes-revisados.json`.

Revisão de 37 itens em 2026-09-26. Registros completos em `componentes-R1.json`; capturas em
`capturas/<id>*.jpg` e textos em `paginas/<id>*.txt`. Cada item teve captura desktop olhada, interação
exercida (abrir calendário, clicar em data, hover em ponto, Tab) e, nos 17 calendários, captura 390x844.
Escopo: curadoria para reuso, sem integração no produto.

Vereditos: 7 recomendados como padrão, 18 adaptar, 6 referência especializada, 6 não recomendados como
direção visual padrão, 0 descartar.

## 1. Calendários e agendas (01-calendarios)

### Lista curta

| Papel | Item | Motivo observado |
|---|---|---|
| Padrão para data em formulário | `01-calendarios-04` Cloudscape DatePicker | Input digitável com formato e texto de restrição, botão de calendário separado, grade densa, foco inicial em hoje, rótulo do botão inclui a data selecionada. |
| Padrão para intervalo em formulário | `01-calendarios-02` Carbon DatePicker (range) | Dois inputs rotulados, um calendário, foco sólido de 2 px, estados de erro, aviso e skeleton nas stories, cabe em 390 px. |
| Padrão para filtro de período em relatório | `01-calendarios-15` Untitled UI DateRangePicker | Presets de período, dois meses, inputs de início e fim, Apply e Cancel, adaptação real no mobile. Corrigir antes: Cancel não desfaz a seleção (`codigo.txt:106-110, 137-142`). |
| Data com faixa de horário | `01-calendarios-11` shadcn com horário | Calendário e horas no mesmo card; trocar step=1 (segundos) por minutos. |
| Agenda de eventos multi-framework | `01-calendarios-07` Schedule-X | Semana com dia inteiro, fuso e visões; no mobile troca para mês com pontos e lista do dia. |
| Agenda completa como pacote | `01-calendarios-10` FullCalendar | Visões rotuladas e foco de 3 px; recursos exigem licença comercial. |
| Referência visual de agenda | `01-calendarios-16` e `01-calendarios-17` Nuxt | Melhor acabamento visual do lote, mas Vue e composables fora do zip. |
| Casos especiais | `01-calendarios-14` Kibo mini (faixa de dias próximos), `01-calendarios-08` React Big Calendar (agenda por recurso, restyling total), `01-calendarios-03` Spectrum RangeCalendar (comportamento de intervalo inline), `01-calendarios-05` Angular Material (só Angular), `01-calendarios-06` SLDS (só Lightning) | |

Evitar: `01-calendarios-09` TOAST UI (cores saturadas, mobile vira imagem estática) e
`01-calendarios-13` Kibo agenda mensal (item só na data final, setas sem aria-label, grade corta no mobile).

### Anti-padrões vistos

- Dia selecionado mais fraco que o dia atual: Fluent mostra seleção em contorno fino e hoje em círculo cheio (`capturas/01-calendarios-01-interacao.jpg`).
- Botão Cancel que só fecha o popover e mantém o valor já aplicado (`01-calendarios-15`).
- Presets de datas futuras únicas ("Tomorrow", "In a week") vendidos como filtro de relatório (`01-calendarios-12`, `codigo.txt:32-38`).
- Horário com segundos em agendamento (`01-calendarios-11`, `codigo.txt:38, 53`).
- Botões de navegação só com ícone e sem nome acessível (`01-calendarios-13` `index.tsx:418-422`; `01-calendarios-14` `index.tsx:158-166`).
- Grade mensal que transborda em 390 px e corta sábado e domingo (`capturas/01-calendarios-13-mobile.jpg`, `capturas/01-calendarios-12-mobile.jpg`).
- Grade mensal no mobile com chips de 3 letras sem hora (`capturas/01-calendarios-17-mobile.jpg`).
- Eventos sobrepostos reduzidos a "C..." ou títulos cortados em colunas estreitas (`01-calendarios-16`, `01-calendarios-08-recurso`).
- Estado de erro só com borda vermelha, sem texto (`capturas/01-calendarios-06-erro.jpg`).
- Criação e edição por `window.prompt` e `window.alert` no exemplo (`01-calendarios-08`, `codigo.txt:45, 54`).
- Popover "+N more" sem a data do dia no topo (`capturas/01-calendarios-17-interacao.jpg`).

### Regras de seleção para uma skill de design

1. Data única em formulário: input digitável com formato visível (placeholder e texto de ajuda) mais botão que abre o calendário. Nunca calendário inline como único meio de entrada.
2. Intervalo em formulário (vigência, contrato): dois inputs rotulados ligados a um calendário compartilhado.
3. Período de relatório ou dashboard: gatilho que mostra o período formatado, presets de período passado (hoje, 7 dias, mês atual, mês anterior, ano), dois meses no desktop e Apply/Cancel onde Cancel restaura o valor anterior.
4. Calendário inline só quando escolher a data é a tarefa principal da tela (reserva, agenda de atendimento).
5. Faixa de dias próximos (mini calendário) só para navegar entre dias de uma agenda ou lista diária; mostrar o dia da semana.
6. Hora junto da data: campos de hora em minutos, com validação de fim depois do início e fuso explícito quando houver usuários em fusos diferentes.
7. Agenda de eventos: semana como visão padrão no desktop; no mobile, 1 a 3 dias ou lista agenda. Não usar grade mensal com chips no mobile.
8. Seleção deve ter mais peso visual que "hoje": seleção em preenchimento cheio, hoje em contorno ou ponto.
9. Toda navegação por ícone precisa de nome acessível; cada dia precisa de rótulo com data completa.
10. Localizar datas pelo `Intl`/locale do produto; nunca fixar mm/dd/yyyy em produto pt-BR.
11. Bibliotecas de agenda com recursos pagos (Scheduler do FullCalendar, plugins do Schedule-X): confirmar licença antes de desenhar em cima delas.

## 2. Quadros, listas e cronogramas (16-quadros-cronogramas)

### Lista curta

| Papel | Item | Motivo observado |
|---|---|---|
| Padrão para histórico de etapas | `16-quadros-cronogramas-08` ReUI Timeline | Três níveis tipográficos, etapa atual marcada, quebra bem em 390 px. |
| Melhor denso e operacional | `16-quadros-cronogramas-10` Tabler lista de tarefas | Tabela por status com seleção, responsável, prazo, prioridade e ação. Corrigir: cabeçalhos somem no mobile e as células não (`codigo.txt:57-58` contra `71-93`); colunas desalinham entre grupos. |
| Kanban com base de código mais completa | `16-quadros-cronogramas-07` ReUI Kanban | Sensores de mouse, toque e teclado; modo onMove para persistir. Exige largura mínima de coluna e rolagem horizontal. |
| Kanban mais limpo visualmente | `16-quadros-cronogramas-05` Dice Kanban | Contagem por coluna, alça de coluna, foco visível. Corrigir sobreposição de colunas em 390 px e a escala de prioridade. |
| Lista agrupada leve | `16-quadros-cronogramas-04` Kibo List | Foco visível entre itens, bom no mobile; arraste só troca status. |
| Reordenar prioridades | `16-quadros-cronogramas-06` Dice Sortable com alça | Alça explícita em tabela; foco na alça não foi confirmado. |
| Casos especiais | `16-quadros-cronogramas-01` Kibo Kanban (anúncios de arraste para leitor de tela), `16-quadros-cronogramas-03` Kibo Gantt por raias (modelo de reservas por recurso) | |

Evitar: `16-quadros-cronogramas-02` Kibo Gantt (rótulos sobrepostos no cabeçalho, barras sem nome, arraste só com
mouse, mobile sem linha do tempo) e `16-quadros-cronogramas-09` Tabler quadro (cards com screenshot, curtir e
compartilhar, sem arraste, marcação dos cards fora do zip).

O lote não tem cronograma (Gantt) aprovado. Para esse caso, a skill deve pedir pesquisa nova em vez de usar os
itens 02 e 03.

### Anti-padrões vistos

- Colunas de kanban espremidas no mobile em vez de rolagem horizontal ou uma coluna por vez (`capturas/16-quadros-cronogramas-01-mobile.jpg`, `capturas/16-quadros-cronogramas-07-mobile.jpg`).
- Colunas empilhadas que se sobrepõem no mobile (`capturas/16-quadros-cronogramas-05-mobile.jpg`).
- Títulos truncados em uma linha já no desktop ("Add...", "Create API...") (`16-quadros-cronogramas-07`, `16-quadros-cronogramas-05`).
- Escala de prioridade invertida: "Medium" em preto cheio chama mais atenção que "High" (`16-quadros-cronogramas-05`, `codigo.txt:132-140`).
- Tabela responsiva que esconde o cabeçalho e mantém a célula, trocando o sentido das colunas (`capturas/16-quadros-cronogramas-10-mobile.jpg`).
- Um grupo por tabela separada, com larguras de coluna diferentes entre grupos (`capturas/16-quadros-cronogramas-10.jpg`).
- Barra de Gantt sem rótulo e janela inicial vazia (`capturas/16-quadros-cronogramas-02.jpg`, `capturas/16-quadros-cronogramas-03.jpg`).
- Arraste só por mouse, sem teclado nem toque (`16-quadros-cronogramas-02`, `packages/gantt/index.tsx:875, 942`).
- Elementos de rede social em card de trabalho: curtir, compartilhar, imagem grande (`capturas/16-quadros-cronogramas-09.jpg`).
- Datas ISO cruas em card (`2024-04-01`).
- Dados de demonstração aleatórios (faker) que mudam a cada carga e produzem estados incoerentes, como item concluído com término futuro.

### Regras de seleção para uma skill de design

1. Muitos itens, triagem e ações em lote: tabela ou lista agrupada por status com contagem por grupo. Kanban não é a visão padrão para operação de volume.
2. Kanban só quando o fluxo tem poucas etapas (3 a 6) e mover o card é a ação principal; mostrar contagem e, se houver, limite por coluna.
3. Colunas de kanban com largura mínima fixa (240 a 320 px) e rolagem horizontal; no mobile, uma coluna por vez com seletor de etapa.
4. Todo arraste precisa de alternativa: teclado (dnd-kit KeyboardSensor com anúncios) e ação "mover para" no menu do card.
5. Card de trabalho mostra título completo em até duas linhas, responsável, prazo formatado e prioridade. Sem imagem, curtidas ou compartilhamento.
6. Escala de prioridade com ordem visual igual à ordem de gravidade; alta nunca mais fraca que média.
7. Tabela agrupada: uma tabela com linhas de grupo, para manter alinhamento; colunas ocultas no mobile somem no cabeçalho e na célula juntos, ou viram lista de pares rótulo e valor.
8. Linha do tempo vertical para histórico de status ou etapas de pedido; não usar como cronograma.
9. Gantt só com rótulo na barra ou tooltip acessível, janela inicial que contém dados, zoom de período e alternativa em lista no mobile.

## 3. Gráficos analíticos (17-graficos-analiticos)

### Lista curta

| Papel | Item | Motivo observado |
|---|---|---|
| Padrão para tendência | `17-graficos-analiticos-03` Tremor LineChart | Linha sem preenchimento, tooltip com todas as séries, mesma API da área e da barra. |
| Padrão para comparação de categorias | `17-graficos-analiticos-02` Tremor BarChart | Cores distintas, faixa de hover, destaque de legenda ativa. |
| Padrão para volume no tempo | `17-graficos-analiticos-01` Tremor AreaChart | Tooltip, eixo reduzido no mobile sem sobreposição. |
| Melhor denso e operacional | `17-graficos-analiticos-05` Tremor BarList | Rótulo dentro da barra, valor à direita, ordenado, legível em 390 px. Tornar linhas focáveis quando clicáveis. |
| Métrica com contexto | `17-graficos-analiticos-06` Tremor SparkChart | Miniatura sem eixo para ficar ao lado do número; não tem tooltip. |
| Parte do total | `17-graficos-analiticos-04` Tremor DonutChart | Aceitável com 2 a 5 categorias, legenda e total no centro ligado. |
| Referência de estilo de marca | `17-graficos-analiticos-07` e `17-graficos-analiticos-08` Untitled UI | Tooltip escuro legível e eixos rotulados; trocar a paleta monocromática. |

Evitar: `17-graficos-analiticos-09` Untitled pizza (cinco roxos indistinguíveis, tooltip sobre o gráfico) e
`17-graficos-analiticos-10` Untitled radar (dias da semana em radar, áreas sobrepostas, sem tooltip no hover).

### Anti-padrões vistos

- Paleta de uma cor só (tons de roxo) para séries categóricas (`capturas/17-graficos-analiticos-08-interacao.jpg`, `capturas/17-graficos-analiticos-09-interacao.jpg`).
- Série empilhada em cinza claro que parece espaço vazio (`capturas/17-graficos-analiticos-07-interacao.jpg`).
- Tooltip que cobre a legenda ou o próprio gráfico (`17-graficos-analiticos-01` a `04`, `09`).
- Donut com 7 setores finos, sem legenda e sem total (`capturas/17-graficos-analiticos-04-interacao.jpg`).
- Radar para série temporal (`capturas/17-graficos-analiticos-10-interacao.jpg`).
- Sparkline solta, sem valor e período ao lado (`capturas/17-graficos-analiticos-06-interacao.jpg`).
- Moeda com separador de outro locale ($3.129) por formatter de demo.
- Curva suavizada (monotone) com gradiente em dado operacional, que altera picos.
- Área preenchida para comparar séries que se cruzam.
- Lista de barras clicável implementada como div sem foco (`17-graficos-analiticos-05`, `codigo.txt:36`).

### Regras de seleção para uma skill de design

1. Tendência no tempo: linha. Área só quando o volume acumulado importa e há no máximo 2 séries que não se cruzam muito.
2. Comparação entre categorias: barras; ranking com rótulos longos ou mais de 8 itens: lista de barras horizontal ordenada.
3. Parte do total: donut com 2 a 5 categorias, total no centro e legenda com valor e percentual; acima disso, barras ordenadas. Pizza e radar fora do padrão.
4. Radar só para perfil multivariado com eixos não temporais e no máximo 3 itens; nunca para dias ou meses.
5. Sparkline só dentro de card de métrica ou célula de tabela, sempre com o valor atual e o período.
6. Séries categóricas com cores de matiz diferente e contraste mínimo 3:1 contra o fundo; nunca só tons da cor da marca.
7. Tooltip não pode cobrir a legenda: legenda fora da área de plotagem ou tooltip com posicionamento que a evita.
8. Formatter de número e moeda sempre do locale do produto (`Intl.NumberFormat` com moeda explícita).
9. Linha reta (linear) em dado operacional; suavização só em visual editorial.
10. Todo gráfico precisa de estado vazio, carregando e erro; nenhum dos 10 itens mostra estado vazio na demo.
11. Interação por hover precisa de equivalente: tabela de dados, legenda focável ou navegação por teclado.

## Falhas e limites desta rodada

- Schedule-X retornou HTTP 502 em uma sondagem; a captura seguinte carregou. Clique para abrir modal de evento falhou por seletor.
- Salesforce: a URL de demo registrada redireciona para o GitHub; usei o Storybook público no Chromatic.
- TOAST UI: a aba "Weekly" não trocou a visão em duas tentativas; no mobile o site mostra imagem estática.
- Kibo Kanban: clique em card para testar foco falhou por seletor; teclado não observado.
- Cloudscape em 390x844: banner de cookies cobre o popover; não aceitei o banner.
- Nenhum teste com leitor de tela nem medição de contraste; a nota `a11y_observed` vem de foco visível, nomes acessíveis lidos no DOM e código.
