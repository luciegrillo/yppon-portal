# Contribuição

Este repositório é fechado para contribuição externa, mas deve continuar fácil
de entender para qualquer pessoa que precise ler sua arquitetura, histórico e
decisões. Toda mudança deve ser pequena o suficiente para revisão e alinhada aos
documentos em `docs/`.

## Fluxo de Trabalho

1. Crie uma branch a partir de `main`.
2. Use `<type>/<issue>-<short-kebab-description>`.
3. Mantenha commits no formato Conventional Commits.
4. Abra PR com resumo, verificação e issue relacionada.
5. Rode `npm run check` antes da revisão quando a working tree local já estiver
   normalizada em LF.

Exemplos de branch:

```text
feat/5-iugy-public-experience
chore/4-api-fastify-bootstrap
test/10-iugy-quality-gates
```

Tipos recomendados:

- `feat`: capacidade perceptível para usuários.
- `fix`: correção de comportamento.
- `refactor`: reorganização sem mudança funcional.
- `style`: apresentação ou formatação.
- `chore`: manutenção, ferramentas ou configuração.
- `docs`: documentação.
- `test`: cobertura e validação.

## Verificação Local

Comandos principais:

```bash
npm install
npm run dev
npm run dev:api
npm run check
npm run build
```

`npm run check` executa lint, Prettier, typecheck e build. No Windows, se o
Prettier apontar quase todos os arquivos sem mudanças relevantes, confira a
seção de line endings antes de formatar o repositório inteiro.

## Line Endings

O repositório usa LF. A regra está em `.editorconfig` e `.gitattributes`.

No Windows, prefira:

```bash
git config core.autocrlf false
```

Se a working tree estiver limpa e for necessário renormalizar localmente:

```bash
git rm --cached -r .
git reset --hard
```

Esse procedimento descarta alterações locais não commitadas. Não execute com
arquivos modificados.

## Segurança

Nunca commite:

- arquivos `.env` ou credenciais;
- tokens, chaves virtuais ou senhas;
- dados pessoais fictícios tratados como reais;
- anexos privados;
- dumps de banco;
- logs contendo dados sensíveis.

Dados fictícios do Portal de Yppon devem ser tratados como dados governamentais.
Antes de adicionar persistência, autenticação, anexos ou dados privados, leia
`docs/product/security-model.md`.

## Revisão

PRs devem deixar claro:

- o que mudou;
- como foi verificado;
- qual issue ou requisito foi atendido;
- impacto em acessibilidade, movimento reduzido, segurança e dados sensíveis;
- se há decisões adiadas.

Alterações visuais precisam de revisão manual em desktop e mobile. Alterações de
segurança ou dados devem preferir escopos pequenos e rastreáveis.
