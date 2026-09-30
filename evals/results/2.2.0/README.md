# Piloto da versão 2.2.0

Execução local em 30/09/2026, com dados sintéticos. A atualização incorpora as cinco fases propostas no relato do ConsultaNow. Nenhum teste deste piloto foi executado no produto real.

## Mudanças e evidências

| Fase do relato | Mudança na skill | Evidência |
|---|---|---|
| Inspeção em aplicação real | Sessão autenticada, mock antes da navegação, temas, seletor de montagem, regras locais e novos achados | Testes de sessão/mock, blank, truncamento, CTA, regras, consistência, motion, erros e argumentos |
| Estados com prova | Contrato de dados/gatilho/seletor, matriz isolada, grade e conteúdo longo | 60 combinações da fixture, todas com estado verificado; 120 capturas finais A/B sem erro JavaScript |
| Acabamento | Tokens com fonte ou indicação de heurística, microinterações, padrões de SaaS e três traços observáveis de identidade | Referências de estados/acabamento, regras de papéis de fonte e movimento reduzido |
| Uso como acompanhante | Direção principal preservada; DESIGN.md, tokens, componentes e harness do projeto vêm antes do acervo | Fluxo e contrato de entrega atualizados; referências e metadados validados |
| Avaliação independente | Cenários 7 a 9, dados portáteis, rubrica, condições isoladas, juiz cego/contextual e resultado por versão | Artefatos deste diretório e provas locais registradas abaixo |

`npm test`: **19/19**, sem falha ou skip, exit 0. Validação estrutural da skill e `git diff --check`: exit 0. Playwright 1.63.0 já existia no ambiente; package.json distribui esse runtime, sem dependência na UI. Build, typecheck e lint de aplicação não se aplicam ao repositório de instruções e scripts nativos.

## Ensaio com e sem a skill

Cada produtor implementou configuração/desativação, lista de 300 registros e formulário com validação/falha 500/retry. O pedido operacional e os tokens foram iguais. Ambos herdaram o mesmo modelo do coordenador e receberam frontend-quality deep, emil-design-eng e as instruções globais do ambiente. O identificador exato do modelo e o consumo de tokens não foram disponibilizados; não há orçamento de tokens controlado. O limite comum foi de cinco passagens.

A usa software-ui-design; B recebe o mesmo inspector como ferramenta neutra, sem ler as instruções da skill. A rotulagem foi sorteada e mantida. O juiz recebeu imagens e rubrica antes de ter acesso à condição, ao pedido, ao código ou às métricas. Os pedidos literais e os perfis ficaram preservados na pasta local dos produtores.

A primeira tentativa tinha comprimentos diferentes no estado longo. Suas capturas e notas foram preservadas, mas não sustentam uma conclusão sobre densidade superior. O JSON final foi igualado nas duas condições, incluindo nomes, recibo e sufixo em todos os registros. Os arquivos congelados finais passaram em assert de igualdade com inputs/saas-data.json. A contagem no estado vazio foi corrigida para zero. Também foram corrigidas navegação móvel instável, acesso por teclado ao diálogo e densidade da lista.

Os oito fluxos independentes finais passaram: busca no conjunto inteiro/filtro, bloqueio com Escape e retorno de foco, cancelamento/confirmação elegível e validação/falha/retry com campos preservados. As 304 combinações adicionais do inspector na condição A tiveram seletor verificado, zero achados e zero erros de execução. Esse número não representa revisão visual individual de todas as imagens.

As métricas globais brutas da passagem 5 preservam quatro alertas de input longo em cada condição. A exceção tem prova de rolagem nativa, valor de 60 caracteres íntegro e documento sem overflow em 320/390 px. Warnings: A 722, B 565; unknowns: zero. Os produtores registraram as justificativas; suas notas não substituem o juiz.

## Juízo cego preservado

| Rodada | Capturas vistas | SaaS A / B | Frontend-quality A / B | Decisão |
|---|---:|---:|---:|---|
| Inicial | 72 de 120 | 59,9 / 62,2 | 64,9 / 66,9 | Sem aprovação; dados longos divergentes |
| Final | 74 de 120 | 70,2 / 66,4 | 73,7 / 69,9 | Preferência A com confiança moderada; sem aprovação |

Os relatórios [inicial cego](judge-initial-blind.md) e [final cego](judge-final-blind.md) foram copiados sem alteração. A diferença entre rodadas não é um delta causal da skill. O juiz confirmou contagem coerente no vazio e navegação móvel compacta nas vistas finais; manteve dúvidas sobre loading de A, rolagem da tabela e duas ações de recuperação em B. Movimento e acessibilidade funcional não foram pontuados como comprovados por fotografia.

O [juízo contextual](judge-final-context.md) confirmou acesso aos registros por rolagem/teclado e retry com os valores atuais, encerrando a hipótese de registros inacessíveis. Registrou perda de foco no envio/sucesso e no diálogo de B, além de semântica ausente nos campos obrigatórios. O loading de A é controle de fixture, com ambiguidade visual residual. A etapa encerrou sem aprovação deep e sem recálculo das notas de aparência; a preferência A ficou preservada. As referências da skill incorporam os achados de foco, obrigatoriedade e acesso à paginação.

## Imagens antes/depois

São revisões da tentativa inicial para a final **dentro deste piloto de 2.2.0**, na condição A. Não comparam 2.1.0 com 2.2.0. Mesma rota, tema claro, estado default e preferência de movimento; captura de página inteira preserva recibos abaixo da dobra.

| Tela | 1440 px | 768 px | 390 px |
|---|---|---|---|
| Configuração | [Imagem](comparisons/config-1440.jpg) | [Imagem](comparisons/config-768.jpg) | [Imagem](comparisons/config-390.jpg) |
| Lista | [Imagem](comparisons/list-1440.jpg) | [Imagem](comparisons/list-768.jpg) | [Imagem](comparisons/list-390.jpg) |
| Formulário | [Imagem](comparisons/form-1440.jpg) | [Imagem](comparisons/form-768.jpg) | [Imagem](comparisons/form-390.jpg) |

## Provas locais e limites

Na pasta pai do repositório, `work/test-final.log`, `skill-validate.log`, `diff-check.log` e `eval-evidence.json` preservam as verificações. `work/frozen/initial` e `final` guardam fontes e hashes; `work/blind/initial` e `final`, as 120 capturas de cada rodada. Os pedidos, perfis, scripts de interação, dados brutos e relatórios completos estão em `work/eval-with` e `work/eval-without`. As grades e relatórios comparados ficam em `work/paired-before` e `paired-after`. Essas pastas locais não acompanham um clone; as nove imagens acima acompanham o resultado por versão.

Uma amostra por condição, três cenários do mesmo console e correções durante o ensaio constituem um piloto. Leitor de tela real, aparelho físico, zoom real da UI do navegador, backend e persistência de produção não foram verificados. Reflow equivalente por viewport e preferência de movimento reduzido foram exercitados. Este registro não atribui nota 10 à skill nem transforma zero achados em aprovação estética.

Os produtores leram a versão de trabalho de 2.2.0. As regras sobre geometria do shell, clareza da recuperação, controle de loading no harness e acesso à lista paginada foram reforçadas a partir dos achados do juiz. As páginas congeladas não foram regeneradas após esses últimos ajustes de instrução; as notas descrevem o piloto em desenvolvimento, sem medir o efeito de cada regra final.
