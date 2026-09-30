# Antipadrões de interface de software

Lista para revisar uma tela antes de entregar. Cada item traz o sinal que denuncia o problema, o motivo e a troca. Os itens 1 a 6 vêm de críticas reais a um painel administrativo feito com skills de design de site: largura de leitura aplicada a telas de dados, fundo bege apagado, menu sem hierarquia e tarefas escondidas.

## Conteúdo
- Espaço e largura
- Navegação
- Listas, tabelas e dashboards
- Formulários e sobreposições
- Cor, tipo e acabamento
- Estados e feedback
- Sinais de "cara de IA"
- Correto e genérico
- Leis de UX aplicadas errado ou esquecidas

## Espaço e largura

1. **Tela de dados numa coluna central estreita.** Sinal: lista, tabela, quadro ou calendário com `max-width` de 640 a 960 px e faixas vazias dos dois lados em 1440 px. Motivo: a regra de largura de leitura serve a texto, não a comparação de registros. Troca: área principal fluida fora da sidebar; limite só no bloco de texto ou formulário. `inspect-ui.mjs --data-screen` acusa `width-usage`.
2. **Trabalho abaixo da dobra.** Sinal: título grande, parágrafo de introdução, card de progresso, busca, fileira de filtros e só então o primeiro item, abaixo de 55% da altura. Troca: título curto de uma linha, busca e filtros numa barra única, resumo compacto ou recolhível. `inspect-ui.mjs` acusa `first-row`.
3. **Grupos recolhidos por padrão para a página parecer curta.** Sinal: 325 tarefas e nenhuma visível. Troca: mostrar o grupo prioritário aberto, contagem nos demais.

## Navegação

4. **Menu lateral como lista plana de links do mesmo peso.** Troca: grupos com rótulo de seção, item ativo claramente diferente de hover, ícones consistentes de um único conjunto, contexto (workspace/conta) separado dos destinos, configurações e ajuda no rodapé.
5. **Seletor de contexto como links soltos.** Troca: um seletor (dropdown ou combobox) com o contexto atual visível.
6. **Rail só de ícones com tooltip apenas no hover.** Sinal: `inspect-ui.mjs` acusa `tooltips` ou `keyboard`. Troca: itens focáveis (`a`/`button`), `aria-label`, tooltip que abre também no foco, e opção de expandir para ver rótulos.
7. **O mesmo destino em três lugares** (sidebar, abas e cards de atalho). Troca: um nível de navegação por nível de hierarquia.
8. **`role="menu"` em navegação comum** sem o teclado de menu. Troca: `nav` + lista + links + `aria-current="page"`.

## Listas, tabelas e dashboards

9. **Card alto para cada registro de uma lista grande.** Troca: linha de 40 px (ou 32 px) com título, status, responsável e prazo em colunas; card só para conteúdo heterogêneo ou mídia.
10. **Dashboard de KPIs decorativos.** Sinal: quatro cards com número grande, seta verde e percentual sem período nem origem. Troca: métricas que levam a uma ação, com período e definição; fila de exceções ou pendências em destaque num dashboard operacional.
11. **Gráfico para preencher espaço.** Troca: tabela ou lista das pendências; gráfico só quando a comparação visual responde a uma pergunta.
12. **Tabela virando cards no celular por reflexo.** Troca: reduzir colunas opcionais, detalhe por linha, ou rolagem horizontal identificada quando a comparação é essencial.
13. **Filtro que só vale para a página carregada** sem avisar. Troca: filtrar o conjunto inteiro e mostrar filtros ativos com remoção individual.

## Formulários e sobreposições

14. **Placeholder no lugar do rótulo.** `inspect-ui.mjs` acusa `campos sem rótulo`. Troca: rótulo persistente, placeholder só como exemplo.
15. **Campo curto esticado até 1200 px.** Troca: largura pelo tamanho da resposta (CEP, data, quantidade estreitos; nome e descrição largos).
16. **Informação essencial dentro de tooltip** (regra de senha, motivo de bloqueio). Troca: texto de ajuda sempre visível.
17. **Modal sobre modal.** Troca: página ou drawer quando o fluxo cresceu.
18. **Confirmação genérica de exclusão** ("Tem certeza?"). Troca: nome do objeto, quantidade e consequência; desfazer quando existir.

## Cor, tipo e acabamento

