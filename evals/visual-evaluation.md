# Avaliação visual independente

Use os cenários 7 a 9 de `evals.json`, com dados sintéticos em `inputs/saas-data.json`. São regressões inspiradas no relato do ConsultaNow, sem representar teste no produto real. O mesmo pedido, dados, restrições, modelo, orçamento e ambiente devem ser usados nas duas condições: skill atual e sem software-ui-design. Não dê critérios ocultos nem resultado esperado aos agentes produtores.

O estado longo usa os valores exatos de `longContent`, inclusive o sufixo em todas as linhas. Compare igualdade de dados por estado antes de pontuar densidade ou wrapping. Preserve uma tentativa com dados divergentes como evidência de limite do ensaio, sem usá-la para concluir superioridade. Contagem no estado vazio deve representar zero registros, distinta de zero resultados com uma coleção existente.

## Preparação e execução

1. Crie duas pastas isoladas fora dos arquivos do produto. Um produtor recebe o pedido e a skill; o outro recebe só o mesmo pedido e dados. Registre modelo, data, versão, duração, comandos e hash dos artefatos. Outras instruções obrigatórias do ambiente se aplicam igualmente aos dois; registre esse fator.
2. Execute os três fluxos, com dados/estados esperados e temas suportados. Capture 1440, 768 e 390 px; acrescente 320 px e movimento reduzido. Use `inspect-ui --mock --states --color-scheme` e os testes de interação. Reprove tela em branco, cenário não montado e dados fictícios apresentados como reais.
3. Troque nomes de arquivos e rótulos por A/B, com ordem sorteada. O juiz recebe apenas capturas, viewport/tema/estado, esta rubrica e identificação do cenário. Sem SKILL.md, código, prompt original, métricas, condição ou justificativa na fase cega. Não lhe peça para adivinhar qual usou a skill.
4. Depois de salvar a avaliação cega, dê pedido, restrições, perfil e métricas ao mesmo juiz. Registre revisão de achados, bloqueadores, nota por dimensão, preferência, empate e razão. O autor não altera a nota do juiz. Interação e motion sem evidência ficam como não verificados, nunca nota máxima por captura estática.
5. Salve o resultado por versão em `evals/results/<versão>/`, com um resumo portátil e os caminhos dos artefatos locais. Corrija falhas demonstradas e execute novamente as verificações afetadas. Preserve a primeira tentativa para evitar escolher só a melhor entrega.

## Rubrica de SaaS

| Dimensão | Peso | O que observar |
|---|---:|---|
| Hierarquia | 20 | Tarefa principal e ação reconhecíveis; ações destrutivas separadas |
| Densidade | 15 | Primeira linha, registros visíveis, comparação, conteúdo longo e reflow |
| Estados | 20 | Loading, vazio, erro/retry, conteúdo longo, bloqueio e sucesso, quando aplicáveis |
| Motion | 10 | Resposta curta com propósito, interrupção, reduced motion; exige evidência dinâmica |
| Identidade | 15 | Papéis de fonte, ritmo, semântica e controles do mesmo produto; três traços observáveis |
| Acessibilidade | 20 | Nome, foco, teclado, contraste, toque, anúncio, reflow e acesso ao conteúdo completo |

Nota por dimensão: 0 a 10. Total = soma(nota × peso / 10), de 0 a 100. Captura estática pode avaliar aparência, mas não comprova teclado, anúncios, retorno de foco ou animação. Marque a parte sem evidência como não verificada e reduza a confiança; não invente teste. Perda de dados, ação principal inacessível, estado ausente e informação necessária cortada bloqueiam aprovação, mesmo com média alta.

Quando `frontend-quality` estiver ativo, conserve também sua rubrica de 100 pontos e o juiz cego/contextual do tier. A rubrica de SaaS complementa, não substitui os gates do projeto. Três cenários e uma amostra por condição são um piloto: vitória local não significa melhora estatisticamente comprovada, nem autoriza atribuir nota 10 à skill.

## Comparação antes/depois

Sirva cada condição na mesma URL lógica ou use mocks separados que exponham a mesma rota. `--compare <pasta>` emparelha rota, largura, tema, estado e movimento; divergência de matriz deve aparecer como par ausente. As imagens comparadas não são diff perceptual nem julgamento automático de beleza.
