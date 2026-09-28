# Escolha rápida de componentes

Primeira escolha de cada necessidade, vinda da revisão profunda de 26/09/2026. Cada item teve código lido, demo capturada em 1440 e 390 px e interação exercida. Antes de integrar, abra a ficha, a captura e o código com `node scripts/find-resources.mjs --saved <termo>`. Os detalhes, riscos e regras de cada linha estão no arquivo `picks-*.md` indicado.

A coluna "Primeira escolha" já considera o defeito que precisa ser corrigido: leia a coluna "Corrigir" antes de copiar.

## Conteúdo
- Navegação e shell
- Tabelas, listas e busca
- Formulários, exclusão e login
- Sobreposições
- Datas, agenda, quadros e gráficos
- Estados, loading e feedback
- IA, arquivos e colaboração
- Lacunas conhecidas

## Navegação e shell ([picks-menus-configuracoes-dashboards.md](picks-menus-configuracoes-dashboards.md))

| Necessidade | Primeira escolha | Alternativa | Corrigir | Evitar |
|---|---|---|---|---|
| Sidebar expandida | `04-menus-laterais-15` Untitled com seções | `04-menus-laterais-03` Cloudscape SideNavigation (console) | Nada crítico | Lista plana sem grupos |
| Sidebar recolhível (rail) | `04-menus-laterais-10` shadcn sidebar-07 | `05-menus-superiores-13` Nuxt | Grupos com filhos precisam de popover no rail | `09-dashboards-07` CoreUI e `04-menus-laterais-08` Mantine (tooltip só no hover) |
| Barra superior | `05-menus-superiores-01` Cloudscape TopNavigation | `05-menus-superiores-03` Primer PageHeader (cabeçalho de página) | O arquivo salvo só tem identidade; utilities vêm da demo | `05-menus-superiores-06` mega menu, `05-menus-superiores-07` HeaderTabs |
| Configurações até 5 seções | `07-configuracoes-conta-11` Nuxt abas por rota | | | Diálogo de configurações `07-configuracoes-conta-10` |
| Configurações 5 a 10 seções | `07-configuracoes-conta-07` shadcn-admin navegação local | | Select no celular já existe | `07-configuracoes-conta-01` Tabler com itens de 60 px |
| Dashboard operacional | `09-dashboards-01` Cloudscape | | Eixo "2k" duplicado; popover que abre sozinho | Cards saturados sem semântica |
| Dashboard SaaS geral | `09-dashboards-03` shadcn dashboard-01 | `09-dashboards-02` Cloudscape configurável | Menos KPIs no celular | AdminLTE, Volt |

## Tabelas, listas e busca ([picks-tabelas-busca-filtros.md](picks-tabelas-busca-filtros.md))

| Necessidade | Primeira escolha | Alternativa | Corrigir | Evitar |
|---|---|---|---|---|
| Tabela simples | `08-tabelas-grids-05` Primer DataTable | `08-tabelas-grids-14` Untitled (entidades com avatar) | Experimental no Storybook | |
| Grade operacional densa | `08-tabelas-grids-04` Cloudscape Table | `08-tabelas-grids-10` shadcn-admin tasks (stack Tailwind) | shadcn: `aria-sort` e "Page 1 of 0" | `08-tabelas-grids-07`, `08-tabelas-grids-15` |
| Grade editável | `08-tabelas-grids-17` Cloudscape inline edit | `02-formularios-crud-12` MRT célula | | |
| Grande volume | `08-tabelas-grids-18` Cloudscape paginação no servidor | `08-tabelas-grids-16` ReUI virtualizado | Descartar respostas antigas; `aria-rowcount` | |
| Barra de filtro | Cloudscape TextFilter (`08-tabelas-grids-04`) | shadcn-admin toolbar | | `10-busca-filtros-comandos-10` HyperUI (não fecha) |
| Filtros facetados | `10-busca-filtros-comandos-01` Cloudscape property filter | shadcn-admin facetas | | `10-busca-filtros-comandos-02` (depreciado) |
| Filtros salvos | `10-busca-filtros-comandos-16` Cloudscape | | | |
| Command palette | `10-busca-filtros-comandos-08` shadcn CommandDialog | `10-busca-filtros-comandos-07` cmdk Raycast (submenu) | Rótulo do atalho por sistema | Atalho só com Cmd |
| Busca global | `10-busca-filtros-comandos-09` shadcn-admin | `10-busca-filtros-comandos-04` Spectrum SearchField | Ranquear pelo título | |
| Gantt / cronograma | `16-quadros-cronogramas-17` SVAR React Gantt (core MIT) ou `16-quadros-cronogramas-15` Roadline (roadmap) | `16-quadros-cronogramas-11` Frappe Gantt (compacto) | Planejar a vista móvel à parte: em 390 px a linha do tempo some ou exige rolagem lateral; recursos PRO do SVAR não fazem parte do core MIT | `16-quadros-cronogramas-14` jsGanttImproved, `16-quadros-cronogramas-02` Kibo |
| Kanban | `16-quadros-cronogramas-07` ReUI | `16-quadros-cronogramas-05` Dice | Largura mínima de coluna; teclado | `16-quadros-cronogramas-09` Tabler |

