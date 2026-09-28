# Síntese R6: chats de IA, arquivos e editores, colaboração e atividade

> Revisão profunda de 26/09/2026. IDs como `08-tabelas-grids-04` são fichas do acervo; caminhos `capturas/...`, `paginas/...` e `codigo.txt` são relativos a `<acervo>/revisao-profunda/` ou à pasta do item. Registros completos: `<acervo>/revisao-profunda/componentes-revisados.json`.

Lote de 36 itens: `06-chats-ia-01..16`, `18-arquivos-editores-01..10`, `19-colaboracao-atividade-01..10`.
Registros completos em `componentes-R6.json`; capturas em `capturas/<id>*.jpg`; texto visível, ordem de Tab e log de interação em `paginas/<id>.txt`.

Vereditos: 8 recomendados como padrão, 17 adaptar, 9 referência especializada, 2 não recomendados como direção visual padrão, 0 descartar.

## Método e limites

- Cada demo foi aberta em Chromium sem cabeça, com captura em 1440 px e, nos itens de layout, em 390 px. Vi todas as capturas citadas.
- Exercitei: digitação no compositor, sequência de Tab a partir dele com recorte do elemento focado, menus por seta, Escape, arquivos de teste gerados localmente (TXT, PNG de 70 B, 5 KB e 11 MB) em áreas de upload que processam no navegador, seleção de texto e menu por barra em editores, abas por seta.
- Não enviei mensagem em nenhum chat de terceiro. Streaming, parar, copiar, refazer e editar foram avaliados pelo código salvo e pelos botões presentes na tela. Onde a nota depende disso, o registro diz.
- Não entrei em sala de colaboração pública (19-colaboracao-atividade-09) para não publicar presença.
- Banners de cookies da Cloudscape foram ocultados por CSS, sem aceitar. O banner da Nuxt ficou na tela (o clique em "Opt out" falhou) e cobriu o campo de resposta em 19-colaboracao-atividade-02.

## Escolhas por necessidade

### Copiloto em painel lateral

Nenhum item do lote passou como padrão para painel lateral.

1. `06-chats-ia-12` Tambo (adaptar): painel redimensionável com parar e erro no compositor, anel de foco forte. Falta nome no botão enviar e os botões MCP precisam sair se o produto não usar MCP.
2. `06-chats-ia-10` CopilotKit sidebar (referência especializada): visual mais limpo, mas o recurso passa por checagem de licença (`CopilotSidebar.tsx:44-53`), o enviar não tem nome, o Tab seguinte cai no body, Escape não fecha e o texto da página ficou cortado sob o painel.
3. `06-chats-ia-06` assistant-ui modal (adaptar) e `06-chats-ia-11` CopilotKit popup (referência): servem para ajuda pontual, não para trabalho lado a lado. O popup fecha com Escape; o modal não fecha.

Direção prática: montar o painel com o thread de `06-chats-ia-04` (React) ou `06-chats-ia-13` (Vue) dentro de um painel do próprio shell, seguindo a orientação da Cloudscape para painel lateral (mensagens alinhadas do mesmo lado, autor por avatar e nome, compositor fixo e só o log rolando).

### Chat de página inteira

1. `06-chats-ia-01` Cloudscape (recomendado): histórico com filtro, feedback com estado de envio e motivo de desabilitado, alerta de erro com remediação, região nomeada e LiveRegion. Falta parar no código salvo.
2. `06-chats-ia-04` assistant-ui base (recomendado): todos os botões do compositor nomeados, parar, copiar, recarregar, editar, ramificação e estado de erro no código.
3. `06-chats-ia-13` Nuxt (recomendado, Vue): parar, recarregar, editar, regenerar e voto com toast de falha específico, área de soltar e 404.
4. `06-chats-ia-02` AI Elements (adaptar): peças ricas (fontes, raciocínio, ramificações), mas desabilita o enviar durante streaming sem oferecer parar e não traz ações de mensagem.
5. `06-chats-ia-03` Vercel Chatbot (referência): fluxo completo acoplado ao backend do template; StopButton sem nome.

