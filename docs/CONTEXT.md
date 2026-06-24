# CONTEXT.md — ogabspaiva.com.br

## Project Overview

Portfolio pessoal estático de **Gabriel Paiva**, engenheiro de software em São Paulo, Brasil. O site funciona como vitrine profissional, blog, e landing page do **Granulay** (app macOS disponível na Mac App Store).

- **Domínio:** https://ogabspaiva.com.br
- **Deploy:** Vercel (sem build step — HTML/CSS/JS puro)
- **Pacote:** Bun (dev server local)

## Tech Stack

| Camada | Tecnologia |
|---|---|
| Framework | Nenhum — HTML/CSS/JS vanilla |
| Estilos | CSS puro com custom properties (sem Tailwind/sem framework) |
| Server dev | Bun (`scripts/dev-server.js`) |
| API runtime | Vercel Serverless Functions (Node.js) |
| Storage | @vercel/blob (likes dos artigos) |
| Fontes | Georgia (serif), system-ui (sans-serif), Space Grotesk (Granulay via Google Fonts) |
| i18n | Próprio, client-side (EN/PT-BR) |

## Arquitetura

Site **multi-página estático** servido como arquivos HTML planos no Vercel. Sem SPA, sem SSR, sem build step.

### Rotas

| URL | Arquivo | Descrição |
|---|---|---|
| `/` | `index.html` | Homepage com abas de projetos e links |
| `/miniapps/` | `miniapps/index.html` | Hub de ferramentas rápidas |
| `/miniapps/arvore-de-arquivos/` | `miniapps/arvore-de-arquivos/index.html` | Formata caminhos como árvore de arquivos |
| `/artigos/` | `artigos/index.html` | Arquivo de artigos |
| `/artigos/:slug/` | `artigos/:slug/index.html` | Página de artigo individual |
| `/granulay/` | `granulay/index.html` | Landing page do Granulay |
| `/granulay/privacidade/` | `granulay/privacidade/index.html` | Política de privacidade (i18n EN/PT) |
| `/granulay/termos/` | `granulay/termos/index.html` | Termos de uso (i18n EN/PT) |
| `/api/likes` | `api/likes.js` | API serverless para curtidas |

### Estrutura de diretórios

```
/
├── index.html              # Homepage
├── styles.css              # Estilos globais
├── api/likes.js            # API de curtidas (Vercel Blob)
├── miniapps/               # Hub e ferramentas estáticas
│   ├── index.html
│   ├── miniapps.css
│   └── arvore-de-arquivos/
├── artigos/                # Blog
│   ├── index.html
│   └── :slug/index.html
├── granulay/               # Landing page Granulay
│   ├── index.html
│   ├── styles.css
│   ├── privacidade/index.html
│   └── termos/index.html
├── assets/
│   ├── profile/            # Foto e OG image
│   ├── projects/           # Ícones dos projetos
│   ├── granulay/           # Logo e OG image
│   └── articles/           # Imagens dos artigos
└── scripts/
    ├── dev-server.js       # Servidor dev Bun
    ├── article-likes.js    # Widget de curtidas client-side
    └── granulay-i18n.js    # Sistema de i18n client-side
```

## Design System

### CSS Custom Properties

Definidas em `styles.css` (raiz do projeto):
- Cores: `--color-fg`, `--color-bg`, `--color-accent`, `--color-muted`, etc.
- Tipografia: `--font-heading` (Georgia), `--font-body` (system-ui)
- Responde a `prefers-color-scheme` para dark mode

### Padrões de componente

- **Projetos na homepage:** `<a class="project">` com imagem + nome + descrição. Cor de glow via modifier class (`--gira`, `--granulay`, `--minpoker`, `--tiberius`).
- **Tabs:** `role="tablist"` com vanilla JS, `data-tab`/`data-panel`, suporte a teclado (ArrowLeft/Right, Home/End).
- **Artigos:** Classes `.essay-header`, `.essay-body`, `.essay-image`, `.essay-cover`.
- **Mini Apps:** Shell editorial compartilhado em `miniapps/miniapps.css`; cada ferramenta mantém HTML, CSS, JS e testes próprios na pasta do seu slug.
- **Like button:** FAB no canto inferior direito, `data-like-button`, `data-like-count`, `data-like-status`. Conectado à API via `article-likes.js`.
- **Granulay:** Scroll horizontal com scroll-snap, dots de navegação, botões prev/next, SVG noise filter.

### Acessibilidade

ARIA roles usados em tabs (`tablist`, `tab`, `tabpanel`), `aria-selected`, `aria-controls`, `aria-live="polite"`, `aria-pressed`, `sr-only`, navegação por teclado.

## Padrões de Código

- **Sem comentários em CSS/JS** — o código deve ser autoexplicativo
- **Nomes em português** para conteúdo (variáveis de i18n, classes de página)
- **Nomes em inglês** para código (funções, variáveis JS, classes CSS estruturais)
- **IDs:** `kebab-case` para atributos data/aria; `camelCase` para JS
- API usa `@vercel/blob` com controle de concorrência otimista (etag + retry)

## Scripts

```bash
bun dev            # Servidor estático local em :4173
bunx vercel dev    # Ambiente Vercel local (para testar API)
```

Não há build step. O deploy é feito via `vercel` CLI.

## Implantações

Projeto conectado ao Vercel. Toda push na branch `main` faz deploy automático. Não há branches de preview ou staging.
