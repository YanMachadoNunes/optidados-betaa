# OptiGestão - Sistema de Gestão para Óticas

Sistema completo de gestão para ópticas desenvolvido com Next.js 16, incluindo controle de estoque, vendas, pedidos, clientes, financeiras e sistema de assinaturas com Mercado Pago.

## Funcionalidades

### Módulo de Clientes
- Cadastro de clientes com CPF, telefone, e-mail
- Receitas médicas oftalmológicas
- Histórico de compras
- Busca e filtragem

### Módulo de Estoque
- Cadastro de produtos (armações, lentes, acessórios)
- Controle de quantidade e alertas de estoque baixo
- Categorização de produtos
- Código do laboratório

### Módulo de Vendas (PDV)
- Carrinho de compras
- Seleção de produtos
- Várias formas de pagamento (Dinheiro, Crédito, Débito, PIX)
- Baixa automática de estoque

### Módulo de Pedidos
- Criação de pedidos vinculados a clientes
- Status do pedido (Pendente, Em Montagem, Pronto, Entregue)
- Receita médica vinculada
- Edição e acompanhamento

### Módulo Financeiro
- Fluxo de caixa
- Gráficos de evolução financeira
- Últimas vendas

### Sistema de Planos
- Planos: FREE, BASIC, STANDARD, PREMIUM
- Checkout com Mercado Pago

### Configurações
- Dados da loja
- Editar perfil

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 (Turbopack) |
| Linguagem | TypeScript |
| UI | React 19, CSS Modules, Lucide Icons |
| Banco de Dados | PostgreSQL + Prisma ORM |
| Autenticação | NextAuth.js (Google OAuth + Credentials) |
| Pagamentos | Mercado Pago SDK |
| Gráficos | Recharts |

---

## Pré-requisitos

- Node.js 18+
- PostgreSQL (Neon, Supabase, ou local)
- Conta Google Cloud (OAuth)
- Conta Mercado Pago (para pagamentos)

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/YanMachadoNunes/optidados-betaa.git
cd optidados-betaa

# Instale dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações e seed
npx prisma db push
npx prisma db seed

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL="postgresql://..."
PRISMA_DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="..."
```

---

## Arquitetura Multitenancy

O sistema implementa **multitenancy** onde cada usuário vê apenas seus próprios dados:

### Modelos com `userId`

- **Customer** - Clientes vinculados ao usuário
- **Product** - Produtos do estoque
- **StoreSettings** - Configurações da loja
- **Sale** - Vendas realizadas
- **Order** - Pedidos feitos

### Como funciona

1. Usuário faz login
2. NextAuth verifica/cria usuário no banco
3. userId é armazenado na sessão JWT
4. Todas as queries filtram por userId
5. Ações de CRUD verificam ownership

### Arquivos de autenticação

```typescript
// lib/auth-helpers.ts
export async function getCurrentUserId(): Promise<string | null>
export async function requireAuth(): Promise<string>
```

---

## Estrutura do Projeto

```
optigestao/
├── app/
│   ├── (auth)/login/           # Login
│   ├── (dashboard)/            # Rotas autenticadas
│   │   ├── customers/         # Clientes
│   │   ├── inventory/         # Estoque
│   │   ├── orders/           # Pedidos
│   │   ├── sales/            # Vendas
│   │   ├── finance/          # Financeiro
│   │   ├── plans/           # Planos
│   │   └── settings/        # Configurações
│   ├── api/                  # API Routes
│   └── layout.tsx
├── lib/
│   ├── auth-helpers.ts       # Helpers de autenticação
│   ├── prisma.ts            # Cliente Prisma
│   └── utils.ts
└── prisma/
    ├── schema.prisma         # Schema do banco
    └── seed.ts              # Dados de exemplo
```

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard |
| `/login` | Login |
| `/customers` | Lista de clientes |
| `/customers/new` | Novo cliente |
| `/customers/[id]` | Detalhes do cliente |
| `/inventory` | Estoque |
| `/inventory/new` | Novo produto |
| `/sales` | Histórico de vendas |
| `/sales/new` | Nova venda (PDV) |
| `/orders` | Lista de pedidos |
| `/orders/new` | Novo pedido |
| `/orders/[id]` | Detalhes do pedido |
| `/finance` | Dashboard financeiro |
| `/settings` | Configurações |

---

## Comandos

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Prisma
npx prisma generate      # Gerar cliente
npx prisma db push       # Sincronizar schema
npx prisma db seed      # Popular dados de exemplo
npx prisma db studio    # Visualizar banco
```

---

## Dados de Login (Seed)

- **Email**: admin@optigestao.com
- **Senha**: admin123

---

## Design System

O projeto utiliza um sistema de design com CSS Modules e variáveis CSS:

```css
/* Cores */
--bg-primary:       /* Fundo principal */
--bg-card:         /* Cards */
--text-primary:     /* Texto principal */
--text-secondary:   /* Texto secundário */
--accent-primary:   /* Cor de destaque */
--border-color:     /* Bordas */

/* Espaçamento (múltiplos de 4px) */
--space-1: 4px
--space-2: 8px
--space-4: 16px
--space-6: 24px
```

---

## Deploy

O projeto está configurado para deploy na Vercel:

1. Conecte o repositório GitHub
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push

---

## Licença

MIT License

---

Feito com Next.js 16 + Prisma + PostgreSQL
