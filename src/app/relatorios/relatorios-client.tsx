"use client";

import { motion } from "framer-motion";
import {
    DollarSign, ShoppingBag, TrendingUp, Users,
    BarChart3, Package,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

type ReportsData = {
    kpis: { revenue: number; sales: number; avgTicket: number; clients: number };
    dailyRevenue: { date: string; revenue: number; cost: number }[];
    salesByCategory: { category: string; count: number }[];
    paymentMethods: { method: string; count: number }[];
    topProducts: { name: string; quantity: number; revenue: number }[];
};

const COLORS = ["#8B5CF6", "#EC4899", "#14B8A6", "#F59E0B", "#6366F1", "#06B6D4"];

const PAYMENT_LABELS: Record<string, string> = {
    pix: "Pix", cartao: "Cartão", dinheiro: "Dinheiro",
};

function formatCurrency(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
};

export function RelatoriosClient({ data }: { data: ReportsData }) {
    const kpiCards = [
        { title: "Receita Total", value: formatCurrency(data.kpis.revenue), icon: DollarSign, iconBg: "bg-brand-mint/30", iconColor: "text-emerald-600" },
        { title: "Total de Vendas", value: String(data.kpis.sales), icon: ShoppingBag, iconBg: "bg-brand-sky/30", iconColor: "text-blue-600" },
        { title: "Ticket Médio", value: formatCurrency(data.kpis.avgTicket), icon: TrendingUp, iconBg: "bg-brand-lilac/20", iconColor: "text-brand-purple" },
        { title: "Clientes Ativos", value: String(data.kpis.clients), icon: Users, iconBg: "bg-brand-pink/20", iconColor: "text-pink-600" },
    ];

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-semibold tracking-tight text-brand-purple sm:text-3xl">Relatórios</h1>
                <p className="mt-1 text-sm text-foreground/50">Análise de desempenho dos últimos 30 dias</p>
            </motion.div>

            {/* KPIs */}
            <motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
                {kpiCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <motion.div key={card.title} variants={cardVariants}>
                            <Card hover>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-foreground/60">{card.title}</CardTitle>
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                                            <Icon className={`h-[18px] w-[18px] ${card.iconColor}`} />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 xl:grid-cols-2">
                {/* Revenue Area Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-mint/30">
                                    <TrendingUp className="h-[18px] w-[18px] text-emerald-600" />
                                </div>
                                <CardTitle>Receita Diária</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.dailyRevenue}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
                                        <Tooltip formatter={(v) => formatCurrency(Number(v))} labelFormatter={(l) => `Data: ${l}`} />
                                        <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="url(#colorRevenue)" strokeWidth={2} name="Receita" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Sales by Category Bar Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-sky/30">
                                    <BarChart3 className="h-[18px] w-[18px] text-blue-600" />
                                </div>
                                <CardTitle>Vendas por Categoria</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.salesByCategory}>
                                        <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Bar dataKey="count" name="Vendas" radius={[8, 8, 0, 0]}>
                                            {data.salesByCategory.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-6 xl:grid-cols-2">
                {/* Payment Methods Donut */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Métodos de Pagamento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-64 items-center justify-center gap-8">
                                <ResponsiveContainer width="50%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.paymentMethods}
                                            dataKey="count"
                                            nameKey="method"
                                            cx="50%" cy="50%"
                                            innerRadius={50} outerRadius={80}
                                            paddingAngle={5}
                                        >
                                            {data.paymentMethods.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v, name) => [v, PAYMENT_LABELS[String(name)] || name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-3">
                                    {data.paymentMethods.map((pm, i) => (
                                        <div key={pm.method} className="flex items-center gap-3">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-sm">
                                                {PAYMENT_LABELS[pm.method] || pm.method}
                                            </span>
                                            <span className="text-sm font-semibold">{pm.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Top Products */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-lilac/20">
                                    <Package className="h-[18px] w-[18px] text-brand-purple" />
                                </div>
                                <CardTitle>Top Produtos</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.topProducts.map((product, i) => {
                                    const maxRevenue = data.topProducts[0]?.revenue || 1;
                                    const width = (product.revenue / maxRevenue) * 100;
                                    return (
                                        <div key={product.name} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">{product.name}</span>
                                                <span className="text-foreground/50">
                                                    {formatCurrency(product.revenue)} · {product.quantity} un.
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${width}%` }}
                                                    transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
