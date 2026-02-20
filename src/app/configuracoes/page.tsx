"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Store,
    Bell,
    Palette,
    Shield,
    Save,
    Mail,
    Phone,
    MapPin,
    Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "@/components/theme-provider";

/* ─── Section Nav ─── */
const sections = [
    { id: "loja", label: "Loja", icon: Store },
    { id: "perfil", label: "Perfil", icon: User },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "aparencia", label: "Aparência", icon: Palette },
    { id: "seguranca", label: "Segurança", icon: Shield },
] as const;

type SectionId = (typeof sections)[number]["id"];

/* ─── Animation ─── */
const fadeIn = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
};

export default function ConfiguracoesPage() {
    const [activeSection, setActiveSection] = useState<SectionId>("loja");
    const { toast } = useToast();
    const { theme, toggleTheme } = useTheme();

    /* Notification toggles */
    const [notifEmail, setNotifEmail] = useState(true);
    const [notifEstoque, setNotifEstoque] = useState(true);
    const [notifVendas, setNotifVendas] = useState(false);

    function handleSave() {
        toast("Configurações salvas com sucesso!", "success");
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-semibold tracking-tight text-brand-purple sm:text-3xl">
                    Configurações
                </h1>
                <p className="mt-1 text-sm text-foreground/50">
                    Personalize sua experiência no Le Paiper Admin
                </p>
            </motion.div>

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Section Nav */}
                <motion.nav
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-1 overflow-x-auto lg:w-52 lg:shrink-0 lg:flex-col"
                >
                    {sections.map((s) => {
                        const Icon = s.icon;
                        return (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`flex items-center gap-2.5 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-medium transition-all ${activeSection === s.id
                                        ? "bg-brand-lilac/25 text-brand-purple shadow-sm"
                                        : "text-foreground/60 hover:bg-brand-lilac/10 hover:text-brand-purple"
                                    }`}
                            >
                                <Icon className="h-[18px] w-[18px] shrink-0" />
                                <span>{s.label}</span>
                            </button>
                        );
                    })}
                </motion.nav>

                {/* Content */}
                <div className="flex-1 space-y-4">
                    {/* Loja */}
                    {activeSection === "loja" && (
                        <motion.div {...fadeIn} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Store className="h-5 w-5 text-brand-purple" />
                                        Dados da Loja
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Nome da Loja</label>
                                            <Input defaultValue="Le Paiper" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">CNPJ</label>
                                            <Input defaultValue="12.345.678/0001-90" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="h-3 w-3" /> Telefone
                                                </div>
                                            </label>
                                            <Input defaultValue="(11) 3456-7890" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="h-3 w-3" /> Email
                                                </div>
                                            </label>
                                            <Input defaultValue="contato@lepaiper.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3 w-3" /> Endereço
                                            </div>
                                        </label>
                                        <Input defaultValue="Rua das Flores, 123 — São Paulo, SP" />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" /> Horário de Funcionamento
                                                </div>
                                            </label>
                                            <Input defaultValue="09:00 — 18:00" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Moeda</label>
                                            <Input defaultValue="BRL (R$)" disabled />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Perfil */}
                    {activeSection === "perfil" && (
                        <motion.div {...fadeIn} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-brand-purple" />
                                        Seu Perfil
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink text-xl font-bold text-white">
                                            LP
                                        </div>
                                        <div>
                                            <p className="font-semibold">Administrador</p>
                                            <p className="text-sm text-foreground/50">admin@lepaiper.com</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Nome</label>
                                            <Input defaultValue="Le Paiper Admin" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Email</label>
                                            <Input type="email" defaultValue="admin@lepaiper.com" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Cargo</label>
                                            <Input defaultValue="Administrador" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Telefone</label>
                                            <Input defaultValue="(11) 98765-4321" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Notificações */}
                    {activeSection === "notificacoes" && (
                        <motion.div {...fadeIn} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5 text-brand-purple" />
                                        Preferências de Notificação
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { label: "Notificações por email", desc: "Receber resumo diário de vendas", state: notifEmail, toggle: setNotifEmail },
                                        { label: "Alertas de estoque baixo", desc: "Avisar quando produtos atingirem o mínimo", state: notifEstoque, toggle: setNotifEstoque },
                                        { label: "Novas vendas", desc: "Notificar a cada venda realizada", state: notifVendas, toggle: setNotifVendas },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between rounded-2xl border border-foreground/5 p-4">
                                            <div>
                                                <p className="text-sm font-medium">{item.label}</p>
                                                <p className="text-xs text-foreground/40">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => item.toggle(!item.state)}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${item.state ? "bg-brand-purple" : "bg-foreground/15"
                                                    }`}
                                            >
                                                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${item.state ? "left-[22px]" : "left-0.5"
                                                    }`} />
                                            </button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Aparência */}
                    {activeSection === "aparencia" && (
                        <motion.div {...fadeIn} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5 text-brand-purple" />
                                        Aparência
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <p className="text-sm font-medium">Tema</p>
                                        <p className="mb-3 text-xs text-foreground/40">Escolha entre modo claro e escuro</p>
                                        <div className="flex gap-3">
                                            {(["light", "dark"] as const).map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => { if (theme !== t) toggleTheme(); }}
                                                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${theme === t
                                                            ? "border-brand-purple bg-brand-lilac/10 shadow-sm"
                                                            : "border-foreground/10 hover:border-foreground/20"
                                                        }`}
                                                >
                                                    <div className={`h-16 w-24 rounded-xl border ${t === "light"
                                                            ? "border-gray-200 bg-white"
                                                            : "border-gray-700 bg-gray-900"
                                                        }`}>
                                                        <div className={`mx-2 mt-2 h-2 w-12 rounded ${t === "light" ? "bg-gray-200" : "bg-gray-700"}`} />
                                                        <div className={`mx-2 mt-1 h-2 w-8 rounded ${t === "light" ? "bg-gray-100" : "bg-gray-800"}`} />
                                                    </div>
                                                    <span className="text-xs font-medium">
                                                        {t === "light" ? "Claro" : "Escuro"}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Segurança */}
                    {activeSection === "seguranca" && (
                        <motion.div {...fadeIn} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-brand-purple" />
                                        Segurança
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-foreground/60">Senha Atual</label>
                                        <Input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Nova Senha</label>
                                            <Input type="password" placeholder="Mínimo 8 caracteres" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Confirmar Nova Senha</label>
                                            <Input type="password" placeholder="Repita a nova senha" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-foreground/30">
                                        Última alteração de senha: 15/01/2026
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Save Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-end pt-2"
                    >
                        <Button onClick={handleSave}>
                            <Save className="h-4 w-4" />
                            Salvar Alterações
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