### Ação de IA em linha

Só um candidato real: `18-arquivos-editores-08` Nuxt editor (adaptar). "Improve" aparece na barra de bolha da seleção e "Continue writing" no menu por barra, que navega por setas. Limite: a barra de bolha só existe com o editor focado (`index.vue:236-242`), então quem usa Tab perde a barra. Compositores isolados (`06-chats-ia-08`, `06-chats-ia-14`) servem para o campo, não para a ação sobre o texto.

### Upload

1. `18-arquivos-editores-07` Dice com validação (recomendado): mensagem por motivo (tipo, quantidade, tamanho), teclado documentado.
2. `18-arquivos-editores-06` Untitled UI (recomendado): lista com progresso em porcentagem, excluir, tentar de novo previsto e anel de foco de 2 px visível.
3. `06-chats-ia-16` Dice em compositor (adaptar): chips com nome, tamanho e remover; rejeição de 11 MB por toast.
4. `18-arquivos-editores-01` Kibo (adaptar): recusou TXT e PNG pequeno sem nenhuma mensagem.
5. `18-arquivos-editores-10` Cloudscape S3 (referência): escolher arquivo já armazenado, não enviar novo.

### Texto rico

1. `18-arquivos-editores-08` Nuxt editor (adaptar): bolha, menu por barra, barra fixa alcançável por Shift+Tab com anel e tooltip. Alça de arrastar sem nome.
2. `18-arquivos-editores-02` Kibo editor (adaptar): primeira carga falhou com exceção no cliente, menu de bolha não apareceu no duplo clique, botões de ícone sem nome quando `hideName`.

Nenhum dos dois tem barra fixa de formatação acessível por teclado. Para formulário de negócio, exigir essa barra.

### Feed de atividade

1. `19-colaboracao-atividade-10` Cloudscape detalhe com abas (recomendado): aba Logs com tabela paginada e busca; abas por seta com anel.
2. `19-colaboracao-atividade-06` Tabler (adaptar): frase ator, ação, objeto e tempo; lista plana de 40 eventos sem agrupamento nem filtro, e o recorte salvo não inclui o componente do feed.
3. `19-colaboracao-atividade-03` Nuxt notificações (adaptar): tempo em `<time datetime>`, sem marcar como lida.

### Comentários

Nenhum item do lote implementa thread de comentários (resposta aninhada, menção, resolver). O mais próximo é a resposta embutida de `19-colaboracao-atividade-02` e o cursor com mensagem de `19-colaboracao-atividade-08`. É lacuna do acervo; precisa de sourcing próprio.

## Anti-padrões observados

- Enviar desabilitado durante streaming sem botão de parar (`06-chats-ia-02`, `chatbot.tsx:580-583`).
- Parar, enviar e ações de mensagem só com ícone e sem nome acessível (`06-chats-ia-03` StopButton, `06-chats-ia-07`, `06-chats-ia-10`, `06-chats-ia-12`). O mesmo vale para ícones de detalhe e lista (`19-colaboracao-atividade-02`, `19-colaboracao-atividade-05`) e alça de editor (`18-arquivos-editores-08`).
- Ações de mensagem com `opacity-0` até hover ou foco no grupo (`06-chats-ia-07`). A Cloudscape orienta ações persistentes na resposta.
- Arquivo recusado sem mensagem na tela: `onError={console.error}` (`18-arquivos-editores-01`) e `console.log` (`18-arquivos-editores-06`).
- Erro de upload só em toast temporário, sem texto junto do campo (`06-chats-ia-16`, `18-arquivos-editores-07`).
- Barra de formatação que só existe enquanto o editor tem foco, sem barra fixa equivalente (`18-arquivos-editores-08`).
- Árvore sem `role=tree` e sem teclado: Enter e setas não fazem nada (`18-arquivos-editores-04`).
- Diferença de código só por cor de fundo (`18-arquivos-editores-05`).
- Não lida só por peso, ponto ou cor (`19-colaboracao-atividade-01`, `-03`, `-06`).
- Busca que monta `new RegExp` com o texto digitado (`19-colaboracao-atividade-04`, `members.vue:10`).
- Painel ou modal de chat que não fecha com Escape (`06-chats-ia-06`, `06-chats-ia-10`).
- Recurso de UI com checagem de licença dentro de pacote MIT (`06-chats-ia-10`, `06-chats-ia-11`).
- Clone de marca como estilo (`06-chats-ia-07`, `06-chats-ia-09`).
- Recorte que guarda só o invólucro e deixa a lógica fora do ZIP (`06-chats-ia-05`, `-06`, `-10`, `-11`, `19-colaboracao-atividade-06`).

