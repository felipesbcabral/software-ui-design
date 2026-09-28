# Síntese R2: formulários CRUD e login

> Revisão profunda de 26/09/2026. IDs como `08-tabelas-grids-04` são fichas do acervo; caminhos `capturas/...`, `paginas/...` e `codigo.txt` são relativos a `<acervo>/revisao-profunda/` ou à pasta do item. Registros completos: `<acervo>/revisao-profunda/componentes-revisados.json`.

Revisão de 28 itens (02-formularios-crud-01 a 18, 03-logins-01 a 10) feita em 2026-09-26. Registros completos em `componentes-R2.json`; capturas em `capturas/`, registros de interação (ordem de Tab, estado de validação, ids duplicados, diálogos nativos) em `paginas/`.

Método: cada demo foi aberta em Chromium headless, com Tab registrado passo a passo (elemento focado, outline, box-shadow, `:focus-visible`), envio vazio pelo botão principal, abertura de modal e drawer e captura mobile 390x844 em todos os logins. Nenhum login foi feito com credenciais. Banners de cookie foram ocultados por CSS ou recusados ("Opt out"), nunca aceitos.

## Vereditos

| Veredito | Qtd | Itens |
|---|---|---|
| recomendado como padrão | 2 | crud-01, crud-03 |
| adaptar | 16 | crud-02, 06, 07, 08, 11, 13, 14, 15, 17; logins-01, 02, 03, 07, 08, 09, 10 |
| referência especializada | 6 | crud-04, 10, 12, 16, 18; logins-05 |
| não recomendado como direção visual padrão | 4 | crud-05, crud-09; logins-04, 06 |

Nenhum login saiu como padrão pronto: todos têm pelo menos uma falha de marcação (autocomplete, rótulo ou alternância de senha) ou de validação.

## Escolhas por subtipo

### Edição inline

1. **Mantine React Table, célula (crud-12)**. Único item do tipo. Duplo clique abre o input com o valor selecionado, validação no blur, barra inferior com Save desabilitado e "Fix errors before submitting". Adaptar antes de usar: a célula limpa fica vazia sem erro visível na linha (`capturas/02-formularios-crud-12-erro.jpg`), os botões de ícone não têm nome acessível e não há atalho de teclado para entrar em edição.

### Criação em modal

1. **shadcn-admin usuários (crud-07)**. Validação por campo, foco no primeiro erro, `aria-describedby` ligado à mensagem, senha com alternância. Corrigir: marcar obrigatórios, empilhar rótulos no mobile, trocar "Save changes" por "Criar usuário" no modo criação, incluir Cancelar e remover a altura fixa que esconde erros.
2. **Nuxt New customer (crud-13)**. Mais enxuto e com a melhor hierarquia de botões (Cancelar sutil, Create sólido). Mensagens vagas ("Too short") e foco que não vai ao erro.
3. **Material React Table (crud-11)**. Único que marca obrigatório com asterisco; perde pontos pelo `window.confirm` na exclusão.
4. **Spectrum (crud-06)**. Sem validação; só vale como referência para quem usa Spectrum.

### Edição em drawer

1. **shadcn-admin tarefas (crud-08)**. Lista visível, erros abaixo de cada grupo, rodapé fixo. Corrigir o texto "info.Click", marcar obrigatórios e pôr as ações lado a lado com a primária à direita.
2. **IBM EditSidePanel (crud-05)**. Depreciado e com rótulo duplicado; só histórico.
3. **Flowbite (crud-09)**. Ids duplicados quebram a associação dos rótulos no drawer de criação; não copiar.

### Formulário em página inteira

1. **Cloudscape criar (crud-01)**. Rótulo, descrição e restrição em níveis separados, opcional marcado, erro abaixo do campo com foco no primeiro inválido (variante `FormWithValidation`). Atenção: o `app.tsx` salvo usa `FormFull`, que não valida.
2. **Cloudscape editar (crud-02)**. Mesmo layout com o recurso no título; falta validação e aviso de saída.
3. **React Admin TabbedForm (crud-10)**. Demo atrás de login, visual não verificado.

### Várias etapas

