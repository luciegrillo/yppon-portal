# ADR 0001: evolução para um portal multiaplicação

- **Status:** Aceito
- **Data:** 2026-06-06
- **Escopo inicial:** Portal público da IUGY

## Contexto

O Portal Oficial de Yppon nasceu como uma home institucional imersiva. A
aplicação atual tem uma única rota, conteúdo local e nenhuma dependência de
servidor. A IUGY será a primeira instituição com páginas próprias e deve abrir
caminho para outras instituições sem comprometer a home existente.

No futuro, parte do conteúdo será dinâmica e exigirá API e persistência. Ainda
não existem requisitos para autenticação, inscrições, área estudantil,
administração interna ou comunicação entre serviços.

A arquitetura precisa suportar essa evolução, mas não deve implementar hoje
complexidade baseada apenas em possibilidades futuras.

## Decisão

### Aplicação web

React 19, Vite e TypeScript permanecem como base do frontend. A experiência
continuará sendo uma aplicação cliente, com HTML semântico e conteúdo utilizável
sem animações.

React Router será introduzido para definir:

- um layout raiz com cabeçalho, menu, progresso e rodapé;
- a home na rota `/`;
- as páginas públicas da IUGY sob `/instituicoes/iugy`;
- uma experiência explícita para rotas não encontradas;
- carregamento sob demanda das páginas institucionais quando isso reduzir o
  bundle inicial.

O Data Mode do React Router v7 ou superior, via `createBrowserRouter`, será usado
como estrutura de roteamento. Loaders e actions só serão adicionados quando uma
rota tiver uma necessidade real de leitura ou mutação.

### Organização do repositório

O repositório adotará npm workspaces quando existir mais de um pacote real, o
que ocorrerá com a primeira API ou com contratos compartilhados. Enquanto
existir apenas a aplicação web, ela permanecerá na estrutura atual para evitar
uma migração sem benefício operacional.

A arquitetura de destino é:

```text
apps/
├── web/
└── api/
packages/
└── contracts/
```

Não serão mantidos pacotes vazios apenas para representar a arquitetura futura.
Quando o gatilho for atingido, a aplicação existente será movida para
`apps/web` na mesma mudança que introduzir o segundo workspace.

Estado de implementação: o gatilho foi atingido com a criação de `apps/api`.
O frontend foi movido para `apps/web`, e a API começou apenas com base
operacional, health check e tratamento padronizado de erros.

### Limites do frontend

`apps/web/src/app` possuirá a inicialização, o roteador e os providers globais.
Cada página será responsável por seu conteúdo, seções, componentes e estilos
específicos. Recursos só serão promovidos para áreas compartilhadas quando
houver reutilização concreta.

Os diretórios `components`, `hooks`, `lib` e `config` formam os módulos
compartilhados do frontend. As dependências devem seguir esta direção:

```text
app -> pages -> {components, hooks, lib, config}
```

Páginas não importam outras páginas. Módulos compartilhados não importam páginas.
Tipos de apresentação, como ícones React, permanecem no frontend e não migram
para contratos de API.

Os estilos responsivos devem permanecer próximos do domínio que alteram.
`responsive.css` ficará reservado a regras realmente globais e acessibilidade,
evitando que se transforme em um arquivo central para todas as páginas.

### API e persistência

Quando o primeiro requisito dinâmico justificar um servidor, ele será
implementado como monólito modular em `apps/api`, usando:

- Fastify para transporte HTTP e ciclo de vida;
- TypeBox para schemas de entrada e saída;
- PostgreSQL para persistência;
- Drizzle ORM e migrations versionadas para acesso e evolução do banco.

Módulos da API serão organizados por domínio, não por tipo técnico global. A
direção esperada é:

```text
route -> application service -> repository
```

Regras de domínio não dependerão de Fastify ou Drizzle. Repositórios encapsularão
detalhes de persistência. A API começará como um único processo implantável;
microserviços não fazem parte desta decisão.

A API inicial pode existir sem banco enquanto servir apenas como scaffold
operacional. PostgreSQL, Drizzle e migrations entram quando houver domínio
público com persistência real, mesmo que os endpoints públicos sejam publicados
em PR posterior.

### Contratos

`packages/contracts` existirá quando web e API precisarem compartilhar uma
fronteira de transporte. Ele poderá conter schemas TypeBox, DTOs e tipos
derivados desses schemas.

O pacote não conterá:

- componentes ou dependências de React;
- entidades ou queries do Drizzle;
- variáveis de ambiente;
- regras de apresentação;
- acesso a rede ou banco.

