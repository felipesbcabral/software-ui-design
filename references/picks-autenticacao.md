# Síntese N2: telas de autenticação (categoria 21-autenticacao)

> Revisão profunda de 26/09/2026. IDs como `21-autenticacao-12` são fichas do acervo; caminhos `capturas/...` e `paginas/...` são relativos a `<acervo>/revisao-profunda/`. Registros completos: `<acervo>/revisao-profunda/componentes-revisados.json`.

Escopo: 29 itens novos em `21-autenticacao/` (ids `21-autenticacao-01` a `-29`), com código salvo de commits fixados e revisão em `revisao-profunda/componentes-N2.json`. Cada item foi aberto no Chromium headless em 1440x900 e 390x844, percorrido com Tab, enviado vazio quando havia formulário e, quando havia senha, preenchido e alternado para texto. Os registros de cada interação estão em `revisao-profunda/paginas/21-autenticacao-NN.txt` e as capturas em `revisao-profunda/capturas/`.

Não duplica `03-logins` (login) nem `07-configuracoes-conta` (perfil, notificações, senha do Nuxt).

## Mapa dos itens

| Tela | Itens | Melhor base observada |
|---|---|---|
| Cadastro em cartão | 01 shadcn signup-01, 04 Flowbite, 05 Tabler | 05 (autocomplete e medidor), 01 como layout |
| Cadastro em tela dividida | 02 shadcn signup-02 | 02, só com arte aprovada |
| Cadastro só com e-mail e provedores | 03 shadcn signup-05 | 03 |
| Provedores primeiro (SSO) | 06 Auth.js signin | referência de ordem, não de layout |
| Cadastro em etapas | 07 Mantine Stepper | 07 |
| Esqueci a senha | 08 Tabler, 09 Flowbite, 10 Mantine UI, 11 Supabase | 11 pela resposta neutra, 10 pelo layout |
| Redefinir senha com força | 12 Better Auth UI, 13 Mantine UI, 14 Flowbite, 15 Supabase | 12 |
| Mostrar senha | 16 GOV.UK password input | 16 |
| Código OTP e 2FA | 17 GOV.UK, 18 Tabler, 19 shadcn input-otp, 20 Tabler (cadastro do telefone) | 17 (campo único), 18 ou 19 (caixas) |
| Link enviado e verificação de e-mail | 21 Auth.js verify-request, 22 Better Auth UI | 22 com e-mail salvo |
| Aceitar convite | 23 Better Auth UI | 23 |
| Criar workspace após cadastro | 24 Better Auth UI | 24 |
| Sessão expirada e reautenticação | 25 Tabler, 26 Flowbite | 25 |
| Segurança da conta | 27 Better Auth UI (senha, contas, sessões, 2FA em código), 28 sessões, 29 passkeys | 27 + 28 + 29 |

Vereditos: 7 recomendados como padrão (12, 16, 17, 24, 27, 28, 29), 18 para adaptar, 2 referências especializadas (06, 21), 2 não recomendados como direção visual padrão (14, 26).

## Regras

### 1. Declare autocomplete em todo campo de credencial

- E-mail ou usuário no login: `autocomplete="username"` (ou `email`). Senha no login e na reautenticação: `current-password`. Senha nova no cadastro, na redefinição e na troca: `new-password`. Código de verificação: `one-time-code` com `inputmode="numeric"`. Telefone: `tel`; país: `country-name`.
- Para passkey com interface condicional, o campo de usuário recebe `autocomplete="username webauthn"`, como o Auth.js gera (item 06, DOM observado).
- Em campos de senha, acrescente `spellcheck="false"` e `autocapitalize="none"` (GOV.UK password input, template.njk:88; o GOV.UK explica o risco de corretor ortográfico enviar o texto a terceiros).
- Evidência de lacuna: 10 itens não declaram autocomplete nos campos de credencial (01, 02, 03, 04, 09, 10, 11, 14, 15, 26) e dois usam `autocomplete="off"` na senha (07, 13). Os itens que acertam: 05, 08, 12, 16, 17, 18, 19, 20, 25, 27.
- Fontes: GOV.UK password input (current-password e new-password), web.dev sign-up form best practices (new-password, email, username), GOV.UK confirm a phone number (one-time-code, inputmode numeric).

### 2. Código OTP: um input real, cola permitida, formato tolerante