## Formulários, exclusão e login ([picks-formularios-login.md](picks-formularios-login.md), autenticação completa em [picks-autenticacao.md](picks-autenticacao.md))

| Necessidade | Primeira escolha | Alternativa | Corrigir | Evitar |
|---|---|---|---|---|
| Formulário em página | `02-formularios-crud-01` Cloudscape criar | `02-formularios-crud-02` Cloudscape editar | Usar a variante `FormWithValidation` | |
| Criar em modal | `02-formularios-crud-07` shadcn-admin | `02-formularios-crud-13` Nuxt | Marcar obrigatórios; botão "Criar usuário" | |
| Editar em drawer | `02-formularios-crud-08` shadcn-admin | | Ações lado a lado | `02-formularios-crud-09` Flowbite (ids duplicados) |
| Várias etapas | `02-formularios-crud-15` Dice stepper | `15-fluxos-essenciais-05` wizard | Erro no campo e foco | |
| Exclusão irreversível | `02-formularios-crud-03` Cloudscape confirmação digitada | `02-formularios-crud-07` fluxo Delete | | `window.confirm`, diálogo sem Cancelar |
| Login | Tela dividida como `21-autenticacao-02`, com a marcação de `03-logins-09` Tabler; cartão de `03-logins-01` só em ferramenta interna | `03-logins-03` shadcn (maioria SSO) | Tirar `novalidate` sem validação; link de recuperação depois da senha no Tab | `03-logins-04`, `03-logins-06` |
| Aviso de saída sem salvar | `15-fluxos-essenciais-06` | | | |
| Cadastro | Layout de `21-autenticacao-02` (tela dividida, padrão em SaaS) com a marcação de `21-autenticacao-05` Tabler (autocomplete e medidor) | `21-autenticacao-03` só e-mail + provedores, `21-autenticacao-07` etapas, `21-autenticacao-01` cartão (ferramenta interna) | `novalidate` do Tabler sem validação própria | Termos pré-marcados |
| Esqueci a senha | `21-autenticacao-11` Supabase (resposta neutra) com layout de `21-autenticacao-10` Mantine UI | | Não revelar se a conta existe | `21-autenticacao-08` promete enviar a senha por e-mail |
| Redefinir senha | `21-autenticacao-12` Better Auth UI | | Regra por comprimento e lista de bloqueio | Regras de composição (`21-autenticacao-13`), `21-autenticacao-14` |
| Mostrar senha | `21-autenticacao-16` GOV.UK | | | Ícone fora do Tab |
| Código OTP / 2FA | `21-autenticacao-17` GOV.UK (campo único) | `21-autenticacao-18` Tabler ou `21-autenticacao-19` shadcn (caixas) | Colar código precisa funcionar | Bloquear colar |
| Verificar e-mail / link enviado | `21-autenticacao-22` Better Auth UI | `21-autenticacao-21` Auth.js | Reenvio com espera visível | |
| Convite e workspace | `21-autenticacao-23` convite, `21-autenticacao-24` criar workspace | | | |
| Sessão expirada | `21-autenticacao-25` Tabler | | | `21-autenticacao-26` Flowbite |
| Segurança da conta | `21-autenticacao-27` + `21-autenticacao-28` sessões + `21-autenticacao-29` passkeys | | 2FA TOTP só em código no 27 | |

