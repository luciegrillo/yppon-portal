# Portal Oficial de Yppon

Home institucional imersiva construída com React, TypeScript, GSAP e CSS 3D.
A interface combina navegação pública acessível com uma identidade
mítico-futurista baseada nos símbolos de Yppon.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

`npm run check` executa lint, verificação de formatação, TypeScript e a build de
produção. Esse é o comando recomendado antes de cada commit.

## Estrutura

```text
src/
├── app/                 # Composição global da aplicação
├── assets/              # Arquivos estáticos da identidade de Yppon
├── components/          # Componentes reutilizáveis entre páginas
│   ├── layout/
│   ├── navigation/
│   └── search/
├── config/              # Configurações compartilhadas de interface
├── hooks/               # Comportamentos React reutilizáveis
├── lib/                 # Integrações e funções sem interface visual
├── pages/
│   └── home/
│       ├── content/     # Dados editoriais e tipos da página
│       ├── sections/    # Seções que compõem a home
└── styles/
    ├── components/      # Estilos dos componentes compartilhados
    ├── sections/        # Estilos específicos das seções
    ├── foundation.css   # Tokens, reset e utilitários globais
    ├── motion.css       # Keyframes reutilizados
    └── responsive.css   # Adaptações globais de breakpoint e acessibilidade
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
- Novas páginas devem ser criadas em `src/pages/<nome-da-pagina>`.
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