- Use um campo único curto (GOV.UK, item 17) ou caixas visuais que escondem um input real com `maxlength` (Tabler OtpInput.astro:36 e otp-input.ts:227-228; shadcn input-otp, item 19). Colar `123456` funcionou nos três casos (capturas `-colar`).
- Aceite espaços e hífens e remova antes de validar (GOV.UK confirm a phone number).
- Mostre sempre o reenvio e para onde o código foi (17, 18, 19). Ofereça saída para quem perdeu o acesso ao canal (19: "I no longer have access to this email address").
- Prazo: NIST SP 800-63B 3.1.3.2 pede conclusão da autenticação fora de banda em até 10 minutos e uso único do segredo; o GOV.UK usa 15 minutos para códigos por SMS. Escolha um valor, diga ao usuário e mantenha a mesma mensagem para código expirado e incorreto quando o GOV.UK indica (código com mais de 2 horas recebe mensagem de incorreto).
- SMS é autenticador restrito no NIST SP 800-63B (3.1.3.3 e 3.2.9). O cadastro de 2FA (item 20) deve oferecer app autenticador ou passkey junto do SMS; o item 27 salva o fluxo TOTP com QR e códigos de backup (enable-two-factor-dialog.tsx:45, 76-137).
- Cuide da largura: em 390 px os seis slots do item 19 foram cortados dentro da moldura da documentação.

### 3. Mostrar senha: botão focável com rótulo que muda e anúncio

- NIST SP 800-63B 3.1.1.2 manda oferecer a opção de exibir a senha durante a digitação.
- O padrão do GOV.UK (item 16) é a referência de comportamento: botão de texto Show/Hide na ordem de Tab, `aria-label` que alterna entre "Show password" e "Hide password" (template.njk:23-28, 55) e região `aria-live` que anuncia a mudança (password-input.mjs:90). Com dois campos de senha na mesma tela, os rótulos precisam ser distintos.
- Observado: o olho do Mantine (07, 13) fica fora da ordem de Tab (percurso Password seguido de Next step); Tabler (05) e Better Auth UI (12, 27) põem o botão na ordem de Tab e trocam o rótulo; Tabler ainda marca `aria-pressed=true`.
- Com o botão de mostrar senha, dispense o campo de confirmação: a pesquisa citada no componente password input do GOV.UK concluiu que ele não é necessário. O web.dev faz a mesma recomendação para e-mail, trocando a digitação dupla por confirmação enviada. Os itens 01, 02, 04 e 14 ainda pedem confirmação.
- Não use placeholder de pontos (`••••••••`) em campo vazio: nas capturas de 04, 14 e 26 ele parece senha já preenchida.

### 4. Mensagens de erro que não revelam se a conta existe

- Login: uma mensagem só para usuário ou senha errados. OWASP Authentication Cheat Sheet sugere o equivalente a "usuário ou senha inválidos"; o GOV.UK passwords pede para não dizer qual campo estava errado; o Carbon login pattern manda esperar o envio da senha antes de acusar identificador inválido.
- Esqueci a senha: sempre a mesma resposta, com tempo de resposta uniforme (OWASP Forgot Password Cheat Sheet). Texto de referência em pt-BR: "Se existir uma conta com esse e-mail, enviamos um link para redefinir a senha." O Supabase (item 11) já faz isso no estado de sucesso (forgot-password-form.tsx:46-56), mas mostra `error.message` da API sem tratamento (linhas 39 e 82), o que pode vazar detalhe.
- Cadastro: responda "Enviamos um link de ativação para o endereço informado" também quando o e-mail já tem conta, e trate o caso por e-mail (OWASP Authentication, mensagem de criação de conta).
- Nunca envie a senha por e-mail (OWASP Forgot Password, GOV.UK passwords). A copy do Tabler (item 08, ForgotPasswordCard.astro:12) promete exatamente isso e precisa ser trocada.
- Na redefinição: não faça login automático, ofereça encerrar as outras sessões e avise o usuário da troca (OWASP Forgot Password).
- Erros de campo aparecem inline, abaixo do campo, depois de sair do campo ou de enviar (Carbon; web.dev). Nos itens 01 a 04, 09 a 11, 14, 15 e 26 o único erro é o balão nativo do navegador; itens 07, 12 e 24 mostram mensagem inline com `aria-invalid`.

### 5. Limite de tentativas: diga o que aconteceu e quando tentar de novo

