"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/inventario", label: "Inventário", icon: Package },
    { href: "/pdv", label: "Nova Venda", icon: ShoppingCart },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navContent = (
        <nav className="flex flex-col gap-1">
            {navItems.map((item, i) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                    <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                        <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            {...(isActive ? { "aria-current": "page" as const } : {})}
                            className={cn(
                                "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-brand-lilac/25 text-brand-purple shadow-sm"
                                    : "text-foreground/60 hover:bg-brand-lilac/10 hover:text-brand-purple"
                            )}
                        >
                            <Icon className="h-[18px] w-[18px] shrink-0" />
                            <span>{item.label}</span>
                        </Link>
                    </motion.div>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed left-4 top-4 z-50 rounded-2xl bg-surface-elevated p-2.5 shadow-sm backdrop-blur-sm lg:hidden"
                aria-label="Abrir menu"
            >
                <Menu className="h-5 w-5 text-brand-purple" />
            </button>

            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border-subtle bg-surface backdrop-blur-xl lg:flex lg:flex-col">
                <div className="flex h-16 items-center gap-3 border-b border-border-subtle px-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-purple">
                        <Package className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-brand-purple">
                        Le Paiper
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-4">{navContent}</div>
                <div className="border-t border-border-subtle px-4 py-3">
                    <p className="text-[11px] text-foreground/30">Le Paiper Admin v1.0</p>
                </div>
            </aside>

            {/* Mobile overlay sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border-subtle bg-surface-elevated backdrop-blur-xl lg:hidden"
                        >
                            <div className="flex h-16 items-center justify-between border-b border-border-subtle px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-purple">
                                        <Package className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-base font-semibold tracking-tight text-brand-purple">
                                        Le Paiper
                                    </span>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-full p-1 text-foreground/40 hover:bg-brand-lilac/20 hover:text-foreground"
                                    aria-label="Fechar menu"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="overflow-y-auto px-3 py-4">{navContent}</div>
                            <div className="absolute bottom-0 left-0 right-0 border-t border-border-subtle px-4 py-3">
                                <p className="text-[11px] text-foreground/30">v1.0</p>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
