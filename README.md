# 📊 Le Paiper Admin

Painel administrativo completo desenvolvido para gestão de dados e visualização analítica, com foco em segurança e UX avançada.

<div align="center">
  <img src="https://raw.githubusercontent.com/DuuhRihedy/DuuhRihedy/main/assets/lepaiper-placeholder.png" alt="Le Paiper Admin Demo" width="800">
</div>

<br>

<div align="center">
  ![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=flat-square)
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
</div>

## 🚀 Features

- ✅ **Dashboard Analítico:** Visualização de dados interativa com `Recharts`.
- ✅ **Autenticação:** Proteção de rotas e sessões gerenciadas pelo `Next-Auth` (v5).
- ✅ **Interface Moderna:** Componentes acessíveis com `Radix UI` e estilizados com `Tailwind CSS`.
- ✅ **Animações Fluidas:** Microinterações utilizando `Framer Motion`.
- ✅ **Gestão de Banco de Dados:** ORM `Prisma` para consultas tipadas e seguras.

## 🛠️ Tech Stack

### Frontend & UI
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

### Backend & Segurança
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Next-Auth](https://img.shields.io/badge/Next_Auth-000000?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)

## ⚡ Quick Start

### Pré-requisitos
- Node.js (v20+)
- Banco de Dados (PostgreSQL/MySQL configurado)

### Instalação

1. Clone e instale
```bash
git clone https://github.com/DuuhRihedy/le-paiper-admin.git
cd le-paiper-admin
npm install
```

2. Configure o Banco
Crie o `.env` e rode as migrations:
```bash
npx prisma generate
npm run db:seed
```

3. Inicie
```bash
npm run dev
```
Acesse `http://localhost:3000`.
