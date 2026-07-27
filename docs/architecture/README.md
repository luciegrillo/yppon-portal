# Arquitetura do Portal de Yppon

Este diretório registra as decisões que orientam a evolução do portal. O objetivo
é preservar a experiência atual enquanto novas instituições, serviços e fontes
de dados são adicionados.

## Estado atual

O projeto usa npm workspaces com duas aplicações e um pacote de fronteira:

- `apps/web`: aplicação React 19 com Vite, TypeScript, GSAP e Lenis;
- `apps/api`: API Fastify com TypeScript, TypeBox, validação de ambiente,
  respostas de erro padronizadas, health check, endpoints públicos da IUGY e
  persistência PostgreSQL com Drizzle;
- `packages/contracts`: DTOs e envelopes públicos compartilhados entre API e
  web, sem dependências de React ou persistência.

O frontend separa:

- composição global em `apps/web/src/app`;
- componentes reutilizáveis em `apps/web/src/components`;
- conteúdo e seções das páginas em `apps/web/src/pages`;
- integrações sem interface em `apps/web/src/lib`;
- comportamentos React compartilhados em `apps/web/src/hooks`;
- configurações estáticas em `apps/web/src/config`;
- estilos por componente e seção em `apps/web/src/styles`.

A API ainda não possui autenticação nem dados privados. O módulo público da IUGY
separa rotas, application service, repository PostgreSQL e schemas TypeBox. Os
schemas são verificados em compilação contra os DTOs de `@yppon/contracts`, que
o cliente web consome sem duplicar tipos. Migrations versionadas, seed fictício,
constraints de publicação e testes de integração protegem essa fronteira.

A rota da IUGY inicia as cinco leituras públicas em paralelo. Cada seção resolve
e tenta novamente seu próprio recurso, de modo que uma falha parcial não remove
a navegação nem o conteúdo saudável. O desenvolvimento usa URLs relativas e o
proxy do Vite; a infraestrutura de produção deve encaminhar `/api` ao Fastify na
mesma origem.

Media queries específicas permanecem junto dos estilos de seus respectivos
domínios; `responsive.css` concentra apenas adaptações globais de
acessibilidade.

## Regras de dependência

1. Páginas podem importar recursos compartilhados, mas não outras páginas.
2. Código específico permanece junto da página que o utiliza.
3. Um recurso só se torna compartilhado quando existe reutilização real.
4. Componentes de interface não importam persistência ou regras do servidor.
5. Contratos de transporte não expõem entidades do banco nem dependem de React.
6. Integrações externas ficam atrás de módulos próprios e não espalhadas pelos
   componentes.
7. Animações são aprimoramentos progressivos: conteúdo, navegação e ações devem
   continuar utilizáveis sem elas.

## Decisões

- [ADR 0001: evolução para um portal multiaplicação](adr/0001-evolucao-para-portal-multiaplicacao.md)
- [Modelo público da IUGY](iugy-public-data-model.md)
- [API pública da IUGY](iugy-public-api.md)

## Qualidade

Toda mudança deve manter `npm run check` funcional. A verificação da raiz roda
lint, formatação e build dos workspaces que possuem script de build.

A estratégia de testes cresce com o risco:

- testes de comportamento para navegação, acessibilidade e utilitários;
- testes de integração para contratos e endpoints;
- smoke tests de navegador para as rotas públicas essenciais;
- validação de migrations em banco descartável quando houver persistência.

Revisões visuais continuam obrigatórias para alterações de interface antes do
commit ou da integração.
