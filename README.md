# Portal Oficial de Yppon

Home institucional imersiva construída com React, TypeScript, GSAP e CSS 3D.
A interface combina navegação pública acessível com uma identidade
mítico-futurista baseada nos símbolos de Yppon.

## Requisitos

- Node.js 22 ou superior
- npm 10 ou superior

## Comandos

```bash
npm install
npm run dev
npm run dev:api
npm run check
npm run build
npm run preview
```

`npm run dev` é um atalho para o frontend em `apps/web`. `npm run dev:api`
inicia a API em `apps/api`. `npm run check` executa lint, verificação de
formatação e build dos workspaces. Esse é o comando recomendado antes de cada
commit.

## Estrutura

```text
apps/
├── api/
│   └── src/
│       ├── config/      # Variáveis de ambiente e configuração da API
│       ├── http/        # Erros e utilitários HTTP compartilhados
│       └── modules/     # Módulos de domínio e rotas
└── web/
    └── src/
        ├── app/         # Composição global da aplicação
        ├── assets/      # Arquivos estáticos da identidade de Yppon
        ├── components/  # Componentes reutilizáveis entre páginas
        ├── config/      # Configurações compartilhadas de interface
        ├── hooks/       # Comportamentos React reutilizáveis
        ├── lib/         # Integrações e funções sem interface visual
        ├── pages/       # Páginas públicas
        └── styles/      # Foundation, componentes, seções e responsividade
```

As decisões de evolução, limites entre módulos e estratégia para novas
aplicações estão documentados em
[`docs/architecture`](docs/architecture/README.md).

## Convenções

- Componentes e arquivos de componentes usam `PascalCase`.
- Hooks começam com `use` e não contêm marcação visual.
- Conteúdo estático fica fora dos componentes que o apresentam.
- Integrações externas são centralizadas em `lib`.
- CSS segue nomes orientados ao domínio e modificadores com `--`.
- Comentários explicam decisões não evidentes; não repetem o que o código já diz.
- Novas páginas devem ser criadas em `apps/web/src/pages/<nome-da-pagina>`.
- Recursos compartilhados só devem migrar para `components`, `hooks` ou `lib`
  quando forem realmente usados por mais de uma página.

## Acessibilidade e desempenho

- A navegação cerimonial implementa foco contido, fechamento por `Escape` e
  retorno do foco ao elemento anterior.
- `prefers-reduced-motion` desativa scroll suave e animações contínuas.
- Efeitos de profundidade usam CSS 3D e GSAP, evitando dependências WebGL.
- Animações ligadas ao scroll são desativadas quando há preferência por movimento reduzido.

## Histórico Git

O projeto usa mensagens no formato Conventional Commits:

```text
feat: adiciona uma capacidade
fix: corrige um comportamento
refactor: reorganiza sem alterar funcionalidade
style: altera somente apresentação ou formatação
chore: manutenção de ferramentas e configuração
docs: altera documentação
```
