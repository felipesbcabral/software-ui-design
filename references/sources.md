# Fontes e decisões de adaptação

Consulta realizada em 26/09/2026. Este arquivo registra procedência; não é uma lista de skills obrigatórias nem uma garantia de qualidade dos projetos citados.

## Base local

O catálogo resources.json foi preservado integralmente da web-design-craft 3.1.1, cópia web-design-craft-3.1.1-20260924. São 114 entradas com URLs, metadados e ressalvas históricas. Sua licença está em [web-design-craft-LICENSE.txt](web-design-craft-LICENSE.txt). Componentes e assets externos mantêm suas próprias licenças.

A nova skill aproveita o método de pesquisar, inspecionar, adaptar, renderizar e verificar. Os verificadores da skill original não foram copiados. Regras de estética de sites comerciais, quotas de catálogos, narrativas de rolagem e bloqueios universais de fontes/cores foram substituídos por critérios de software.

Foram consultadas as cópias locais de design-taste-frontend, impeccable 4.2.3 e ui-ux-pro-max. Em Impeccable, o módulo Operate separa familiaridade e trabalho de expressão de marca. A Taste consultada se declara voltada a landing pages e portfólios. A UI UX Pro Max local contém especializações para React Native, que não foram adotadas como regra geral.

## Skills pesquisadas na internet

| Fonte primária | Contribuição selecionada | Limite observado |
|---|---|---|
| [Interface Design, Dammyjay93](https://github.com/Dammyjay93/interface-design/blob/main/.claude/skills/interface-design/SKILL.md) | Hierarquia como decisão explícita, comparação renderizada e reuso do sistema existente | Não importar prescrições de mesma cor para sidebar/canvas, assinatura obrigatória, nomes temáticos de tokens ou medidas de acessibilidade sem conferência |
| [Web Interface Design, ratacat](https://github.com/ratacat/claude-skills/blob/main/skills/web-interface-design/SKILL.md) | Organização por família de controle e revisão de ações, rótulos e leitura | Não importar cores fixas de tema escuro nem confundir px e pt nos limiares de contraste |
| [Frontend Design Deslop, samber](https://github.com/samber/cc-skills/blob/main/skills/frontend-design-deslop/SKILL.md) | Distinguir o tipo de artefato e revisar layout, componentes e estados além dos tokens | Não exigir descoberta de marca completa para corrigir um controle |
| [Dashboard Craft, giorgio-a11y](https://github.com/giorgio-a11y/dashboard-craft/blob/main/SKILL.md) | Referências de organização de painéis e escolha de densidade | React/Tailwind, fontes, cinzas e translucidez prescritos não viram defaults do pacote |
| [UI UX Pro Max, nextlevelbuilder](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Pesquisa por domínio como apoio à escolha | Conferir a versão e o escopo da cópia instalada; saída gerada é candidata, não decisão automática |

Essa comparação é qualitativa, baseada nos textos consultados. Não foi executado um benchmark visual entre essas skills. Nenhum pacote remoto foi instalado ou executado; orientações foram sintetizadas, sem redistribuir seus arquivos.

## Documentação de comportamento e componentes

| Fonte | Uso |
|---|---|
| [WAI ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/) | Conferir modelos de interação e semântica de combobox, dialog, table, grid e navegação |
| [Carbon Data Table](https://carbondesignsystem.com/components/data-table/usage/) | Referência de tabela com busca, ações e distribuição de espaço; não exige instalar Carbon |
| [FullCalendar](https://fullcalendar.io/docs) | Candidato de agenda; verificar recursos, integração e licença do módulo necessário |
| [React Aria DatePicker](https://react-aria.adobe.com/DatePicker) | Candidato para entrada de data acessível em React; verificar compatibilidade antes de usar |
| [WCAG: contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Critérios de contraste e definição de texto grande |
| [WCAG: contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Indicadores e componentes visuais necessários |
| [WCAG: alvo mínimo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Mínimo AA e exceções, separado de recomendação de conforto |
| [WCAG: reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Adaptação com zoom e exceções para informação bidimensional |

Abra a documentação atual do componente antes de adotá-lo. O catálogo original não foi revalidado inteiro nesta criação. A inspeção de uma documentação não prova que seu componente foi testado dentro do produto.

## Leis de UX

Consulta realizada em 28/09/2026 para [ux-laws.md](ux-laws.md). As definições seguem a Laws of UX; onde a pesquisa posterior contradiz a formulação popular, vale a pesquisa.

| Fonte | Uso |
|---|---|
| [Laws of UX, Jon Yablonski](https://lawsofux.com/) | Definições e origem de Fitts, Hick, Jakob, Von Restorff, Goal gradient, Zeigarnik e Miller; aviso contra usar 7 ± 2 como limite de design |
| [NN/g: Fitts's Law and Its Applications in UX](https://www.nngroup.com/articles/fitts-law/) | Distância, tamanho, rótulo junto do ícone, borda da tela só no desktop com mouse (Avrahami, 2015) |
| [NN/g: Hick's Law, Designing Long Menu Lists](https://www.nngroup.com/videos/hicks-law-long-menus/) | Procurar item conhecido numa lista é varredura linear, fora do alcance da lei |
| [NN/g: End of Web Design (22/07/2000)](https://www.nngroup.com/articles/end-of-web-design/) | Formulação original da lei de Jakob |
| [Kivetz, Urminsky e Zheng (2006)](https://home.uchicago.edu/ourminsky/Goal-Gradient_Illusionary_Goal_Progress.pdf) | Cartão de 12 selos com 2 carimbados contra cartão de 10 vazio |
| [Ghibellini e Meier (2025)](https://www.nature.com/articles/s41599-025-05000-w) | Meta-análise de 59 estudos: sem vantagem de memória para tarefa interrompida (razão 0,99); tendência de retomar confirmada |
| [Cowan (2001)](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/44023F1147D4A1D44BDC0AD226838496/S0140525X01003922a.pdf/the-magical-number-4-in-short-term-memory-a-reconsideration-of-mental-storage-capacity.pdf) | Capacidade de cerca de 4 blocos, revisão do 7 ± 2 de Miller (1956) |
