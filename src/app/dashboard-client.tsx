"use client";

import {
    DollarSign,
    ShoppingBag,
    Users,
    AlertTriangle,
    TrendingUp,
    CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DashboardData = {
    revenue: number;
    totalSales: number;
    avgTicket: number;
    newClients: number;
    lowStock: { id: string; name: string; stock: number; minStock: number }[];
    recentSales: {
        id: string;
        total: number;
        paymentMethod: string;
        clientName: string | null;
        clientDeleted: boolean;
        createdAt: Date;
        client: { name: string } | null;
        items: {
            id: string;
            quantity: number;
            price: number;
            productName: string | null;
            productDeleted: boolean;
            product: { name: string } | null;
        }[];
    }[];
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
};

function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function timeAgo(date: Date | string) {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "agora";
    if (diffMin < 60) return `há ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `há ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    return `há ${diffD}d`;
}

export function DashboardClient({ data, role }: { data: DashboardData; role: string }) {
    const summaryCards = [
        {
            title: "Faturamento",
            value: formatCurrency(data.revenue),
            change: "últimos 30 dias",
            icon: DollarSign,
            iconBg: "bg-brand-mint/30",
            iconColor: "text-emerald-600",
        },
        {
            title: "Vendas",
            value: String(data.totalSales),
            change: "últimos 30 dias",
            icon: ShoppingBag,
            iconBg: "bg-brand-sky/30",
            iconColor: "text-blue-600",
        },
        {
            title: "Ticket Médio",
            value: formatCurrency(data.avgTicket),
            change: "por venda",
            icon: TrendingUp,
            iconBg: "bg-brand-lilac/20",
            iconColor: "text-brand-purple",
        },
        {
            title: "Estoque Baixo",
            value: String(data.lowStock.length),
            change: data.lowStock.length > 0 ? "Atenção" : "Tudo ok",
            icon: AlertTriangle,
            iconBg: "bg-brand-pink/20",
            iconColor: "text-pink-600",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-semibold tracking-tight text-brand-purple sm:text-3xl">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-foreground/50">
                    Visão geral da sua papelaria premium
                </p>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {summaryCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <motion.div key={card.title} variants={cardVariants}>
                            <Card hover>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-foreground/60">
                                            {card.title}
                                        </CardTitle>
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                                            <Icon className={`h-[18px] w-[18px] ${card.iconColor}`} />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                                    <p className={`mt-1 text-xs ${card.change === "Atenção" ? "text-pink-600" : "text-foreground/50"
                                        }`}>
                                        {card.change}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Low Stock + Recent Sales */}
            <div className="grid gap-6 xl:grid-cols-2">
                {/* Low Stock Alert */}
                {data.lowStock.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-pink/20">
                                        <AlertTriangle className="h-[18px] w-[18px] text-pink-600" />
                                    </div>
                                    <div>
                                        <CardTitle>Alerta de Estoque</CardTitle>
                                        <p className="text-sm text-foreground/50">
                                            Produtos abaixo do mínimo
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {data.lowStock.map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + i * 0.05 }}
                                            className="flex items-center justify-between rounded-xl border border-foreground/5 px-4 py-2.5"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-foreground/40">
                                                    Mínimo: {item.minStock} un.
                                                </p>
                                            </div>
                                            <Badge variant={item.stock === 0 ? "pink" : "mint"}>
                                                {item.stock === 0 ? "Esgotado" : `${item.stock} un.`}
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Empty Low Stock */}
                {data.lowStock.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-mint/30">
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                </div>
                                <p className="mt-3 text-sm font-medium text-foreground/60">Estoque em dia!</p>
                                <p className="mt-1 text-xs text-foreground/40">Todos os produtos acima do mínimo</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Recent Sales */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-sky/30">
                                    <ShoppingBag className="h-[18px] w-[18px] text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle>Vendas Recentes</CardTitle>
                                    <p className="text-sm text-foreground/50">
                                        Últimas transações
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.recentSales.length === 0 && (
                                    <div className="flex flex-col items-center py-8">
                                        <ShoppingBag className="h-10 w-10 text-foreground/20" />
                                        <p className="mt-3 text-sm text-foreground/40">Nenhuma venda recente</p>
                                    </div>
                                )}
                                {data.recentSales.map((sale, i) => (
                                    <motion.div
                                        key={sale.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + i * 0.05 }}
                                        className="flex items-center justify-between rounded-xl border border-foreground/5 px-4 py-2.5"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {sale.clientDeleted
                                                    ? <span className="text-foreground/40 italic">{sale.clientName} (excluído)</span>
                                                    : sale.client?.name || "Cliente avulso"}
                                            </p>
                                            <p className="text-xs text-foreground/40">
                                                {sale.items.map(i => i.product?.name || <span key={i.productName} className="italic">{i.productName} (excluído)</span>).reduce((acc: React.ReactNode[], curr, idx) => idx === 0 ? [curr] : [...acc, ", ", curr], [] as React.ReactNode[])}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-emerald-600">
                                                {formatCurrency(sale.total)}
                                            </p>
                                            <p className="text-xs text-foreground/30">
                                                {sale.paymentMethod.toUpperCase()} · {timeAgo(sale.createdAt)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