## Regras de seleção para uma skill de design

1. Chat com resposta em streaming só entra se tiver botão de parar nomeado ("Parar geração" ou equivalente) no lugar do enviar, habilitado durante o streaming. Enviar desabilitado sem parar reprova.
2. Todo botão só de ícone no compositor, na mensagem, no painel e no detalhe precisa de `aria-label` ou texto `sr-only`. Tooltip sozinho não conta. Verificar com contagem de botões sem nome na página igual a zero no componente.
3. Ações de resposta (copiar, refazer, feedback) ficam visíveis sem hover. Edição de mensagem do usuário cancela com Escape.
4. A lista de mensagens tem região nomeada e anúncio de nova resposta (LiveRegion, `role=log` ou `aria-live="polite"`).
5. Estado de erro da resposta aparece na conversa com ação de tentar de novo; não só em toast.
6. Posição: página inteira quando a conversa é a tarefa; painel lateral fixo quando o usuário trabalha no conteúdo e na conversa ao mesmo tempo; popup ou modal só para ajuda curta. Painel e popup fecham com Escape e devolvem o foco ao lançador.
7. Em painel lateral, mensagens alinhadas do mesmo lado com autor por avatar e nome; em página inteira, alinhamento alternado com largura de balão limitada. Compositor fixo; só o log rola.
8. Upload: regra de tipo e tamanho escrita na área, mensagem por motivo de recusa exibida junto da área e mantida até a próxima ação, progresso por arquivo com porcentagem, remover e tentar de novo. Recusa sem mensagem reprova.
9. Área de soltar acessível por teclado (Enter ou Espaço abrem o seletor) ou, quando for só alvo de arrastar, um botão de anexar nomeado ao lado.
10. Editor rico em produto de negócio precisa de barra fixa alcançável por Tab com `role=toolbar`, nomes e estado ativo; barra de bolha e menu por barra são complementos.
11. Ação de IA sobre texto aparece na seleção e no menu por barra, com rótulo de verbo ("Melhorar", "Continuar") e forma de desfazer.
12. Árvore de arquivos precisa de `role=tree`, setas para mover e expandir e anel de foco visível. Preferir base headless-tree (`18-arquivos-editores-09`).
13. Feed de atividade: frase ator, ação, objeto; tempo relativo com data absoluta em `<time datetime>`; agrupamento por dia a partir de dezenas de eventos; filtro por tipo; não lida com rótulo textual além da cor.
14. Diff e status nunca só por cor: acrescentar sinal textual (+, -, "novo", "removido").
15. Rejeitar recortes que dependem de licença paga não declarada ou que guardam só o invólucro sem a lógica.
16. Não usar clone de marca de produto de IA como direção visual.

## Falhas e lacunas desta rodada

- `18-arquivos-editores-02`: primeira carga com "Application error" no cliente; a segunda carga funcionou. O texto da falha está em `paginas/18-arquivos-editores-02.txt`.
- `06-chats-ia-15`: sem captura; as fontes só aparecem depois de resposta com busca.
- `19-colaboracao-atividade-09`: o componente não renderiza sem sala; a captura mostra o cabeçalho sem ele.
- `19-colaboracao-atividade-02`: digitação na resposta bloqueada pelo banner de cookies da demo.
- `06-chats-ia-01`: itens do histórico não carregam conversa na demo publicada.
- Nenhum teste com leitor de tela nem medição de contraste nesta rodada.