- NIST SP 800-63B 3.2.2: no máximo 100 falhas consecutivas antes de desativar o autenticador, com atrasos crescentes ou desafio antirrobô como alternativas. GOV.UK passwords: 5 a 10 tentativas antes de bloquear ou exigir verificação extra. GOV.UK confirm a phone number: atraso depois de 10 códigos incorretos.
- Bloqueio por tentativas não pode impedir a recuperação de senha, e a recuperação não pode bloquear a conta (OWASP Authentication e Forgot Password).
- Na interface: botão de reenvio desabilitado com contagem regressiva, como o Better Auth UI faz em 60 s (verify-email.tsx:19-20, 98-113). Mensagem com prazo e sem confirmar a conta: "Muitas tentativas. Tente de novo em 15 minutos ou redefina a senha." Nenhum demo capturado mostra a mensagem de limite; ela precisa ser escrita.

### 6. Ordem de SSO: decida pelo caminho dominante

- Produto B2B com SSO corporativo: peça primeiro o e-mail e roteie para o IdP pelo domínio (autenticação progressiva do Carbon). Se não der para detectar, ofereça botões dos provedores.
- O Carbon desaconselha botões alternativos no topo do formulário e entre o campo e o botão primário. Os blocos shadcn (01, 02, 03) seguem essa ordem: e-mail, botão primário, divisor, provedores.
- Quando o login social é o caminho dominante, os provedores podem vir primeiro, como o Auth.js gera pela ordem da configuração e insere o divisor antes do primeiro provedor de e-mail, credenciais ou webauthn (signin.tsx:103-153). Limite a 2 ou 3 provedores: o demo do item 06 mostra mais de 30 e força rolagem longa.
- Use logos e textos conforme as diretrizes de marca de cada provedor (o Carbon aponta as do Google, GitHub e Azure).

### 7. Layout pelo peso da marca

- Marca leve ou produto interno: cartão centralizado sobre fundo neutro (01, 05, 10, 11). O Carbon indica esse layout quando o objetivo é só entrar e pede fundo sólido ou textura, sem ilustração complexa.
- Marca média ou alta com arte aprovada: tela dividida (02). O painel deve sumir abaixo do breakpoint grande, como o `hidden lg:block` do shadcn (page.tsx:23). Sem arte real, o placeholder ocupa metade da tela e pesa mais que o formulário.
- Serviço regulado ou público: página simples alinhada à esquerda, sem cartão (GOV.UK, 16 e 17).
- Em qualquer layout: região de landmark para o formulário e navegação completa por teclado (Carbon, seção Accessibility). Faixas promocionais do Tabler (05, 08, 18, 20, 25) são do preview, não do componente.

### 8. Regras de senha: comprimento e lista de bloqueio, sem composição

- NIST SP 800-63B 3.1.1.2: mínimo de 15 caracteres quando a senha é o único fator e 8 quando faz parte de MFA; aceitar pelo menos 64; não impor regras de composição; comparar com lista de senhas comuns ou vazadas; não pedir troca periódica; não usar dicas nem perguntas de segurança. O OWASP Authentication repete os números e pede para não truncar a senha em silêncio. O GOV.UK usa mínimo de 8 e nenhum máximo.
- O checklist do Mantine UI (item 13) exige número, maiúscula, minúscula e símbolo com mínimo de 6 (PasswordStrength.tsx:16-21, 70): troque por comprimento mínimo e checagem de senha vazada. O Better Auth UI já trata senha comprometida como erro do campo (reset-password.tsx:62-66, 194-196).
- Medidor de força é informativo e não substitui a regra do servidor (password-strength-meter.tsx:30-35 no item 12). Use `aria-live="polite"` no rótulo de força (linha 72) e não dependa só de cor.

### 9. Verificação de e-mail e link enviado

- A página "verifique seu e-mail" mostra o endereço de destino, instrui a clicar no link, oferece reenviar e, se o fluxo não bloqueia o uso, trocar o e-mail (GOV.UK confirm an email address).
- O link expira por prazo, por uso, quando outro link é emitido e quando o e-mail da conta muda; a página de link expirado explica o motivo e oferece novo envio (GOV.UK).
- O Auth.js (item 21) não mostra endereço, reenvio nem troca de e-mail (verify-request.tsx:24-31). O Better Auth UI (22) tem reenvio com espera, mas só quando há e-mail salvo.

