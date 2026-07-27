# Exceções de Segurança de Dependências

Este registro documenta riscos de dependências que não podem ser corrigidos sem
forçar uma versão fora do intervalo suportado pelo fornecedor. Cada exceção deve
ter escopo, controles, responsável e prazo de revisão explícitos.

## DEP-2026-001 — esbuild transitivo do drizzle-kit

- **Estado:** aceita temporariamente.
- **Registrada em:** 2026-07-27.
- **Revisar até:** 2026-10-27.
- **Responsável:** mantenedora do repositório (`@luciegrillo`).
- **Advisory ativo:** `GHSA-67mh-4wv8-2f99`, severidade moderada.
- **Caminho:** `drizzle-kit@0.31.10` →
  `@esbuild-kit/esm-loader@2.6.5` →
  `@esbuild-kit/core-utils@3.3.2` → `esbuild@0.18.20`.

### Risco e escopo

A versão afetada do esbuild pode permitir que outro site envie requisições ao
servidor de desenvolvimento e leia suas respostas. No portal, esse binário vem
exclusivamente de `drizzle-kit`, que é uma `devDependency`; ele não integra os
bundles da aplicação nem o processo da API em produção.

O `drizzle-kit@0.31.10` é a versão estável mais recente na data deste registro e
continua limitando o esbuild transitivo a `~0.18.20`. Forçar `esbuild>=0.25.0`
por `overrides` violaria o intervalo declarado pelo pacote e poderia quebrar a
geração de migrations de forma silenciosa.

O advisory `GHSA-gv7w-rqvm-qjhr`, também associado a versões antigas do
esbuild, foi retirado e não fundamenta esta exceção.

### Controles temporários

- não expor Drizzle Studio nem qualquer servidor de desenvolvimento a redes não
  confiáveis;
- executar geração de migrations apenas em ambiente local controlado;
- manter migrations geradas versionadas e revisadas antes de aplicá-las;
- usar `tsx` para migrations e seed, como já ocorre no CI, sem carregar
  `drizzle-kit`;
- omitir `devDependencies` na instalação destinada ao runtime de produção;
- não aplicar override fora do intervalo suportado apenas para silenciar a
  ferramenta de auditoria.

### Critério de encerramento

Encerrar a exceção quando o Drizzle publicar uma versão compatível que remova o
loader legado ou resolva `esbuild>=0.25.0`. Na revisão, atualizar o lockfile,
executar os checks e testes do repositório e confirmar novamente o resultado da
auditoria oficial de dependências.

Se não houver correção até a data limite, a responsável deve reavaliar o risco e
registrar novo prazo; a exceção não deve ser renovada implicitamente.
