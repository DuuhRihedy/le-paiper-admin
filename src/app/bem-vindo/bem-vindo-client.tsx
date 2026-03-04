"use client";

import Link from "next/link";
import { ShoppingCart, Users, Package } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
    {
        href: "/pdv",
        label: "Nova Venda",
        description: "Registrar uma venda no PDV",
        icon: ShoppingCart,
        color: "from-brand-purple to-brand-pink",
    },
    {
        href: "/clientes",
        label: "Clientes",
        description: "Consultar e gerenciar clientes",
        icon: Users,
        color: "from-brand-purple to-brand-lilac",
    },
    {
        href: "/inventario",
        label: "Inventário",
        description: "Ver produtos e estoque",
        icon: Package,
        color: "from-brand-pink to-brand-purple",
    },
];

export function BemVindoClient() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Bem-vindo ao Le Paiper
                </h1>
                <p className="mt-2 text-foreground/60">
                    Acesse as funcionalidades disponíveis abaixo.
                </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quickLinks.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                        >
                            <Link
                                href={item.href}
                                className="group flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-elevated p-6 transition-all duration-200 hover:shadow-lg hover:border-brand-lilac/40"
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold group-hover:text-brand-purple transition-colors">
                                        {item.label}
                                    </h2>
                                    <p className="mt-1 text-sm text-foreground/50">
                                        {item.description}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
