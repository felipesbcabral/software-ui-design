# Acabamento de telas de trabalho

O passo de acabamento ocorre depois da implementação funcional e antes da prova. Preserve tokens e controles do produto. Identidade vem da composição, tipografia, densidade, semântica e resposta, sem acrescentar decoração ou biblioteca para preencher a tela.

## Tokens de movimento

| Token proposto quando o projeto não tiver | Ponto de partida | Finalidade |
|---|---|---|
| `--motion-state` | 160 ms (faixa 150 a 200 ms) | Hover, pressionado, seleção e feedback frequente |
| `--motion-layer` | 200 ms (faixa 140 a 260 ms) | Entrada/saída de modal e gaveta, com interação disponível durante interrupção |
| `--motion-out` | `cubic-bezier(.16, 1, .3, 1)` | Curva de desaceleração compartilhada |
| Movimento reduzido | 0 ms para transições; animação decorativa desligada | Preservar o estado final, anúncio, foco e conteúdo |

As faixas e a curva são propostas de partida. [Material, duração e curvas](https://m1.material.io/motion/duration-easing.html) documenta 150 a 200 ms para animações menores e saída mais rápida que entrada. A faixa de camada e a curva acima não são tokens oficiais da Apple ou do Material; o relato do ConsultaNow informa uso de 160 ms com essa curva. [Apple HIG, motion](https://developer.apple.com/design/human-interface-guidelines/motion) sustenta brevidade, finalidade e cancelamento. Não transforme o exemplo do produto em regra universal.

```css
:root { --motion-state: 160ms; --motion-layer: 200ms; --motion-out: cubic-bezier(.16, 1, .3, 1); }
.control { transition: background-color var(--motion-state), color var(--motion-state); }
.layer { transition: opacity var(--motion-layer), transform var(--motion-layer) var(--motion-out); }
@media (prefers-reduced-motion: reduce) {
  .control, .layer { transition-duration: 0ms; animation: none; }
}
```

Aplique o fallback também a skeletons, spinners, JS e rolagem. Se o estado depende de `transitionend`, ele precisa funcionar quando não houver transição. A preferência reduzida pode exigir redução ou alternativa, conforme [critérios da Apple](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/); desligar tudo é o fallback simples deste pacote, não obrigação normativa para todo efeito.

## Microinterações por componente

| Componente | Resposta proposta e prova | Referência do acervo e adaptação |
|---|---|---|
| Botão | Hover distingue disponibilidade; ativo pode deslocar 1 px com `transform`, sem mover layout; nome e foco persistem ao salvar | `12-loading-progresso-03` para estado inline; a translação é adaptação proposta |
| Linha | Hover discreto; seleção diferente do hover, com controle/semântica de seleção; tecla e toque funcionam | `08-tabelas-grids-04` ou `08-tabelas-grids-10` |
| Gaveta | Entrada lateral curta, saída coerente, Esc e retorno do foco; rolagem interna preserva ação | `02-formularios-crud-08`; movimento precisa de adaptação aos tokens |
| Modal | Opacidade e escala discreta apenas se ajudarem orientação; foco, nome e descrição, cancelamento seguro | `20-sobreposicoes-17`; risco destrutivo usa `20-sobreposicoes-18` |
| Toast | `role="status"`, sem roubar foco; 3 a 5 s só para confirmação dispensável; desfazer tem acesso persistente ou tempo ajustável | `14-feedback-estados-05` Carbon Toast exige adaptação de fila e pausa; não prova sozinho um padrão de desfazer |

Uma ação no toast não pode ser o único acesso e desaparecer em cinco segundos. [WCAG 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) permite mensagem temporária quando informação/função continua disponível por outro caminho. Erro e instrução necessários ficam no fluxo. Inspecione os IDs e suas limitações; esta tabela não afirma que os componentes já implementem toda adaptação.

## Padrões de SaaS

| Padrão | Quando usar | Quando evitar | Prova |
|---|---|---|---|
| Desfazer | Ação reversível e frequente, com reversão suportada pelo contrato | Exclusão permanente, efeito externo que não pode voltar, mudança de autorização sem compensação | Executar, desfazer, repetir e falhar a reversão; confirmação proporcional ao risco |
| Atualização otimista | Operação local de alta previsibilidade; reconciliar resposta e reverter com erro | Pagamento, autorização, exclusão irreversível, concorrência sem reconciliação | Sucesso, falha e resposta fora de ordem; resultado anterior recuperado |
| Atalhos e paleta | Ação repetida, destinos numerosos e descoberta disponível | Roubar teclas do navegador, disparar dentro de campo editável, substituir botão visível | Atalho fora/dentro do input, Esc, navegação e nomes; `10-busca-filtros-comandos-08` |
| Edição inline | Um valor simples, validação local, contexto da lista importante | Formulário complexo ou mudança com consequências que exigem revisar várias informações | Enter salva, Esc cancela, erro mantém valor; foco retorna à célula |
| Recibo de ação | Mudança relevante cujo autor/instante ajuda auditoria e confiança | Inventar quem fez, horário ou sucesso antes da confirmação do servidor | Recibo completo no celular e tema escuro; papel da fonte segue `ui-rules.json` |

Esses padrões não são uma lista de funcionalidades obrigatórias. Escolha os que diminuem trabalho ou erro no contrato da tela; registre os que não se aplicam. Atualização otimista e recibo não têm item específico revisado no acervo: use o projeto e os controles já inspecionados como base, sem inventar ID.

## Revisão que passa de correto a bem resolvido

Registre três traços observáveis de identidade quando criar ou redesenhar uma tela: por exemplo, papéis de fonte próprios, ritmo/densidade reconhecível e tratamento coerente de ação e estado. Em refinamento, identifique os traços existentes que foram preservados. Logo sozinho não cobre os três; mudar cores sem propósito também não. Uma correção de alinhamento não exige criar três traços novos.

Compare claro/escuro, largo/estreito e estados com o mesmo conteúdo. Confira alinhamento óptico de ícones, altura de controles, comprimento de rótulos, recibos, hierarquia e continuidade de camadas. `inspect-ui` registra tamanhos de fonte, cores, raios e sombras distintos, duração acima de 500 ms, geometria animada e movimento ativo com preferência reduzida. São pistas para revisar, com limites do projeto; não são nota estética automática.

Se o movimento exigir mais que CSS e os tokens, roteie `design-motion-principles` para decidir finalidade/custo e `emil-design-eng` para engenharia da interação, quando disponíveis. Leia só as referências pertinentes; nenhuma linha nesta referência autoriza instalar pacote ou substituir a fundação do projeto.
