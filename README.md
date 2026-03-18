# OptiGestão - Sistema de Gestão para Óticas

Sistema completo de gestão para ópticas desenvolvido com Next.js 16, incluindo controle de estoque, vendas, pedidos, clientes, financeiras e sistema de assinaturas com Mercado Pago.

## 📋 Sumário

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Configuração](#configuração)
- [Rotas e Páginas](#rotas-e-páginas)
- [Autenticação](#autenticação)
- [Banco de Dados](#banco-de-dados)
- [API Routes](#api-routes)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## 🚀 Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 (Turbopack) |
| Linguagem | TypeScript |
| UI | React 19, Tailwind CSS, CSS Modules |
| Banco de Dados | PostgreSQL + Prisma ORM + Accelerate |
| Autenticação | NextAuth.js + Google OAuth |
| Pagamentos | Mercado Pago SDK |
| Ícones | Lucide React |
| Gráficos | Recharts |

---

## 📁 Estrutura do Projeto

```
optigestao/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grupo de rotasauth
│   │   └── login/                # Página de login
│   ├── (dashboard)/              # Grupo de rotas autenticadas
│   │   ├── customers/           # Módulo de Clientes
│   │   │   ├── new/             # Novo cliente
│   │   │   ├── [id]/            # Detalhes do cliente
│   │   │   │   ├── edit/        # Editar cliente
│   │   │   │   └── prescriptions/new/  # Nova receita
│   │   ├── inventory/           # Módulo de Estoque
│   │   │   └── new/            # Novo produto
│   │   ├── orders/             # Módulo de Pedidos
│   │   │   ├── new/            # Novo pedido
│   │   │   └── [id]/           # Detalhes do pedido
│   │   │       └── edit/       # Editar pedido
│   │   ├── plans/             # Módulo de Planos
│   │   │   └── [id]/
│   │   │       └── checkout/   # Checkout de pagamento
│   │   ├── sales/             # Módulo de Vendas
│   │   │   └── new/           # Nova venda
│   │   ├── finance/          # Módulo Financeiro
│   │   ├── settings/         # Configurações
│   │   │   └── profile/      # Editar perfil
│   │   └── layout.tsx        # Layout dashboard
│   ├── api/                  # API Routes
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── create-payment/      # Criar pagamento MP
│   │   ├── orders/              # CRUD Pedidos
│   │   └── pix/                 # PIX QR Code
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Sidebar.tsx         # Barra lateral
│   │   └── ...
│   ├── context/              # React Contexts
│   │   ├── AuthContext.tsx    # Autenticação
│   │   └── ThemeContext.tsx    # Tema (claro/escuro)
│   ├── providers.tsx         # Providers globais
│   └── layout.tsx            # Layout raiz
├── components/              # Componentes UI (shadcn)
├── lib/                     # Utilitários
│   └── prisma.ts            # Cliente Prisma
├── prisma/                  # Schema e migrações
│   ├── schema.prisma        # Schema do banco
│   └── migrations/          # Migrações
└── public/                  # Arquivos estáticos
```

---

## 🎯 Funcionalidades

### 1. Dashboard
- Visão geral do sistema com gráficos
- Atalhos para principais funcionalidades
- Indicadores de desempenho

### 2. Módulo de Clientes
- Cadastro de clientes com RG, CPF, telefone, e-mail
- Histórico de compras
- Gestão de receitas médicas (odonto/oftalmo)
- Busca e filtragem

### 3. Módulo de Estoque
- Cadastro de produtos (armações, lentes, acessorios)
- Controle de quantidade e alertas de estoque baixo
- Categorização de produtos
- Busca por nome, código ou categoria

### 4. Módulo de Pedidos
- Criação de pedidos vinculados a clientes
- Seleção de produtos do estoque
- Cálculo automático de valores
- Status do pedido (pendente, em produção, pronto, entregue)
- Edição e acompanhamento

### 5. Módulo de Vendas
- Registro de vendas realizadas
- Formas de pagamento (dinheiro, cartão, PIX)
- Vinculação com pedidos
- Relatório de vendas

### 6. Módulo Financeiro
- Fluxo de caixa
- Receitas e despesas
- Gráficos de evolução financeira

### 7. Sistema de Planos (Assinaturas)
- Planos: Básico (R$ 89,90), Padrão (R$ 129,90), Premium (R$ 199,90)
- Checkout com Mercado Pago
- Formas de pagamento: PIX, Cartão, Boleto

### 8. Configurações
- Alternar tema (claro/escuro)
- Notificações de estoque
- Segurança (alterar senha, sessões ativas)
- **Editar Perfil** - Dados do usuário logado

---

## ⚙️ Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL (local ou cloud)
- Conta Google Cloud (OAuth)
- Conta Mercado Pago (para pagamentos)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/YanMachadoNunes/optidados-betaa.git
cd optidados-betaa

# Instale dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute o banco de dados (exemplo com Docker)
docker-compose up -d

# Execute as migrações
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 📍 Rotas e Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Redirect para dashboard ou login |
| `/login` | Login com Google OAuth |
| `/customers` | Lista de clientes |
| `/customers/new` | Novo cliente |
| `/customers/[id]` | Detalhes do cliente |
| `/customers/[id]/edit` | Editar cliente |
| `/customers/[id]/prescriptions/new` | Nova receita |
| `/inventory` | Lista de estoque |
| `/inventory/new` | Novo produto |
| `/orders` | Lista de pedidos |
| `/orders/new` | Novo pedido |
| `/orders/[id]` | Detalhes do pedido |
| `/orders/[id]/edit` | Editar pedido |
| `/sales` | Lista de vendas |
| `/sales/new` | Nova venda |
| `/finance` | Dashboard financeiro |
| `/plans` | Seleção de planos |
| `/plans/[id]/checkout` | Checkout de pagamento |
| `/settings` | Configurações gerais |
| `/settings/profile` | Editar perfil do usuário |

---

## 🔐 Autenticação

### Sistema Híbrido
O sistema utiliza dois métodos de autenticação:

1. **AuthContext (Demo)**
   - Usuário padrão: `admin@optigestao.com` / `admin123`
   - Armazenado no localStorage
   - Sessão persiste entre reloads

2. **NextAuth.js (Google OAuth)**
   - Login com conta Google
   - Sessão gerenciada automaticamente
   - Rotas protegidas via middleware

### Fluxo de Proteção
- Usuários não autenticados são redirecionados para `/login`
- O AuthContext verifica localStorage ao carregar
- O Sidebar exibe foto e nome do usuário logado

---

## 🗄️ Banco de Dados

### Schema Principal

```prisma
// Usuários do sistema
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String?
  role          Role      @default(USER)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  customers     Customer[]
  orders       Order[]
  sales        Sale[]
}

// Clientes da ótica
model Customer {
  id            String    @id @default(cuid())
  name          String
  email         String?
  phone         String?
  cpf           String?
  rg            String?
  birthDate     DateTime?
  address       String?
  prescription  Json?
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  orders        Order[]
  sales         Sale[]
  createdAt     DateTime  @default(now())
}

// Produtos do estoque
model Product {
  id          String    @id @default(cuid())
  name        String
  sku         String    @unique
  category    Category
  brand       String?
  color       String?
  size        String?
  price       Decimal   @db.Decimal(10, 2)
  cost        Decimal   @db.Decimal(10, 2)
  quantity    Int       @default(0)
  minStock    Int       @default(5)
  description String?
  image       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  orderItems  OrderItem[]
  saleItems   SaleItem[]
}

// Pedidos
model Order {
  id          String      @id @default(cuid())
  customerId  String
  customer    Customer    @relation(fields: [customerId], references: [id])
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  items       OrderItem[]
  total       Decimal     @db.Decimal(10, 2)
  notes       String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

// Vendas
model Sale {
  id            String      @id @default(cuid())
  customerId    String?
  customer      Customer?   @relation(fields: [customerId], references: [id])
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  paymentMethod PaymentMethod
  items         SaleItem[]
  total         Decimal     @db.Decimal(10, 2)
  discount      Decimal     @default(0) @db.Decimal(10, 2)
  status        SaleStatus @default(COMPLETED)
  createdAt     DateTime    @default(now())
}

// Planos de assinatura
model Plan {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  features    Json
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

### Enums

```prisma
enum Role {
  ADMIN
  USER
}

enum Category {
  FRAME
  LENS
  ACCESSORY
  SOLUTION
  OTHER
}

enum OrderStatus {
  PENDING
  IN_PRODUCTION
  READY
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  CASH
  CARD
  PIX
  BOLETO
}

enum SaleStatus {
  PENDING
  COMPLETED
  CANCELLED
  REFUNDED
}
```

---

## 🌐 API Routes

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/[...nextauth]` | * | Handler NextAuth |
| `/api/create-payment` | POST | Cria pagamento Mercado Pago |
| `/api/orders` | GET/POST | Lista/cria pedidos |
| `/api/orders/update` | PUT | Atualiza pedido |
| `/api/pix` | POST | Gera QR Code PIX |

---

## 🔑 Variáveis de Ambiente

### `.env` (Banco de dados)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/optigestao?schema=public"
```

### `.env.local` (OAuth & Pagamentos)
```env
# Google OAuth
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
NEXTAUTH_SECRET="gerar-com-openssl"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_ACCESS_TOKEN="seu-access-token"
```

---

## 🎨 Tema

O sistema suporta tema claro e escuro com as seguintes variáveis CSS:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #ffffff;
  --bg-hover: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --accent-primary: #3b82f6;
  --accent-hover: #2563eb;
  --border-color: #e2e8f0;
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --bg-hover: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent-primary: #3b82f6;
  --border-color: #334155;
}
```

---

## 📱 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm run start

# Lint
npm run lint

# Gerar cliente Prisma
npx prisma generate

# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Seed do banco
npm run seed
```

---

## 📄 Licença

MIT License - Feito com Next.js 16 + Prisma + Tailwind CSS