1. **Dice stepper (crud-15)**. Valida só a etapa atual antes de avançar e mostra "Step 1 of 3". Falta estado de erro no próprio campo e foco no primeiro erro; o toast repete a mensagem.
2. **IBM CreateTearsheet (crud-04)**. Melhor layout (lista de etapas com estado à esquerda), mas depreciado e com Next desabilitado sem explicação. Usar como referência de layout.

### Confirmação de exclusão

1. **Cloudscape com confirmação digitada (crud-03)**. Quantidade, irreversibilidade, aviso de impacto e Delete desabilitado até digitar "confirm".
2. **shadcn-admin usuários (crud-07, fluxo Delete)**. Nomeia o usuário e o papel e pede digitar o username.
3. **Mantine React Table (crud-12, lixeira)**. Nomeia a pessoa, Cancel ao lado de Delete vermelho.
4. **Nuxt em lote (crud-14)**. Aceitável para baixo risco; não lista os itens e tem texto quebrado.
5. Evitar: Spectrum sem Cancelar (crud-06), `window.confirm` (crud-11), Flowbite sem nome do item e com links como ações (crud-09).

### Login

1. **Tabler (logins-09)**. Melhor marcação: `autocomplete` email e current-password, alternância de senha como `<button>` com `aria-label` e `aria-pressed`, skip link, SSO com texto abaixo de "OR". Adaptar: o form tem `novalidate` e o envio vazio navegou para o dashboard; o arquivo `SignInForm.astro` não está no ZIP.
2. **shadcn login-01 (logins-01)**. Melhor composição visual para B2B: senha primeiro, um SSO secundário logo abaixo, cadastro no rodapé. Falta autocomplete, alternância de senha e erro de credencial.
3. **shadcn login-03 (logins-03)**. Para produto em que a maioria entra por SSO.
4. **Devias (logins-10)**. Melhor tratamento de erro (mensagem abaixo do campo e Alert de servidor), mas rótulos sem associação, ícone de olho fora do teclado e credenciais de demo no código.
5. **Mantine com título (logins-08)**. Bom arranjo de "Remember me" e "Forgot password?", mas sem `<form>`.
6. Especializado: shadcn login-05 para login sem senha.
7. Evitar: shadcn login-04 (SSO só com ícone) e Mantine AuthenticationForm (logins-06, termos pré-marcados e regra de senha com erro de limite).

## Antipadrões observados

- **Link de recuperação entre email e senha na ordem de Tab**: shadcn login-01 a 04 e Tabler. A pessoa que digita email e aperta Tab cai no link, não na senha.
- **Validação só nativa**: shadcn login-01 a 05, Mantine login-06 e 08, Flowbite. O balão do navegador some, não fica na tela e não segue o estilo do produto.
- **Formulário de login sem `<form>`**: Mantine login-07 e 08 (`forms=0`). Enter não envia e o gerenciador de senhas perde contexto.
- **Alternância de senha inacessível**: Mantine (`tabIndex=-1`) e Devias (SVG com `onClick`, sem botão). Só Tabler, Untitled UI e shadcn-admin expõem botão nomeado na ordem de Tab.
- **Rótulo sem associação**: Devias (InputLabel sem `htmlFor`), Flowbite (ids duplicados), React Admin (`RichTextInput label=""`).
- **Botão primário desabilitado sem explicação**: IBM CreateTearsheet (Next) e EditSidePanel (Save). Aceitável só na confirmação digitada, onde a regra está escrita ao lado.
- **Obrigatório sem marca**: shadcn-admin, Nuxt, Dice, IBM EditSidePanel, Flowbite. Cloudscape e IBM Tearsheet resolvem marcando o opcional; MRT, Mantine e Untitled marcam o obrigatório com asterisco.
- **Mensagem de erro que não descreve o problema**: "Too short" para campo vazio (Nuxt), "must be at least 2 characters" para campo vazio (Dice).
- **Placeholder no lugar de dado**: Mantine pinta o placeholder de vermelho no erro e ele parece valor digitado; Nuxt coloca o placeholder no wrapper e ele não aparece.
- **Consentimento pré-marcado**: Mantine AuthenticationForm (`terms: true`).
- **Diálogo destrutivo sem saída explícita**: Spectrum AlertDialog sem Cancelar; MRT com `window.confirm`.
- **Credenciais de demonstração no código**: Devias (`defaultValues` e Alert com a senha).
- **Componente depreciado no acervo**: IBM CreateTearsheet e EditSidePanel já estavam em "Deprecated" no commit salvo.