19. **Fundo tingido apagado com texto cinza claro.** Sinal: bege ou creme, texto secundário abaixo de 4,5:1, regiões pouco distintas. `inspect-ui.mjs` acusa `contrast`. Troca: superfícies com degraus claros (fundo da app, superfície, superfície elevada), texto secundário que passa 4,5:1, uma cor de destaque aplicada com critério.
20. **Cor de ação usada também como cor de estado.** Encontrado em 19 dos DESIGN.md revisados. Troca: tokens separados para ação, sucesso, alerta, erro e informação.
21. **Fonte serifada ou de display no corpo da interface.** Troca: sans de interface em 14 px para produto; display só na marca.
22. **Ícones de conjuntos misturados** (traço e preenchimento, espessuras diferentes). Troca: um conjunto (Lucide, Phosphor, Heroicons, Material Symbols, Carbon icons, Tabler), tamanho 16 ou 20 px, traço consistente.
23. **Raio, sombra e borda diferentes em cada card.** Troca: 2 ou 3 raios e 2 níveis de elevação no sistema inteiro.
24. **Borda de campo invisível no tema escuro** (contraste de 1,08 a 1,11:1 em Warp, xAI e Upstash, pelos DESIGN.md comunitários). Troca: borda de controle com pelo menos 3:1 contra o fundo (WCAG 1.4.11).

## Estados e feedback

25. **Spinner de página inteira para uma ação pequena.** Troca: loading localizado no botão ou na região; skeleton quando o layout final é conhecido.
26. **Porcentagem inventada.** Troca: barra indeterminada quando não há medida real.
27. **Toast como único aviso de erro crítico.** Troca: mensagem inline persistente perto da causa.
28. **Tela vazia sem próximo passo.** Troca: o que pode ser criado ou importado, conforme permissão, e um botão para isso.
29. **Foco removido** (`outline: none`) sem substituto. `inspect-ui.mjs` acusa `focus`.

## Sinais de "cara de IA"

30. Gradiente roxo-azul em cards e botões, glassmorphism em tela de dados, emoji como ícone de navegação, títulos em Title Case, textos de marketing ("Supercharge your workflow") dentro do produto, cards com o mesmo peso para tudo, métricas falsas com setas verdes. Troca: a composição sóbria de produtos de referência (Linear, Vercel, GitHub, Stripe Dashboard, Atlassian): hierarquia por tipo e espaço, cor para significado.

## Correto e genérico

31. **Rail recolhido como estado inicial no desktop.** Sinal: a primeira impressão é uma coluna de ícones. Troca: expandida a partir de 1280 px, rail por escolha da pessoa.
32. **Login em cartão centralizado num SaaS.** Sinal: um cartão branco no meio de um fundo cinza, sem nada do produto. Troca: tela dividida com painel de marca e prévia do produto; cartão só em ferramenta interna.
33. **Tela sem traços observáveis do produto.** Sinal: passaria por qualquer template. Troca: em criação/redesign, registrar três traços em tipografia, ritmo/densidade e tratamento de ação/estado; em refinamento, preservar os existentes. Prova na captura e na linha Acabamento, conforme [acabamento.md](acabamento.md); logo sozinho não basta.

## Leis de UX aplicadas errado ou esquecidas

Critérios completos, limites e fontes em [ux-laws.md](ux-laws.md).

34. **Progresso moldado ao número pedido** (goal gradient). Sinal: a barra abre em 20% ou 50% porque etapas foram fundidas, divididas, inventadas ou tiradas da barra como "opcionais" para a conta fechar. Troca: um item por tarefa real, o que já foi feito conta como feito, "N de M" honesto e a troca registrada na entrega. Fundir o fluxo é permitido; a contagem não muda.
35. **Checklist ou rascunho que zera ao recarregar** (Zeigarnik). Sinal: nenhum estado salvo; sair no meio perde o avanço. Troca: salvar a cada etapa e retomar no ponto exato.
36. **Salvar só no topo de formulário longo, ou Excluir colado em Salvar** (Fitts). Sinal: texto do tipo "salve no botão lá em cima"; ação destrutiva vizinha da frequente. Troca: ação junto do último campo ou em barra fixa; destrutiva em zona separada.
37. **Vários botões preenchidos na mesma região** (Von Restorff e Hick). Troca: um preenchido por região; o resto secundário ou em overflow.
38. **Menu cortado em 7 "por causa da lei de Miller", ou destino mais usado enterrado no meio da lista** (Miller e Hick). Troca: todos os destinos em grupos rotulados; os mais usados no alto da sidebar, logo depois do Início, e não só no topo do próprio grupo; os raros no fim.
39. **Convenção quebrada sem ganho** (Jakob). Sinal: logo que não leva ao início, Sair no meio do conteúdo, atalho próprio no lugar do esperado. Troca: a tabela de convenções de ux-laws.md.
40. **Identificador longo sem separação** (Miller). Sinal: CNPJ, CEP, telefone ou código de recuperação corridos. Troca: exibição em blocos e botão de copiar.
