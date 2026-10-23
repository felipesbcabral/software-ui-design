# Acervo de 5 sites (coleta de 22/10/2026)

Pacote de pesquisa com 5.009 registros públicos de Landdding (2.540 sites), Motionin (54 seções interativas), Wonderlist (33 grupos Figma), Modulify (117 templates) e Iconly (2.265 ícones de app). Fica em `biblioteca-ui-software/estudos/acervo-5-sites-2026-10-22/` (37 MB): `atlas/index.html` para buscar com filtros offline, `DESIGN.md` para a síntese, `estudos/GLOSSARIO_UIUX.md` com 261 conceitos (significado, aplicação e erro comum), `sites/<site>/ANALISE.md` por fonte. São fichas de inspiração e metadados, não código nem capturas: abra o site antes de citar.

## Conteúdo

- Quando usar em tela de software
- Contrato de componente
- Estados por família
- Tela que é catálogo, biblioteca ou busca
- Níveis de evidência e vocabulário da entrega
- Tokens e cor
- Movimento em ferramenta

## Quando usar em tela de software

| Necessidade | Fonte |
|---|---|
| Comparar como produtos SaaS apresentam o próprio painel (captura real, prévia de produto) | Landdding, categoria `saas`; Wonderlist (53 SaaS) |
| Ícone de app, favicon, cor dominante por segmento | Iconly |
| Termo exato para um padrão de UI e o erro comum dele | `GLOSSARIO_UIUX.md` |
| Página de catálogo, galeria ou biblioteca dentro do produto | Seção abaixo |

Consulta ao catálogo do Landdding (campos `title`, `project_url`, `category.name`, `tags`, `colors_declared`, `upvotes`):

```sh
python -I -c "import json,sys;c,t=sys.argv[1],sys.argv[2];R=[json.loads(l) for l in open(sys.argv[3],encoding='utf-8')];R=[r for r in R if (r.get('category') or {}).get('name','').lower()==c and (t=='-' or t in r.get('tags',[]))];[print(r['upvotes'],r['title'],r['project_url'],r['colors_declared']) for r in sorted(R,key=lambda r:-(r.get('upvotes') or 0))[:12]]" saas - <acervo>/sites/landdding/catalogo_designs.jsonl
```

## Contrato de componente

Antes da aparência, escreva quatro campos para cada componente novo ou trocado. A descrição sobrevive a uma mudança completa de estilo.

- **Entrada:** o que recebe (título, categoria, URL, metadados; opções e seleção; mídia).
- **Ação:** o que a pessoa faz com ele.
- **Estado:** os estados que existem (tabela abaixo).
- **Saída:** o que muda depois (abre o detalhe, altera o conjunto, informa resultado e vazio).

Exemplo: um filtro recebe opções e seleção, altera o conjunto, informa contagem e estado vazio. Uma prévia recebe mídia, lida com carregamento e falha, leva ao projeto.

A unidade visual acompanha a tarefa: herói apresenta, tabela comparativa apoia uma decisão, formulário coleta, painel age sobre dados. Trocar tudo por cartão esconde essas diferenças.

## Estados por família

| Família | Informação essencial | Estados a especificar | O que uma referência estática não prova |
|---|---|---|---|
| Navegação principal | Onde estou e para onde vou | Atual, expandido, foco, mobile | Ordem de Tab e fechamento |
| Busca | Consulta e resultado | Inicial, digitando, sem resultado, limpo | Teclado, resposta e consulta preservada |
| Filtros por faceta | Opções e seleção | Aplicado, indisponível, removido | Combinação de filtros e contagens |
| Grade de itens | Nome, categoria, origem | Normal, foco, mídia indisponível | Ordem de leitura e tamanho do alvo |
| Página de detalhe | Evidência e próxima ação | Disponível, restrito, ausente | Destino real de cada ação |
| Comparação de planos | Diferença de acesso | Plano atual, opção selecionada | Clareza de cobrança e recursos |
| Prévia | Conteúdo representativo | Carregando, pronto, falha | Custo de mídia e alternativa |
| Modal ou lightbox | Conteúdo ampliado | Aberto, fechado, foco | Escape, retorno do foco e rolagem |
| Anterior e próximo | Posição e alternativas | Anterior, próximo, limites | Continuidade sem perder contexto |
| Notificação | Resultado de uma ação | Sucesso, erro, progresso | Anúncio assistivo e duração suficiente |

Comportamento de widget: [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/). Um padrão acessível não se infere da beleza de uma captura.

## Tela que é catálogo, biblioteca ou busca

- **Cartão com quatro fatos:** imagem, título, contagem com unidade explícita ("12 telas", não "12"), modo ou tipo.
- **Facetas por eixo, nunca uma lista única de tags:** setor responde "para quem", estilo "como parece", tecnologia "como foi feito", componente "qual função", preço "qual acesso", cor "qual pista". Cada filtro elimina candidatos; nenhum certifica adequação.
- **Ficha** com atribuição, itens semelhantes, anterior e próximo; rodapé como segunda superfície de descoberta.
- **Separe descobrir, ver prévia e copiar**, e diga o que cada ação abre: prévia, login, edição, compra ou documentação.
- Consistência de nome, filtro, estado e posição dos controles vale mais que variedade num acervo grande.
- Mantenha identificador estável, URL de origem, data de coleta e campo ausente explícito: um `null` diz o que falta, e trocá-lo por suposição estraga o dado.

## Níveis de evidência e vocabulário da entrega

- Quatro níveis, registrados em cada referência: **metadado publicado** (campo da fonte), **declaração CSS** (literal numa folha pública; não prova que está ativo), **cálculo derivado** (contraste calculado sobre o declarado) e **recomendação** (raciocínio próprio).
- A interface do catálogo não é a interface catalogada: as cores do Wonderlist são do Wonderlist, não dos sites que ele lista.
- "Inspirado em" descreve origem visual; "adaptado de código licenciado" exige código e licença; "testado" exige execução e resultado.
- Gratuito no catálogo não é licença de redistribuir (Motionin veda redistribuir prompts e specs; Wonderlist vende os arquivos Figma; Modulify restringe raspagem).

## Tokens e cor

- Três camadas: **primitivo** (cor, dimensão, duração), **semântico** (texto, superfície, ação, retorno) e **componente** (botão, campo, cartão). Troca de tema muda valores e mantém papéis; nunca funda variáveis homônimas de temas diferentes.
- Paleta de referência vira sistema em seis passos: escolher pelo objetivo e pela legibilidade; abrir a ficha de origem; registrar as cores dadas e as que faltam; definir papéis próprios (superfície, texto, borda, ação, foco, retorno); examinar os pares que ficarão de fato adjacentes; validar com conteúdo real e todos os estados.
- Tipografia por função: título, subtítulo, texto corrido, metadado, rótulo e número tabular. Em tela com filtros e tabelas, a hierarquia precisa sobreviver à densidade; medida de vitrine não se aplica.

## Movimento em ferramenta

Ferramenta de uso frequente preserva previsibilidade em tarefas repetidas. Quando houver movimento além dos tokens de [acabamento.md](acabamento.md), escreva o contrato de nove campos: objetivo, elemento, gatilho, progresso, transformação, limites (começo, fim, repouso), alternativa (toque, teclado, movimento reduzido), ciclo de vida (inicia, pausa, remove eventos) e aceite (estados e trajetos a demonstrar). Animação de entrada nunca deixa informação indisponível se o JavaScript ou a mídia falharem.
