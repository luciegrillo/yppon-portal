# Auditoria Organizacional do Repositório

## Estado Atual

O repositório está organizado como uma aplicação web única em React, Vite e
TypeScript. A estrutura local é coerente com o tamanho atual e segue o ADR 0001:
não há workspaces enquanto não existir um segundo pacote real.

Pontos fortes:

- arquitetura documentada em `docs/architecture`;
- separação clara entre `app`, `pages`, `components`, `hooks`, `lib`, `config` e
  `styles`;
- páginas com conteúdo local tipado;
- rotas lazy-loaded;
- commits e PRs recentes seguem Conventional Commits;
- branches remotas seguem o padrão `<type>/<issue>-<descricao>`.

## Padrões Observados

Branches:

- `fix/2-centralize-current-cycle`;
- `docs/6-architecture-decision-record`;
- `refactor/13-responsive-styles-by-domain`;
- `feat/8-routing-root-layout`;
- `feat/5-iugy-public-experience`.

Padrão recomendado:

```text
<type>/<issue>-<short-kebab-description>
```

Exemplos:

```text
chore/4-api-fastify-bootstrap
feat/3-iugy-public-data-model
test/10-iugy-quality-gates
```

PRs:

- resumo objetivo;
- verificação explícita;
- referência `Closes #...`;
- revisão com foco em acessibilidade e movimento reduzido.

## Assets

`src/assets` contém pares PNG/WebP e alguns arquivos PNG grandes:

- `yppon-flag.png`;
- `yppon-icon.png`;
- `iugy.png`;
- equivalentes WebP menores usados pela aplicação.

Hoje os imports usam principalmente WebP. Os PNGs parecem funcionar como fontes
ou alternativas, mas essa intenção não está documentada. Para evitar poluição, a
pasta deve ganhar convenção.

Recomendação:

```text
src/assets/
  brand/
    yppon/
      yppon-flag.webp
      yppon-icon-transparent.webp
      sources/
        yppon-flag.png
        yppon-icon.png
    iugy/
      iugy-emblem.webp
      sources/
        iugy.png
```

Se os PNGs forem apenas fontes de exportação, considerar mover para
`docs/brand/assets-source` ou documentar que não entram no bundle. Se forem
necessários para fallback, criar imports ou uma política explícita.

## Line Endings

O projeto exige LF por `.editorconfig`, mas no Windows a working tree pode virar
CRLF quando `core.autocrlf=true`. Isso faz `prettier --check .` falhar em muitos
arquivos sem mudança semântica.

Foi adicionada uma regra de repositório em `.gitattributes` para padronizar LF e
marcar imagens como binárias. Recomendação local para Windows:

```bash
git config core.autocrlf false
```

Se a working tree estiver limpa e for necessário renormalizar localmente:

```bash
git rm --cached -r .
git reset --hard
```

O comando acima é destrutivo para alterações locais e só deve ser usado com a
working tree limpa.

## Documentação Ausente

Arquivos recomendados antes da primeira API:

- `docs/product/requirements.md`;
- `docs/product/security-model.md`;
- `SECURITY.md`;
- `CONTRIBUTING.md`, mesmo para contribuidores fechados;
- `.github/pull_request_template.md`;
- `.github/ISSUE_TEMPLATE`;
- `.github/workflows/check.yml`;
- `.env.example`.

Esses arquivos ajudam uma pessoa nova a entender o projeto sem depender de
contexto oral.

## Segurança

O repositório já ignora `.env` e `.env.*`, preservando `!.env.example`. Isso é
bom, mas ainda falta o próprio `.env.example` quando API e banco entrarem.

Antes da API, documentar:

- política de dados sensíveis;
- regra de logs;
- regra de anexos;
- modelo de auditoria;
- diferença entre documento público e privado;
- escopo do admin global.

## Próxima Organização Recomendada

Ordem sugerida:

1. manter a aplicação atual como v0.1 visual;
2. resolver higiene de LF/Prettier no Windows;
3. criar templates de issue e PR;
4. criar workflow de CI com `npm run check`;
5. abrir ADR ou extensão do ADR sobre segurança e documentos oficiais;
6. implementar workspaces junto de `apps/api`;
7. mover a web para `apps/web` apenas quando o segundo workspace existir;
8. criar `packages/contracts` somente quando web/API compartilharem contratos
   reais.