A existência de contratos compartilhados não autoriza a aplicação web a
importar código interno da API.

### Estado e acesso a dados

Estado local React continua sendo a opção padrão. Nenhuma biblioteca global de
estado ou cache de servidor será adotada antes de existir um caso concreto que
os hooks e APIs do roteador não resolvam de forma clara.

Conteúdo editorial local pode permanecer em módulos TypeScript enquanto não
houver requisito de publicação independente. Dados apresentados como oficiais
devem ser identificados como provisórios enquanto forem fixtures.

Quando dados locais evoluírem para contratos de API, DTOs de transporte serão
separados dos tipos de apresentação. Ícones, componentes e variantes visuais
continuarão no frontend, mesmo quando hoje estiverem reunidos no mesmo tipo de
conteúdo.

### Qualidade e observabilidade

A base mínima de qualidade para a expansão inclui:

- Vitest e React Testing Library para comportamento de hooks e componentes;
- Playwright para smoke tests das rotas públicas críticas;
- testes de integração da API quando endpoints forem introduzidos;
- validação automatizada de migrations quando houver banco;
- um error boundary no layout raiz antes de múltiplas rotas entrarem em
  produção;
- logs estruturados e health check quando a API existir.

Um fornecedor de telemetria não será escolhido neste ADR. A adoção dependerá do
ambiente de implantação, requisitos de privacidade e necessidade observada.

## Estratégia incremental

1. Registrar esta decisão e manter a home inalterada.
2. Mover media queries específicas de seções para seus respectivos estilos,
   preservando apenas regras globais e de acessibilidade em `responsive.css`.
3. Adicionar o roteador e transformar a composição atual na rota `/`.
4. Configurar o ambiente de hospedagem para servir `index.html` como fallback
   das rotas públicas antes de publicá-las.
5. Criar a experiência pública da IUGY com conteúdo local tipado.
6. Introduzir testes de rota, acessibilidade e carregamento.
7. Confirmar quais conteúdos precisam de atualização independente.
8. Ao surgir o segundo pacote real, adotar npm workspaces e mover o frontend
   para `apps/web` junto da criação da API ou de `packages/contracts`.
9. Criar persistência apenas para os casos dinâmicos confirmados.

Cada etapa deve produzir uma aplicação utilizável e passível de implantação.

## Consequências

### Positivas

- a home continua funcional durante toda a evolução;
- páginas institucionais ganham limites claros;
- web e servidor podem ser desenvolvidos e implantados separadamente;
- contratos de transporte evitam duplicação sem acoplar UI ao banco;
- a arquitetura cresce em resposta a requisitos reais.

### Custos

- workspaces adicionam configuração e exigem scripts coordenados na raiz;
- roteamento requer tratamento de foco, erros e configuração de fallback no
  ambiente de hospedagem;
- GSAP ScrollTrigger e Lenis exigem atualização do ciclo de vida e do estado de
  scroll após transições de rota;
- contratos compartilhados exigem disciplina de versionamento;
- testes de navegador e banco aumentam o tempo do pipeline.

## Alternativas consideradas

### Manter tudo em uma única aplicação

Rejeitado como direção de longo prazo porque frontend, servidor e contratos
teriam ciclos de build e dependências misturados. A estrutura atual permanece
válida apenas enquanto existe uma aplicação web isolada.

### Migrar para Next.js ou outro framework SSR

Adiado. O portal ainda não demonstrou necessidade de SSR, server components ou
renderização por requisição. SEO, indexação e desempenho deverão ser medidos
antes de justificar uma migração.

### Criar microserviços por instituição

Rejeitado. Não há escala operacional, equipes independentes ou limites de
domínio comprovados que compensem o custo distribuído.

### Adotar estado global imediatamente

Rejeitado. O estado atual é pequeno e local. A escolha de uma biblioteca sem um
problema concreto aumentaria a superfície conceitual sem benefício.

### Criar API e banco antes da página pública

Adiado até que exista conteúdo que realmente precise de persistência ou
publicação independente. Fixtures locais permitem validar primeiro a experiência
e o modelo editorial.

## Decisões adiadas

Os temas abaixo exigem requisitos próprios e, quando necessário, novos ADRs:

- autenticação, autorização e gestão de sessão;
- área estudantil, inscrições e administração;
- CMS ou fluxo editorial;
- cache de servidor e estado global do frontend;
- SSR, prerenderização ou migração de framework;
- fornecedor de observabilidade;
- estratégia de deploy e ambientes;
- armazenamento de documentos;
- divisão de serviços.
