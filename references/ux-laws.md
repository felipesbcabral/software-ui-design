# Leis de UX em telas de software

Sete heurísticas de percepção e decisão que aparecem em quase toda revisão de SaaS, cada uma traduzida em regra de composição com um sinal verificável. O nome da lei não justifica decisão nenhuma sozinho: a regra vale pelo efeito na tela, e cada seção diz onde ela não se aplica. Ao citar uma lei numa decisão, diga o que ela mede e em que condição vale. Não calcule tempos com a fórmula da lei nem atribua a um design system uma regra que você não abriu. Fontes consultadas em 28/09/2026 e listadas em [sources.md](sources.md).

## Conteúdo
- Resumo
- Fitts: distância e tamanho do alvo
- Hick: opções no ponto de decisão
- Jakob: convenções de SaaS
- Von Restorff: um destaque por região
- Goal gradient: progresso real perto da meta
- Zeigarnik: trabalho incompleto visível e retomável
- Miller: a tela lembra pela pessoa

## Resumo

| Lei | Regra em software | Sinal de erro | Como provar |
|---|---|---|---|
| Fitts | Ação onde a tarefa termina; alvo frequente amplo; destrutiva longe da frequente | Salvar só no topo de formulário longo; Excluir colado em Salvar | `targets` do inspect-ui; captura com o botão junto do último campo |
| Hick | Uma ação principal por ponto de decisão; recomendada marcada; mais usados primeiro | Quatro botões preenchidos lado a lado; destino mais usado no meio da lista | Contar botões preenchidos por região; conferir a ordem com o dado de uso |
| Jakob | Posição e comportamento seguem a convenção; identidade fica no visual | Logo sem link; Sair no meio do formulário; atalho inventado | Percorrer a tabela de convenções na entrega |
| Von Restorff | Destaque só no que pede atenção agora, com texto ou ícone | Tudo destacado; anomalia marcada só por cor | Captura com `filter: grayscale(1)` no `body` |
| Goal gradient | Progresso contado nas etapas reais do produto, restantes nomeadas | Barra que abre em 20% por etapa inventada ou fundida | Cada unidade de progresso corresponde a um estado salvo |
| Zeigarnik | Pendência visível, salva e retomável | Checklist que zera ao recarregar; rascunho que some | Sair no meio, recarregar e retomar |
| Miller | A tela mostra o que a decisão exige lembrar | Confirmação sem nome do objeto; CNPJ ou código sem separação | Ler a confirmação sem olhar a tela anterior |

## Fitts: distância e tamanho do alvo

O tempo para acertar um alvo cresce com a distância e cai com o tamanho (Paul Fitts, 1954).

- Ação onde a tarefa termina: enviar logo abaixo do último campo, ou numa barra fixa no rodapé do formulário longo. Ações em lote na barra que surge junto da seleção. Ações da linha na própria linha.
- Alvo frequente amplo: ícone e rótulo clicáveis juntos, linha inteira clicável quando abrir o registro é a ação principal, `<label>` associado ampliando checkbox e radio.
- Ação destrutiva em outro grupo ou região (zona de perigo no fim da página), nunca vizinha imediata da ação frequente e nunca com o mesmo estilo.
- Menu e popover abrem junto do gatilho.

Não use para:
- Impor 44 px no mouse. O mínimo web é 24 × 24 px (WCAG 2.5.8), a meta em controle frequente é 32 a 40 px e 44 px é meta de toque ([defaults.md](defaults.md)). Medida aprovada no projeto vence a meta genérica.
- Justificar ação no canto da tela como "alvo infinito". Isso vale para menu do sistema operacional com mouse. Dentro de uma página no navegador e em toque, a borda não ajuda.

## Hick: opções no ponto de decisão

O tempo de decisão cresce com o número e a complexidade das opções (Hick, 1952; Hyman, 1953).

