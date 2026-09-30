# Estados que precisam de prova

Mapeie os estados existentes no contrato de tela. Para cada um, registre dado, gatilho, seletor visível esperado e captura. Excluir um estado inexistente é válido; escrever "verificado" sem exercitá-lo é falha. Use o mock em [inspection.md](inspection.md) para uma rodada reprodutível.

| Estado | Comportamento e prova | Exemplo do acervo |
|---|---|---|
| Carregando | Skeleton com geometria final, cabeçalhos reais e `aria-busy`; conteúdo anterior permanece durante recarga; resposta atrasada prova o indicador | `13-skeletons-02` Carbon DataTableSkeleton; `13-skeletons-01` Fluent Skeleton |
| Vazio | Diga o que está vazio e ofereça uma ação possível; coleção vazia difere de busca sem resultado | `14-feedback-estados-06` Primer Blankslate; `14-feedback-estados-10` shadcn Empty |
| Erro | Nomeie a operação que falhou e a saída disponível; preservar dados digitados, permitir tentar novamente; não inventar causa técnica desconhecida | `14-feedback-estados-04` Carbon InlineNotification; `14-feedback-estados-02` Cloudscape Alert |
| Conteúdo longo | Nomes, recibos, datas e erros quebram linha; truncamento secundário só com acesso integral por teclado e toque | Tabela `08-tabelas-grids-04` e drawer `02-formularios-crud-08`; conferir o padrão da página |
| Permissão, salvando e sucesso | Controle bloqueado tem motivo; envio evita duplicação sem perder foco; sucesso confirma resultado, autor e instante quando conhecidos | `12-loading-progresso-03` Carbon InlineLoading; `14-feedback-estados-01` Cloudscape StatusIndicator |

Em vazio de coleção, a contagem é zero. Em busca sem resultado, mostre zero resultados e mantenha o total da coleção apenas se o rótulo distinguir ambos. Não mantenha "300 profissionais" junto de "adicione o primeiro". Confira conteúdo e contagem, além do seletor de estado.

Preserve a geometria do shell entre estados; uma página curta não pode esticar a navegação e empurrar a tarefa. No erro, identifique uma saída principal: botões de retry e salvar simultâneos precisam deixar claro se executam a mesma operação. Controles para forçar loading ou falha ficam no harness de teste; não introduza "Carregar agora" no produto só para demonstrar o mock.

Ao salvar, impeça submissão duplicada sem remover o foco. Se `disabled` ou a troca do feedback remover o controle ativo, mantenha-o estável com `aria-disabled` e guarda de submissão, ou defina um destino útil de foco após a resposta. Prove o intervalo salvando, a falha e o sucesso, inclusive quando retry estava dentro do feedback substituído. Campos obrigatórios precisam de `required` nativo ou semântica equivalente no controle customizado; a validação JavaScript sozinha não comunica essa exigência.

## Tempo do indicador

Use primeiro os tokens do projeto. Na ausência deles, o ponto de partida para o skeleton é atraso de 300 ms, valor do `delay="short"` do [Primer SkeletonBox](https://primer.style/product/components/skeleton-box/). Skeleton preserva a estrutura; não inventa percentuais de avanço.

A proposta do relato de manter o indicador por 500 ms serve para evitar um flash depois que ele aparece. É heurística deste pacote, não exigência do Primer nem do WCAG. Não atrase dados já disponíveis ou a próxima ação para cumprir o mínimo: remova o indicador assim que o conteúdo útil puder aparecer. Se a operação termina antes de 300 ms, não mostre skeleton. Meça a operação lenta e a rápida; configure o mock para capturar depois do atraso e antes da resposta.

Status de rotina usa `aria-live="polite"` ou `role="status"` no contêiner adequado, sem duplicar anúncio no ícone. Reserve alerta imediato para falha que exige atenção. Não mova foco para um toast. A fonte do requisito de anúncio é [WCAG 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html); a aplicação concreta depende da tarefa.

## O que encerra a prova

| Caso | Exercício mínimo |
|---|---|
| Rede lenta | Abrir a rota, ver skeleton na forma final, concluir carga e confirmar que o conteúdo substitui o indicador |
| Coleção vazia | Resposta com zero registros, ação de criação disponível; busca sem resultado oferece limpar filtro |
| API falha | Resposta 500, mensagem e retry, resposta seguinte válida; formulário mantém valores |
| Texto longo | Nome e recibo completos em 390 e 320 px; nenhuma informação necessária exige hover |
| Lista paginada | Busca/filtro usam toda a coleção; percorra o último item da página e da coleção, inclusive em região com rolagem interna; contagem distingue total, resultados e itens na página |
| Sem permissão | Ação indisponível com motivo e caminho autorizado; nenhum mock substitui teste de autorização no backend |

`first-row` não se aplica quando `state` é `loading`, `empty`, `error` ou `permission`; overflow, foco, nomes, contraste e regras continuam sendo medidos. Um carregamento visualmente correto ainda precisa de teste de conclusão e limpeza. Capture estados destrutivos adicionais: confirmação, bloqueio com saída e recibo de inatividade.
