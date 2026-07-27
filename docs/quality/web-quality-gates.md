# Critérios de Qualidade da Aplicação Web

A aplicação web combina verificações rápidas de comportamento com smoke tests
em navegador real. O objetivo é proteger navegação, acessibilidade e adaptação
de layout sem depender de snapshots visuais frágeis.

## Verificação local

O caminho padrão antes de um commit é:

```bash
npm run check
```

Esse comando executa lint, Prettier, typecheck de todos os workspaces, testes de
comportamento da aplicação web e builds de produção. O build web também aplica
o orçamento estático de desempenho.

Os testes em navegador são executados separadamente porque exigem Chromium:

```bash
npm exec -w @yppon/web playwright -- install chromium
npm run test:web:e2e
```

`npm run test:web` executa somente Vitest e React Testing Library. `npm run
test` executa as suítes de todos os workspaces e, por isso, exige o PostgreSQL e
`DATABASE_URL` usados pelos testes de integração da API.

## Matriz obrigatória no CI

O job `Web quality` executa, em etapas explícitas:

1. lint do repositório;
2. verificação de formatação;
3. typecheck da aplicação web;
4. testes de comportamento com Vitest;
5. build de produção e orçamento de desempenho;
6. smoke tests Playwright em Chromium.

Os testes de navegador cobrem `/` e `/instituicoes/iugy`, funcionamento do menu
e do skip link por teclado, preferência por movimento reduzido e ausência de
overflow em 320 px, tablet de 768 px e desktop de 1440 px.

O job agregador `Check / npm run check` só fica verde quando `API quality` e
`Web quality` terminam com sucesso. Esse é o status que deve ser obrigatório na
proteção da branch `main`.

Nenhum workflow de deploy existe atualmente. Quando ele for criado, deve
publicar somente um SHA de `main` cujo `Check / npm run check` tenha passado.
Se build e deploy estiverem no mesmo workflow, o job de deploy deve declarar
`needs: required-checks`. Se estiverem em workflows diferentes, o deploy deve
ser disparado por `workflow_run` e validar `conclusion == 'success'`. O artefato
publicado deve corresponder ao mesmo SHA verificado; não é permitido reconstruir
outro commit durante o deploy.

## Orçamento inicial de desempenho

O baseline foi medido em 27 de julho de 2026 com Node.js 24 e build Vite de
produção. Os limites têm margem inicial para evolução, mas qualquer aumento
deve vir acompanhado de justificativa e atualização deste documento.

| Recurso                |  Baseline | Limite no CI |
| ---------------------- | --------: | -----------: |
| JavaScript total, gzip | 154,0 KiB |      180 KiB |
| CSS total, gzip        |  11,2 KiB |       16 KiB |
| Maior imagem publicada | 106,7 KiB |      120 KiB |

`npm run check:performance -w @yppon/web` lê os artefatos em `dist/assets` e
falha quando um desses limites é ultrapassado. O total de JavaScript inclui os
chunks lazy para impedir que crescimento seja apenas deslocado entre rotas.

Quando houver telemetria de produção suficiente, os objetivos de experiência
no percentil 75 são LCP de até 2,5 s, INP de até 200 ms e CLS de até 0,1. Esses
valores orientam revisão manual e monitoramento; não são simulados no CI atual,
pois uma medição sintética sem ambiente de rede controlado produziria um gate
instável.

## Evolução dos testes

Testes devem afirmar resultados observáveis: landmarks, nomes acessíveis, foco,
conteúdo e limites de layout. Snapshots de DOM ou imagem só devem ser
introduzidos quando houver uma necessidade visual específica e um processo
explícito de revisão das diferenças.

Novas rotas públicas precisam de smoke test, cenário de erro quando aplicável e
checagem no menor viewport suportado. Novos diálogos precisam cobrir abertura,
contenção e restauração de foco, fechamento por `Escape` e remoção da ordem de
Tab quando inativos. Animações novas precisam manter o conteúdo semântico
disponível e respeitar `prefers-reduced-motion`.
