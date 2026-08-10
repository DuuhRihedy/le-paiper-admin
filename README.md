# 📊 Le Paiper Admin — ERP & Gestão Comercial (PDV)

Sistema ERP e Painel Administrativo de Ponto de Venda (PDV) desenvolvido para a gestão operacional e financeira do estabelecimento **Le Paiper** (papelaria e serviços gráficos).

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![Next-Auth](https://img.shields.io/badge/Next_Auth-v5-purple?style=flat-square)

---

## 🎯 Sobre o Projeto

O **Le Paiper Admin** é a solução central para controle de caixa, vendas e estoque do Le Paiper. O sistema simplifica o atendimento no balcão através de um módulo de PDV ágil, além de fornecer aos gestores métricas detalhadas sobre faturamento, curva de produtos mais vendidos e cadastro de clientes.

---

## ✨ Funcionalidades Principais

- 🛒 **Ponto de Venda - PDV (`/pdv`):** Interface otimizada para registro rápido de vendas, seleção de produtos, aplicação de descontos e emissão de comprovantes.
- 📦 **Controle de Inventário & Estoque (`/inventario`):** Gestão de entradas, saídas, alertas de produtos com estoque baixo e precificação.
- 👥 **Gestão de Clientes (`/clientes`):** Base de dados de clientes com histórico de compras e informações de contato.
- 📈 **Relatórios & Analytics (`/relatorios`):** Gráficos interativos construídos com `Recharts` para análise de faturamento diário, mensal e desempenho por categoria.
- 🔒 **Autenticação & Permissões:** Controle de acesso seguro por rotas via `Next-Auth` (v5) e senhas criptografadas com `bcryptjs`.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Componentes & Estilização:** Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-select`), Tailwind CSS v4, Lucide Icons
- **Visualização de Dados & Animações:** Recharts, Framer Motion
- **Backend & Database:** Node.js, Prisma ORM, PostgreSQL

---

## 🚀 Como Executar o Projeto Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/DuuhRihedy/le-paiper-admin.git
cd le-paiper-admin

# 2. Instale as dependências
npm install

# 3. Execute as migrações do banco de dados e populares dados (seed)
npx prisma generate
npm run db:seed

# 4. Inicie o servidor
npm run dev
```

Acesse em `http://localhost:3000`.