## Sobreposições ([picks-sobreposicoes.md](picks-sobreposicoes.md))

| Necessidade | Primeira escolha | Alternativa | Corrigir | Evitar |
|---|---|---|---|---|
| Tooltip | `20-sobreposicoes-02` React Aria (referência de teclado) | `20-sobreposicoes-01` shadcn/Radix, `20-sobreposicoes-03` Primer | shadcn Provider abre com 0 ms: defina atraso | Tooltip v1 do Primer (`15-fluxos-essenciais-10`) |
| Dica com link (toggletip) | `20-sobreposicoes-06` Carbon | `20-sobreposicoes-07` Fluent InfoLabel | | Link dentro de tooltip |
| Popover | `20-sobreposicoes-08` shadcn com campos | `20-sobreposicoes-10` Cloudscape, `20-sobreposicoes-25` Mantine aninhado | Mantine: Escape fecha as duas camadas | |
| Hover card | `20-sobreposicoes-11` shadcn | | | `20-sobreposicoes-12` Mantine HoverCard (não abre no foco) |
| Menu de ações e de contexto | `20-sobreposicoes-13` shadcn dropdown, `20-sobreposicoes-15` context menu | `20-sobreposicoes-14` Headless UI | Foco volta ao body após Escape no context menu; atalhos ⌘ fixos | |
| Modal | `20-sobreposicoes-17` shadcn Dialog | `20-sobreposicoes-16` Headless UI | | Modal sobre modal |
| Confirmação destrutiva | `20-sobreposicoes-18` shadcn AlertDialog | `20-sobreposicoes-19` Carbon modal de perigo | Foco inicial no Cancelar já é o padrão | |
| Drawer | `20-sobreposicoes-20` shadcn Sheet | `20-sobreposicoes-21` Fluent OverlayDrawer | | |
| Tour de novidade | `20-sobreposicoes-22` Ark UI Tour | `20-sobreposicoes-23` Fluent TeachingPopover | `20-sobreposicoes-24` driver.js sem anel de foco | Tour longo antes do uso |

## Datas, agenda, quadros e gráficos ([picks-calendarios-quadros-graficos.md](picks-calendarios-quadros-graficos.md))

| Necessidade | Primeira escolha | Alternativa | Corrigir | Evitar |
|---|---|---|---|---|
| Data em formulário | `01-calendarios-04` Cloudscape DatePicker | | | Calendário inline como único meio |
| Intervalo em formulário | `01-calendarios-02` Carbon DatePicker range | | | |
| Período de relatório | `01-calendarios-15` Untitled DateRangePicker | | Cancel precisa restaurar o valor | Presets de datas futuras (`01-calendarios-12`) |
| Agenda de eventos | `01-calendarios-07` Schedule-X | `01-calendarios-10` FullCalendar (recursos pagos) | | `01-calendarios-09` TOAST UI, `01-calendarios-13` Kibo |
| Histórico de etapas | `16-quadros-cronogramas-08` ReUI Timeline | | | Timeline como cronograma |
| Tendência, comparação, volume | Tremor Line (`17-graficos-analiticos-03`), Bar (`-02`), Area (`-01`) | | Formatter do locale | Pizza e radar (`-09`, `-10`) |
| Ranking | `17-graficos-analiticos-05` Tremor BarList | | Linhas focáveis se clicáveis | |

## Estados, loading e feedback ([picks-icones-loading-feedback.md](picks-icones-loading-feedback.md))

