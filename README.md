# Le Paiper Admin 📦

Painel administrativo premium para a papelaria **Le Paiper** — construído com Next.js 16, Tailwind CSS v4 e Framer Motion.

## ✨ Features

| Tela | Descrição |
|------|-----------|
| **Dashboard** | KPIs de vendas, receita e alertas de estoque baixo |
| **Inventário** | CRUD de produtos com categorias, cores e níveis de estoque |
| **PDV** | Ponto de venda com carrinho, busca e múltiplos métodos de pagamento |
| **Clientes** | Gestão de clientes com tiers de fidelidade (Bronze/Prata/Ouro) |
| **Relatórios** | Gráficos de receita, vendas por categoria, métodos de pagamento e top produtos |
| **Configurações** | Perfil, dados da loja, notificações, aparência e segurança |
| **Login** | Tela de autenticação com glassmorphism e animações |

### Extras
- 🌙 **Dark Mode** — toggle com persistência e detecção do sistema
- 🔔 **Notificações** — dropdown animado com badge de contagem
- 🍞 **Toasts** — feedback visual em 4 variantes (success/error/warning/info)
- 💀 **Skeletons** — loading states durante transições de rota
- 🚫 **404** — página customizada com animações

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables semânticas
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Components**: Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

Acesse [http://localhost:3000](http://localhost:3000) após `npm run dev`.

## 📁 Estrutura

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── inventario/page.tsx   # Inventário
│   ├── pdv/page.tsx          # Ponto de Venda
│   ├── clientes/page.tsx     # Clientes
│   ├── relatorios/page.tsx   # Relatórios
│   ├── configuracoes/page.tsx # Configurações
│   ├── login/page.tsx        # Login
│   ├── not-found.tsx         # 404
│   ├── loading.tsx           # Loading skeleton
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Design tokens
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx       # Navegação lateral
│   │   ├── header.tsx        # Topbar com breadcrumb
│   │   └── dashboard-layout.tsx
│   ├── ui/                   # Componentes base (Button, Card, Input, etc.)
│   ├── theme-provider.tsx    # Dark mode context
│   └── theme-toggle.tsx      # Toggle animado
└── lib/
    └── cn.ts                 # Utility classnames
```

## 📝 License

MIT