### 10. Reautenticação e segurança da conta

- Peça a senha atual, ou outro fator, antes de trocar senha, e-mail, dados de pagamento ou adicionar dispositivo confiável (OWASP Authentication). O Better Auth UI trata o erro de reautenticação exigida em sessões e passkeys (active-sessions.tsx:53; add-passkey-dialog.tsx:74).
- Tempos do NIST SP 800-63B: AAL2 com reautenticação a cada 24 horas no máximo e 1 hora de inatividade; AAL3 com 12 horas e 15 minutos (seções 2.2.3 e 2.3.3).
- A tela de sessão expirada identifica a sessão (avatar e nome, itens 25 e 26), pede só o fator necessário e oferece "Não é você? Sair". Nenhum dos dois demos tem essa saída; o título "Account Locked" do Tabler (25) confunde sessão bloqueada com conta bloqueada.
- A página de segurança agrupa troca de senha, contas vinculadas, sessões com ação por dispositivo e ações em lote, passkeys com nome, renomear e excluir com confirmação, e 2FA com códigos de backup (27, 28, 29). Ações destrutivas em lote (Sign out everywhere) precisam de confirmação; a captura não mostrou nenhuma.

### 11. Convite e criação de workspace

- Convites pendentes listam organização, papel e data, com aceitar e recusar; recusar como botão de ícone precisa de `aria-label` (user-invitation-row.tsx:74-80). A página de aceite por link valida status pendente e expiração (accept-invitation.tsx:30-33).
- A criação de workspace logo após o cadastro pede nome e slug, gera o slug do nome até o usuário editar (create-organization-dialog.tsx:139-140) e marca erro no campo. Na captura com nome vazio só o slug recebeu erro: valide os dois.
- Cadastro em etapas (07) cabe quando o onboarding coleta dados que não cabem numa tela; valide só a etapa ativa (Form.demo.stepper.tsx:48-55) e mantenha a primeira etapa curta.

## Fontes consideradas e não incluídas

- Origin UI: repositório `origin-space/originui` agora sob AGPL-3.0 (GitHub API); código não salvo.
- Preline: licença dupla MIT e "Preline UI Fair Use License" no arquivo LICENSE; não incluído por causa das restrições da segunda licença.
- Clerk: `clerk/javascript` é MIT (GitHub API), mas os componentes exigem publishable key e ClerkProvider para renderizar (quickstart React da Clerk); sem demo capturável sem conta.
- Supabase Auth UI (`supabase-community/auth-ui`): arquivado (GitHub API); usado o sucessor, Supabase UI Library (itens 11 e 15).
- HyperUI: sem componentes de autenticação na árvore do repositório (só newsletter-signup).
- Primer React (`67945828`) e Cloudscape components (`1730cc9f`): nenhuma tela de login, senha ou OTP nas árvores de arquivos.
- Flowbite Blocks: licença própria separada; usei o Flowbite Admin Dashboard, que é MIT.
- shadcn OTP blocks (otp-01 a 05): não existem mais no registry new-york-v4 do commit `98a1fe67`; usado o exemplo `input-otp-form`.

## Fontes lidas

- NIST SP 800-63B (revisão 4): https://pages.nist.gov/800-63-4/sp800-63b.html (seções 2.1.3, 2.2.3, 2.3.3, 3.1.1.2, 3.1.2.2, 3.1.3.2, 3.1.3.3, 3.2.2)
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Forgot Password Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- GOV.UK passwords: https://design-system.service.gov.uk/patterns/passwords/
- GOV.UK password input: https://design-system.service.gov.uk/components/password-input/
- GOV.UK confirm a phone number: https://design-system.service.gov.uk/patterns/confirm-a-phone-number/
- GOV.UK confirm an email address: https://design-system.service.gov.uk/patterns/confirm-an-email-address/
- Carbon login pattern (fonte MDX no commit `d8783ad2` de carbon-design-system/carbon-website): https://github.com/carbon-design-system/carbon-website/blob/d8783ad2ae3b5e59c58f58311491f8a2c4e62631/src/pages/patterns/login-pattern/index.mdx
- web.dev, sign-up form best practices: https://web.dev/articles/sign-up-form-best-practices
- Clerk React quickstart: https://clerk.com/docs/quickstarts/react
- Código dos 29 itens nos commits listados em `revisao-profunda/novos-N2.json` (campos `repo`, `commit`, `source_paths`).