- Cada ponto de decisão (rodapé de formulário, barra de lista, diálogo, estado vazio) tem uma ação principal. Alternativas em estilo secundário; o resto num menu de overflow.
- Quando uma opção serve à maioria, marque "Recomendado" em texto e pré-selecione se for segura: plano, template, formato de exportação, primeiro passo do onboarding.
- Configuração avançada recolhida atrás de um controle nomeado, com o estado aplicado visível mesmo recolhida.
- Etapas só quando uma decisão depende da anterior. Sem dependência, uma página com seções.
- Com dado de uso, a ordem da sidebar é: Início; os destinos mais usados, no grupo que vem logo abaixo ou numa seção "Mais usados"; os demais grupos; os raros no fim ou no rodapé. Conferência: nenhum destino sem dado de uso fica acima de um destino que o dado aponta como mais usado. Um grupo genérico de entrada, com itens sem dado de uso, acima dos mais usados reprova; subir o item só dentro do próprio grupo também.

Não use para:
- Cortar destinos da navegação. Procurar um item conhecido numa lista é varredura, que cresce linear com o tamanho, e a lei não se aplica. Menu longo se resolve com grupos rotulados (rótulo em heading ou ligado à lista por `aria-labelledby`), busca ou command palette, e a ordem por uso do item anterior.
- Esconder no overflow a ação central só para limpar a tela ([components.md](components.md)).
- Tirar opções de quem usa todo dia. Uso frequente tolera mais opções visíveis; quem começa precisa da recomendação.

## Jakob: convenções de SaaS

As pessoas passam a maior parte do tempo em outros produtos e esperam que o seu funcione do mesmo jeito (Jakob Nielsen, 2000). Na entrega, percorra esta tabela e registre cada desvio com o motivo.

| Convenção | Forma esperada |
|---|---|
| Marca | Logo no canto superior esquerdo, dentro de um `<a>` que leva ao início |
| Conta | Avatar ou nome no topo à direita ou no rodapé da sidebar; perfil, preferências e Sair dentro dele |
| Busca | Campo ou gatilho no topo; Ctrl+K ou ⌘K abre a command palette quando ela existe |
| Teclado | Esc fecha sobreposição, Enter envia formulário curto, Tab segue a ordem visual |
| Diálogo | Ordem dos botões do design system ou da plataforma do projeto (Windows e macOS diferem) |
| Link e botão | Link navega e tem cara de link; botão executa ação |
| Configurações | No menu da conta ou no rodapé da sidebar, com navegação local por domínio |
| Estado | Vermelho para erro e destruição, verde para sucesso, sempre com texto ou ícone |

- Identidade mora na camada visual (cor de destaque, tipografia, detalhe de marca). Posição e comportamento seguem a convenção. Assim a regra "Correto e sem identidade" do SKILL.md e esta lei não brigam.
- Controle nativo antes de controle próprio: select, input de data e checkbox nativos já trazem o teclado esperado.
- Redesign que move algo usado todo dia avisa o que mudou e, quando possível, oferece prévia ou caminho de volta por um período.

Não use para copiar a aparência de um concorrente. A convenção é de posição e comportamento.

## Von Restorff: um destaque por região

Entre itens parecidos, o que difere é o que fica na memória (Hedwig von Restorff, 1933).

- Um botão preenchido por região visível. Os demais em estilo secundário, fantasma ou link.
- Destaque reservado ao que pede atenção agora: registro atrasado, erro, aprovação pendente, opção recomendada.
- Anomalia de dados com ícone e texto além da cor ("Atrasado", ícone de alerta).
- Cor de ação separada da cor de estado ([anti-patterns.md](anti-patterns.md), item 20).

Não use para:
- Destacar tudo. Três destaques na mesma região se anulam e a tela ganha cara de anúncio.
- Chamar atenção com movimento contínuo. Pulsar ou piscar só com propósito e respeitando `prefers-reduced-motion`.

## Goal gradient: progresso real perto da meta

O esforço aumenta à medida que a meta se aproxima (Clark Hull, 1932). Kivetz, Urminsky e Zheng (2006) mediram isso num programa de fidelidade: o cartão de 12 selos com 2 já carimbados foi completado mais rápido que o cartão de 10 vazio, embora os dois exigissem 10 compras.

