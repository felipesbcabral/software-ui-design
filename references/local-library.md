# Acervo local de software

O acervo fica ao lado da skill, na pasta irmã `biblioteca-ui-software`, e não vai no repositório público da skill (são projetos de terceiros com licenças diferentes). O script `find-resources.mjs` procura nesta ordem: a variável `SOFTWARE_UI_LIBRARY`, uma pasta `biblioteca-ui-software` no projeto atual, a pasta irmã da skill e o caminho de [library-location.json](library-location.json). Não copie o acervo (cerca de 500 MB) para cada projeto.

## Conteúdo
- O que existe
- Onde procurar cada decisão
- Como ler uma ficha
- Limites

## O que existe

| Parte | Quantidade | Onde |
|---|---|---|
| Componentes com código arquivado, licença e commit fixo | 323 itens em 21 categorias (19 originais + `20-sobreposicoes` + `21-autenticacao`; lote C1 do Codex com Gantt, comentários e copilotos) | `<categoria>/<id>/` com `README.md`, `codigo.txt`, `metadados.json`, `componente.zip` |
| Revisão individual de cada componente | 100% do catálogo | `revisao-profunda/componentes-revisados.json` (veredito, pontos fortes, riscos, interações exercidas, notas de 1 a 5, evidência) |
| Capturas das demos em 1440 e 390 px, com estados de interação | mais de 1.000 imagens | `revisao-profunda/capturas/` e logs em `revisao-profunda/paginas/` |
| Sínteses por família com regras de seleção | 8 | copiadas nesta skill como `references/picks-*.md` |
| DESIGN.md de marcas lidos por inteiro, com hash conferido | 200 | `design-md/` e relatórios `revisao-profunda/design-md-001-100.md`, `design-md-101-200.md` |
| Adoção de design systems por empresa, com evidência primária | 27 sistemas | `revisao-profunda/ADOCAO-EMPRESAS.md` |
| Estudos | tipografia e cores, 20 design systems, matriz de 32 famílias de tela, top 10 padrões de UX, catálogos | `estudos/` |
| Paletas próprias com contraste calculado | 6 paletas, 144 pares | `estudos/paletas.json`, `estudos/CONTRASTES.md` |
| Catálogos externos de descoberta | 382 registries + 114 fontes herdadas | `catalogos/` e `references/*resources.json` desta skill |

## Onde procurar cada decisão

| Decisão | Arquivo dentro do acervo |
|---|---|
| Qual componente usar | `references/component-picks.md` desta skill, depois `find-resources.mjs --recommended` |
| Por que um componente foi aprovado ou recusado | `revisao-profunda/componentes-revisados.json` e a captura citada em `visual` |
| Padrão por família de tela | `estudos/MATRIZ-DE-TELAS.md` |
| Comparar sistemas oficiais | `estudos/ESTUDO-DESIGN-SYSTEMS.md` |
| Qual empresa usa qual sistema | `revisao-profunda/ADOCAO-EMPRESAS.md` |
| Usar um DESIGN.md de marca | `revisao-profunda/design-md-*.md` (veredito por documento) e `estudos/DESIGN-MD-E-EMPRESAS.md` |
| Cor, tipografia, tema escuro | `estudos/ESTUDO-TIPOGRAFIA-CORES.md`, `estudos/paletas.json`, `estudos/CONTRASTES.md` |
| Boas e más práticas de UX | `estudos/TOP-10-PADROES-UI-UX.md` |
| Falhas de acesso durante a pesquisa | `VERIFICACAO.md`, `catalogos/ACESSOS-LIMITADOS.md` |

DESIGN.md com veredito "recomendado" para padrões de software (8 de 200): Attio, Clerk, Excalidraw, GitHub, Grafana, Inngest, Mercury e Vercel (design-md-hub). A maioria (132 de 200) é "adaptar": aproveite o trecho citado, não o documento inteiro. Documentos comunitários de marca são reconstruções, não publicações oficiais das empresas.

## Como ler uma ficha

1. `README.md`: o que é, stack, licença, quando usar e quando não usar.
2. Registro em `componentes-revisados.json`: veredito, `fit`, `risks` e `missing_tests`. O campo `verdict_original` preserva o termo do revisor.
3. Captura em `visual`: olhe antes de decidir.
4. `codigo.txt` ou `componente.zip`: o recorte pode depender de helpers do repositório maior e de pacotes não instalados. Confira imports e licença.

## Limites

Arquivado não significa executado no seu produto. As revisões exercitaram as demos públicas, sem leitor de tela e, na maior parte, sem medição de contraste; rode `inspect-ui.mjs` na sua implementação. Origem oficial não prova popularidade. As paletas são propostas próprias, não tokens de empresas. Um 429 ou 403 durante a coleta não prova bloqueio no navegador. Sem acesso ao acervo, use as referências desta skill e fontes oficiais e registre o limite.
