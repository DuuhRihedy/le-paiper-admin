"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronRight, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

const breadcrumbMap: Record<string, string> = {
    "/": "Dashboard",
    "/inventario": "Inventário",
    "/pdv": "Nova Venda",
    "/clientes": "Clientes",
    "/relatorios": "Relatórios",
    "/configuracoes": "Configurações",
};

const mockNotifications = [
    { id: 1, text: "Caderno Kraft A5 com estoque baixo (2 un.)", time: "5 min", unread: true },
    { id: 2, text: "Nova venda de R$ 189,70 — Maria Silva", time: "12 min", unread: true },
    { id: 3, text: "Washi Tape Floral atingiu estoque mínimo", time: "1h", unread: false },
    { id: 4, text: "Pedro Santos atingiu o tier Ouro!", time: "3h", unread: false },
];

export function Header() {
    const pathname = usePathname();
    const [notifOpen, setNotifOpen] = useState(false);
    const unreadCount = mockNotifications.filter((n) => n.unread).length;

    const currentPage = breadcrumbMap[pathname] || "Página";

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-surface/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <LayoutDashboard className="h-4 w-4 text-foreground/30" />
                <span className="text-foreground/30 hidden sm:inline">Le Paiper</span>
                <ChevronRight className="h-3 w-3 text-foreground/20 hidden sm:inline" />
                <span className="font-medium text-foreground/70">{currentPage}</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
                <ThemeToggle />

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-foreground/60 transition-colors hover:bg-brand-lilac/15 hover:text-brand-purple"
                        aria-label="Notificações"
                    >
                        <Bell className="h-[18px] w-[18px]" />
                        {unreadCount > 0 && (
                            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-[9px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {notifOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-40"
                                    onClick={() => setNotifOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated shadow-xl"
                                >
                                    <div className="border-b border-foreground/5 px-4 py-3">
                                        <p className="text-sm font-semibold">Notificações</p>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        {mockNotifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`flex items-start gap-3 border-b border-foreground/5 px-4 py-3 last:border-0 transition-colors hover:bg-foreground/[0.02] ${n.unread ? "bg-brand-lilac/5" : ""
                                                    }`}
                                            >
                                                {n.unread && (
                                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-purple" />
                                                )}
                                                <div className={n.unread ? "" : "pl-5"}>
                                                    <p className="text-sm text-foreground/70">{n.text}</p>
                                                    <p className="mt-0.5 text-xs text-foreground/30">{n.time} atrás</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Avatar */}
                <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-brand-lilac/10">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink text-xs font-bold text-white">
                        LP
                    </div>
                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-medium leading-tight">Le Paiper</p>
                        <p className="text-[11px] text-foreground/40">Admin</p>
                    </div>
                </button>
            </div>
        </header>
    );
}