- Onboarding, configuração e formulário longo mostram "N de M" e o nome das etapas que faltam.
- Monte a lista antes de olhar qualquer porcentagem pedida. A contagem tem um item por tarefa pedida ou exigida pelo produto, opcionais incluídas e marcadas como opcionais, mais o que já foi feito. Juntar tarefas no fluxo é permitido (criar o primeiro projeto dentro do convite da equipe, por exemplo); na contagem cada tarefa continua sendo um item, e o checklist marca os dois quando o fluxo único termina.
- O que a pessoa já fez de verdade conta como feito: conta criada, e-mail confirmado, dado importado. Esse é o equivalente honesto dos selos já carimbados.
- Primeiro ganho cedo: a etapa curta que leva ao primeiro resultado útil vem antes da burocracia, quando a dependência permite.
- A próxima etapa é a ação principal da tela.

Não use para inventar progresso ([anti-patterns.md](anti-patterns.md), itens 26 e 34):
- Barra que começa em X% sem etapa concluída por trás.
- Juntar, dividir ou esconder etapa para a conta bater um número pedido. Com três etapas reais e uma já cumprida, a barra mostra 1 de 3, mesmo que o pedido fosse "começar em 50%". Registre a troca na entrega.
- Etapa fantasma para inflar a contagem.

Sinal de alerta: a contagem final dá exatamente a porcentagem que alguém pediu. Releia a lista de tarefas do pedido e confira que cada uma tem o seu item. As racionalizações abaixo apareceram em testes desta skill:

| Racionalização | Resposta |
|---|---|
| "A fusão tem motivo técnico, não foi para bater o número" | Junte o fluxo se quiser; a contagem continua com um item por tarefa |
| "Essa tarefa é opcional ou vem depois da meta, fica fora da barra" | Continua item da contagem, com o rótulo "opcional" e o botão de adiar |
| "Deu o número pedido porque a conta criada é etapa real" | A etapa real conta; confira se todas as tarefas pedidas também contam |
| "Menos etapas motivam mais" | Motiva o que é verdade: etapa escondida reaparece depois e a barra anda para trás |

## Zeigarnik: trabalho incompleto visível e retomável

A formulação original diz que tarefa interrompida é lembrada melhor que tarefa concluída (Bluma Zeigarnik, 1927). A meta-análise de Ghibellini e Meier (2025, 59 estudos) não encontrou essa vantagem de memória: a razão de recordação ficou em 0,99. O que se sustenta é a tendência de retomar a tarefa interrompida (efeito Ovsiankina), e a regra parte dela.

- Pendência aparece como item acionável: rascunhos com contagem, "Continuar de onde parou" com o nome do item, checklist de configuração que fica até ser concluído ou dispensado.
- O estado do checklist e dos rascunhos é salvo a cada etapa e restaurado ao recarregar: no servidor em produto real; em protótipo sem backend, em `localStorage` com leitura protegida por try/catch.
- Retomar leva ao ponto exato: etapa, campo e valores já preenchidos.
- A pessoa pode adiar ou dispensar o checklist. Dispensar não desfaz o que já foi feito.

Não use para criar urgência falsa: badge vermelho sem pendência real, aviso de "deixou pela metade" sobre algo que a pessoa não começou, checklist impossível de fechar.

## Miller: a tela lembra pela pessoa

A memória de trabalho segura poucos itens. Miller (1956) estimou 7 ± 2; Cowan (2001) revisou para cerca de 4 blocos.

- Confirmação repete o nome, a quantidade e a consequência. Comparação acontece lado a lado. Filtros ativos e seleção continuam visíveis ao abrir um detalhe.
- Identificador que a pessoa lê, confere ou digita aparece em blocos: CPF 000.000.000-00, CNPJ 00.000.000/0000-00, CEP 00000-000, telefone (11) 00000-0000, código de recuperação em grupos curtos separados por hífen ou espaço (ABCD-1234-EFGH).
- Token e chave de API longos ficam em fonte monoespaçada com botão de copiar. O botão de copiar entrega o valor no formato que o destino aceita, sem os separadores de exibição quando eles não fazem parte do valor.
- Formulário longo em seções nomeadas, cada uma com poucos campos relacionados.
- Instrução necessária fica no passo em que é usada, não numa tela anterior.

Não use para limitar menu, abas, colunas ou opções a 7. A própria Laws of UX avisa contra esse uso. Uma sidebar com 12 destinos em grupos rotulados está correta; cortar para 7 e esconder o resto em "Mais" piora a localização. Bloco é exibição: a validação continua real ([components.md](components.md)).
