# PRD — ogabspaiva.com.br

## Visão do Produto

Site pessoal de Gabriel Paiva que funciona como:
1. **Portfólio profissional** — apresenta projetos, habilidades e experiência
2. **Blog técnico/pessoal** — artigos sobre organização, tecnologia e estilo de vida
3. **Landing page do Granulay** — apresenta e direciona usuários para o app macOS na Mac App Store

## Público-Alvo

- Recrutadores e empresas de tecnologia avaliando o perfil do Gabriel
- Desenvolvedores interessados nos artigos e projetos
- Usuários finais do Granulay (pessoas que querem acompanhar hábitos)

## Objetivos

| Objetivo | Métrica |
|---|---|
| Ser a principal presença online do Gabriel | Visitantes únicos/mês |
| Gerar downloads do Granulay | Cliques no link da App Store |
| Estabelecer autoridade técnica | Engajamento nos artigos (curtidas, compartilhamentos) |

## Funcionalidades

### Homepage (`/`)
- [x] Foto e bio de apresentação
- [x] Abas de projetos: Produtos, Mini Apps, Artigos
- [x] Cards de projeto com ícone, nome e descrição
- [x] Links para redes sociais (GitHub, LinkedIn, X)
- [x] Dark mode (preferência do sistema)

### Artigos (`/artigos/`)
- [x] Listagem de artigos publicados
- [x] Página individual com cabeçalho, corpo e meta info
- [x] Curtidas (via API serverless + Vercel Blob)
- [x] Compartilhamento (Web Share API + fallback)
- [x] Imagem de capa e imagens inline no corpo

### Mini Apps (`/miniapps/`)
- [x] Hub com a lista completa de ferramentas
- [x] Rotas estáveis e compartilháveis para cada ferramenta
- [x] Árvore de Arquivos com prévia ao vivo e três ordenações
- [x] Cópia e download do resultado em `.txt`
- [x] Processamento local, sem upload ou persistência dos caminhos
- [x] CNPJ com geração e validação de CNPJs numéricos e alfanuméricos
- [x] CNPJ com opção de máscara e processamento local

### Granulay (`/granulay/`)
- [x] Landing page com scroll horizontal em seções
- [x] Navegação por dots + botões prev/next
- [x] Seções: Hero, Features, Contato
- [x] Navegação em português e inglês (i18n client-side)
- [x] Política de privacidade e termos de uso (i18n)
- [x] Link direto para Mac App Store

### API (`/api/likes`)
- [x] GET: retorna contagem de curtidas de um artigo
- [x] POST: incrementa/decrementa curtida
- [x] Controle de concorrência com etag
- [x] Whitelist de artigos permitidos
- [x] Validação de content-type e tamanho do body

## Não-Escopo (v1)

- ~~Comentários nos artigos~~
- ~~Newsletter~~
- ~~Busca interna~~
- ~~Páginas de "sobre" ou "carreira" separadas~~
- ~~Build step ou bundler~~

## Requisitos Técnicos

- **Zero dependências runtime** (exceto @vercel/blob para API)
- **Sem framework** — HTML/CSS/JS vanilla para máxima performance e simplicidade
- **Deploy serverless** no Vercel sem build step
- **Responsivo** — funciona em mobile, tablet e desktop
- **Acessível** — ARIA, keyboard nav, contraste suficiente
- **Dark mode** automático baseado em `prefers-color-scheme`
- **Privacidade** — sem trackers, sem cookies, sem analytics

## Roadmap (próximos passos)

| Item | Prioridade |
|---|---|
| Mais artigos no blog | Alta |
| Mais mini apps utilitários | Alta |
| Página "Sobre" dedicada | Média |
| Seção de projetos com mais detalhes | Média |
| Suporte a múltiplos idiomas no site (não só Granulay) | Baixa |
| RSS feed para artigos | Baixa |

## Manutenção

- **Adicionar artigo:** criar `artigos/:slug/index.html` + assets em `assets/articles/:slug/` + adicionar slug à whitelist em `api/likes.js`
- **Deploy:** `git push` para `main` → Vercel deploys automaticamente
- **Ambiente local:** `bun dev` (estático) ou `bunx vercel dev` (com API)
