# Arquitetura do Portal de Yppon

Este diretório registra as decisões que orientam a evolução do portal. O objetivo
é preservar a experiência atual enquanto novas instituições, serviços e fontes
de dados são adicionados.

## Estado atual

O projeto é uma aplicação React 19 com Vite, TypeScript, GSAP e Lenis. A home é
uma página única e não consome uma API. Sua organização separa:

- composição global em `src/app`;
- componentes reutilizáveis em `src/components`;
- conteúdo e seções da home em `src/pages/home`;
- integrações sem interface em `src/lib`;
- comportamentos React compartilhados em `src/hooks`;
- configurações estáticas em `src/config`;
- estilos por componente e seção em `src/styles`.

Essa estrutura é adequada ao tamanho atual. As próximas mudanças devem evoluí-la
sem reescrever a home ou antecipar abstrações sem uso.

O arquivo `src/styles/responsive.css` ainda reúne media queries específicas de
várias seções. Antes da primeira página institucional, essas regras devem voltar
para os estilos de seus respectivos domínios.

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

## Qualidade

Toda mudança deve manter `npm run check` funcional. Conforme novas camadas forem
introduzidas, a verificação da raiz deverá incluir os workspaces afetados.

A estratégia de testes cresce com o risco:

- testes de comportamento para navegação, acessibilidade e utilitários;
- testes de integração para contratos e endpoints;
- smoke tests de navegador para as rotas públicas essenciais;
- validação de migrations em banco descartável quando houver persistência.

Revisões visuais continuam obrigatórias para alterações de interface antes do
commit ou da integração.