## Regras de seleção para uma skill de design

1. **Escolha do contêiner pelo tamanho da tarefa.** Até 5 campos sem dependência entre eles: modal. Edição de registro que precisa manter a lista à vista: drawer lateral. Mais de 8 campos ou seções com ajuda: página inteira. Mais de 3 grupos com ordem natural ou validação cara por grupo: etapas. Correção pontual em muitas linhas: edição inline na grade.
2. **Rótulo sempre persistente, acima do campo.** Rótulo lateral só em desktop com formulário curto e deve empilhar abaixo de 480 px. Placeholder nunca substitui rótulo nem exemplo obrigatório.
3. **Marcar a minoria.** Se a maior parte dos campos é obrigatória, marcar os opcionais com "(opcional)"; se a maior parte é opcional, marcar os obrigatórios com asterisco e legenda. Nunca deixar sem marca.
4. **Erro abaixo do campo, em texto que diz o que fazer**, com borda do campo em estado de erro, `aria-invalid` e `aria-describedby` apontando para a mensagem. No envio, mover o foco para o primeiro campo inválido. Resumo no topo só em formulário longo, somado ao erro por campo.
5. **Não depender da validação nativa do navegador.** Usar `noValidate` com validação própria, mas nunca `novalidate` sem validação.
6. **Hierarquia de botões.** Uma ação primária por contêiner, nomeada pelo resultado ("Criar cliente", "Salvar alterações"), à direita; Cancelar como secundário ou link à esquerda dela. Em mobile, primária em largura total e por último na ordem visual só se ficar acima da dobra.
7. **Botão desabilitado precisa de motivo visível.** Preferir deixar habilitado e mostrar o erro ao clicar; desabilitar só quando a regra está escrita ao lado (confirmação digitada).
8. **Exclusão proporcional ao risco.** Baixo risco com desfazer: sem modal, com toast de desfazer. Irreversível: modal que nomeia o item ou a quantidade, diz que não há desfazer, tem Cancelar e ação destrutiva em cor de perigo. Irreversível com dependências ou em lote grande: pedir para digitar o nome do recurso. Nunca `window.confirm`.
9. **Login com senha.** `<form>` real, `autocomplete="username"` ou `"email"` e `"current-password"`, alternância de senha como `<button type="button">` com `aria-label` e `aria-pressed` na ordem de Tab, link de recuperação depois do campo de senha na ordem de Tab, erro de credencial em alerta acima do botão, botão com estado de carregamento.
10. **SSO.** Em B2B com senha como caminho principal, SSO abaixo do botão de entrar, separado por "ou", com texto e marca. Em produto com maioria SSO, SSO primeiro. Nunca só ícone.
11. **Consentimento nunca pré-marcado**; termos exibidos como texto quando o próprio envio implica aceite.
12. **Foco visível de pelo menos 2 px com contraste**, não só troca de cor da borda de 1 px (falha observada em Mantine e Spectrum).
13. **Recusar item depreciado ou com ids duplicados** como fonte de código, mesmo com visual bom; usar só como referência de layout.

## Falhas e limites

- React Admin (crud-10): demo exige login; não foi feito login, então não há captura do formulário.
- Kibo (crud-18): o exemplo "Create new items" não renderizou no headless (numa carga, "Application error: a client-side exception"; na outra, nenhum combobox); a criação não foi exercitada.
- Tabler (logins-09): o clique em Sign in vazio navegou para o dashboard por causa do `novalidate`; nenhum dado foi enviado.
- Mantine login-06: para ver o estado de erro do Mantine, o atributo `required` foi removido por script antes do envio vazio.
- Devias (logins-10): os campos pré-preenchidos com a credencial de demo foram esvaziados antes do clique, para não autenticar.
- A demo online do Mantine React Table diverge do código salvo (campo First Name com `type=email`).
- Contraste não foi medido; notas de acessibilidade vêm de teclado, atributos ARIA e inspeção visual.
