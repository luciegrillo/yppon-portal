# Auditoria Organizacional do Repositório

## Estado Atual

O repositório está organizado como um monorepo npm workspaces com duas
aplicações reais:

- `apps/web`: portal público em React, Vite e TypeScript;
- `apps/api`: API Fastify com TypeScript, TypeBox, validação de ambiente,
  respostas de erro padronizadas e health check.

A API ainda não possui autenticação, banco, domínio persistido nem contratos
compartilhados. Essa contenção preserva o escopo incremental do ADR 0001.

Pontos fortes:

- arquitetura documentada em `docs/architecture`;
- separação clara entre `apps/web` e `apps/api`;
- frontend organizado em `app`, `pages`, `components`, `hooks`, `lib`, `config`
  e `styles`;
- API iniciada com limites de `config`, `http` e `modules`;
- páginas com conteúdo local tipado;
- rotas lazy-loaded;
- CI mínimo com Node 22, `npm ci` e `npm run check`;
- políticas de contribuição e segurança documentadas;
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

`apps/web/src/assets` contém pares PNG/WebP e alguns arquivos PNG grandes:

- `yppon-flag.png`;
- `yppon-icon.png`;
- `iugy.png`;
- equivalentes WebP menores usados pela aplicação.

Hoje os imports usam principalmente WebP. Os PNGs parecem funcionar como fontes
ou alternativas, mas essa intenção não está documentada. Para evitar poluição, a
pasta deve ganhar convenção.

Recomendação:

```text
apps/web/src/assets/
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

Arquivos de governança já presentes:

- `docs/product/requirements.md`;
- `docs/product/security-model.md`;
- `SECURITY.md`;
- `CONTRIBUTING.md`, mesmo para contribuidores fechados;
- `.github/pull_request_template.md`;
- `.github/ISSUE_TEMPLATE`;
- `.github/workflows/check.yml`;
- `.env.example`.

Esses arquivos ajudam uma pessoa nova a entender o projeto sem depender de
contexto oral. A próxima lacuna documental é transformar requisitos confirmados
em contratos de API, fluxos de autorização e critérios de auditoria verificáveis.

## Segurança

O repositório ignora `.env` e `.env.*`, preservando `!.env.example`. A API
possui apenas variáveis não secretas de bootstrap no exemplo.

Antes de armazenar documentos, usuários ou dados oficiais, detalhar:

- política de dados sensíveis;
- regra de logs;
- regra de anexos;
- modelo de auditoria;
- diferença entre documento público e privado;
- escopo do admin global.

## Próxima Organização Recomendada

Ordem sugerida:

1. manter `apps/api` como monólito modular enquanto os domínios ainda são
   pequenos;
2. criar `packages/contracts` somente quando web/API compartilharem contratos
   reais.
3. abrir ADR ou extensão do ADR sobre segurança, documentos oficiais e
   auditoria antes de implementar dados privados;
4. reorganizar `apps/web/src/assets` em PR próprio, sem misturar com mudanças de
   comportamento;
5. introduzir testes focados quando houver endpoints reais, autenticação ou
   fluxos críticos de UI.