| Necessidade | Primeira escolha | Alternativa | Corrigir | Evitar |
|---|---|---|---|---|
| Conjunto de ícones | `11-icones-05` Lucide | `11-icones-01` Fluent (em Fluent UI), `11-icones-07` Tabler (nunca junto do Lucide) | | Feather (parado), Material Symbols sem subset |
| Salvar ou enviar | `12-loading-progresso-03` Carbon InlineLoading | shadcn botão (`-10`) | `aria-live` polite | `disabled` que tira o foco |
| Progresso medido | `12-loading-progresso-07` Cloudscape ProgressBar | `12-loading-progresso-02` Fluent | | Porcentagem inventada |
| Skeleton de tabela | `13-skeletons-02` Carbon DataTableSkeleton | `13-skeletons-01` Fluent (único com `aria-busy`) | Movimento reduzido nos shadcn | `13-skeletons-08` shadcn tabela |
| Aviso global | `14-feedback-estados-03` Cloudscape Flashbar | | | Toast como único aviso de erro |
| Aviso de seção | `14-feedback-estados-02` Cloudscape Alert | `14-feedback-estados-04` Carbon InlineNotification | | |
| Status de recurso | `14-feedback-estados-01` Cloudscape StatusIndicator | | | Ponto de cor sem texto |
| Estado vazio | `14-feedback-estados-06` Primer Blankslate | `14-feedback-estados-10` shadcn Empty | | `14-feedback-estados-07` Primer Flash (obsoleto) |

## IA, arquivos e colaboração ([picks-chat-ia-arquivos-colaboracao.md](picks-chat-ia-arquivos-colaboracao.md), lote C1 em [picks-cronogramas-comentarios-copiloto.md](picks-cronogramas-comentarios-copiloto.md))

| Necessidade | Primeira escolha | Alternativa | Corrigir | Evitar |
|---|---|---|---|---|
| Chat de página inteira | `06-chats-ia-04` assistant-ui (React) | `06-chats-ia-01` Cloudscape, `06-chats-ia-13` Nuxt (Vue) | Botão de parar no Cloudscape salvo | Enviar desabilitado sem parar (`06-chats-ia-02`) |
| Copiloto lateral | Thread de `06-chats-ia-04` num painel do shell | `06-chats-ia-12` Tambo | Nome no botão enviar | CopilotKit sem licença paga |
| Upload | `18-arquivos-editores-07` Dice com validação | `18-arquivos-editores-06` Untitled | | Recusa de arquivo sem mensagem |
| Árvore de arquivos | `18-arquivos-editores-09` ReUI tree | | | Kibo tree sem semântica |
| Texto rico | `18-arquivos-editores-08` Nuxt editor | | Barra fixa alcançável por teclado | |
| Thread de comentários (resposta, @menção, resolver) | `19-colaboracao-atividade-11` Motiq Comment Thread | `19-colaboracao-atividade-12` Motiq Review Workspace (com aprovação e feed), `19-colaboracao-atividade-13` Liveblocks Comments | Persistência, permissões e moderação ficam com a aplicação | Comentário sem estado de envio e erro |
| Copiloto operacional com etapas e fontes | `06-chats-ia-20` Motiq AI Agent Workspace | `06-chats-ia-17` SidekickCN | SidekickCN: painel de 420 px corta 30 px em 390 px | `06-chats-ia-19` InAppAI como visual final |
| Atividade e logs | `19-colaboracao-atividade-10` Cloudscape detalhe com abas | `19-colaboracao-atividade-06` Tabler | | Feed plano sem filtro |

## Lacunas conhecidas

- **Gantt/cronograma:** 7 candidatos desde o lote C1, nenhum recomendado como padrão; nenhum resolve bem o celular. Veja [picks-cronogramas-comentarios-copiloto.md](picks-cronogramas-comentarios-copiloto.md).
- **Copiloto lateral:** candidatos no lote C1 (`06-chats-ia-20` é o mais completo); Anter (`06-chats-ia-18`) e AgenticKit (`06-chats-ia-21`) ainda sem preview validado.
- **UI otimista:** sem componente; siga a regra da tabela de espera em `picks-icones-loading-feedback.md`.
