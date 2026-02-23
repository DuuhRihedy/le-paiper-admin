"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    AlertTriangle,
    X,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "@/components/theme-provider";
import { updateSettings, changePassword } from "@/lib/actions/settings";

/* ─── Section Nav ─── */
const sections = [
    { id: "loja", label: "Loja", icon: Store },
    { id: "perfil", label: "Perfil", icon: User },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "aparencia", label: "Aparência", icon: Palette },
    { id: "seguranca", label: "Segurança", icon: Shield },
] as const;

type SectionId = (typeof sections)[number]["id"];

/* ─── Default settings keys ─── */
const SETTINGS_KEYS = {
    storeName: "store_name",
    storeCnpj: "store_cnpj",
    storePhone: "store_phone",
    storeEmail: "store_email",
    storeAddress: "store_address",
    storeHours: "store_hours",
    profileName: "profile_name",
    profileEmail: "profile_email",
    profileRole: "profile_role",
    profilePhone: "profile_phone",
    notifEmail: "notif_email",
    notifEstoque: "notif_estoque",
    notifVendas: "notif_vendas",
} as const;

/* ─── Animation ─── */
const fadeIn = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
};

interface Props {
    role?: string;
    settings?: Record<string, string>;
}

export function ConfiguracoesClient({ role = "admin", settings = {} }: Props) {
    const isViewer = role === "viewer";
    const [activeSection, setActiveSection] = useState<SectionId>("loja");
    const { toast } = useToast();
    const { theme, toggleTheme } = useTheme();
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    /* ─── Password State ─── */
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [pwError, setPwError] = useState("");
    const [isChangingPw, setIsChangingPw] = useState(false);

    /* ─── Form State (initialized from DB settings or defaults) ─── */
    const [form, setForm] = useState({
        storeName: settings[SETTINGS_KEYS.storeName] ?? "Le Paiper",
        storeCnpj: settings[SETTINGS_KEYS.storeCnpj] ?? "12.345.678/0001-90",
        storePhone: settings[SETTINGS_KEYS.storePhone] ?? "(11) 3456-7890",
        storeEmail: settings[SETTINGS_KEYS.storeEmail] ?? "contato@lepaiper.com",
        storeAddress: settings[SETTINGS_KEYS.storeAddress] ?? "Rua das Flores, 123 — São Paulo, SP",
        storeHours: settings[SETTINGS_KEYS.storeHours] ?? "09:00 — 18:00",
        profileName: settings[SETTINGS_KEYS.profileName] ?? "Le Paiper Admin",
        profileEmail: settings[SETTINGS_KEYS.profileEmail] ?? "admin@lepaiper.com",
        profileRole: settings[SETTINGS_KEYS.profileRole] ?? "Administrador",
        profilePhone: settings[SETTINGS_KEYS.profilePhone] ?? "(11) 98765-4321",
    });

    /* Notification toggles */
    const [notifEmail, setNotifEmail] = useState(settings[SETTINGS_KEYS.notifEmail] !== "false");
    const [notifEstoque, setNotifEstoque] = useState(settings[SETTINGS_KEYS.notifEstoque] !== "false");
    const [notifVendas, setNotifVendas] = useState(settings[SETTINGS_KEYS.notifVendas] === "true");

    function updateField(key: keyof typeof form, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleSaveClick() {
        if (isViewer) return;
        setShowConfirm(true);
    }

    function handleConfirmSave() {
        setShowConfirm(false);
        startTransition(async () => {
            try {
                const entries = [
                    ...Object.entries(SETTINGS_KEYS)
                        .filter(([k]) => k in form)
                        .map(([k, dbKey]) => ({ key: dbKey, value: form[k as keyof typeof form] })),
                    { key: SETTINGS_KEYS.notifEmail, value: String(notifEmail) },
                    { key: SETTINGS_KEYS.notifEstoque, value: String(notifEstoque) },
                    { key: SETTINGS_KEYS.notifVendas, value: String(notifVendas) },
                ];
                await updateSettings(entries);
                toast("Configurações salvas com sucesso!", "success");
            } catch {
                toast("Erro ao salvar configurações", "error");
            }
        });
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
                {isViewer && (
                    <p className="mt-2 text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 rounded-xl inline-block">
                        ⚠️ Modo demonstração — alterações não são salvas
                    </p>
                )}
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
                                            <Input value={form.storeName} onChange={(e) => updateField("storeName", e.target.value)} disabled={isViewer} />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">CNPJ</label>
                                            <Input value={form.storeCnpj} onChange={(e) => updateField("storeCnpj", e.target.value)} disabled={isViewer} />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="h-3 w-3" /> Telefone
                                                </div>
                                            </label>
                                            <Input value={form.storePhone} onChange={(e) => updateField("storePhone", e.target.value)} disabled={isViewer} />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="h-3 w-3" /> Email
                                                </div>
                                            </label>
                                            <Input value={form.storeEmail} onChange={(e) => updateField("storeEmail", e.target.value)} disabled={isViewer} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3 w-3" /> Endereço
                                            </div>
                                        </label>
                                        <Input value={form.storeAddress} onChange={(e) => updateField("storeAddress", e.target.value)} disabled={isViewer} />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" /> Horário de Funcionamento
                                                </div>
                                            </label>
                                            <Input value={form.storeHours} onChange={(e) => updateField("storeHours", e.target.value)} disabled={isViewer} />
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
                                            <p className="font-semibold">{form.profileName}</p>
                                            <p className="text-sm text-foreground/50">{form.profileEmail}</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Nome</label>
                                            <Input value={form.profileName} onChange={(e) => updateField("profileName", e.target.value)} disabled={isViewer} />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Email</label>
                                            <Input type="email" value={form.profileEmail} onChange={(e) => updateField("profileEmail", e.target.value)} disabled={isViewer} />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Cargo</label>
                                            <Input value={form.profileRole} onChange={(e) => updateField("profileRole", e.target.value)} disabled={isViewer} />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Telefone</label>
                                            <Input value={form.profilePhone} onChange={(e) => updateField("profilePhone", e.target.value)} disabled={isViewer} />
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
                                                role="switch"
                                                aria-checked={item.state}
                                                aria-label={item.label}
                                                disabled={isViewer}
                                                onClick={() => item.toggle(!item.state)}
                                                className={`relative h-6 w-11 rounded-full transition-colors ${isViewer ? "opacity-50 cursor-not-allowed" : ""} ${item.state ? "bg-brand-purple" : "bg-foreground/15"
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
                                        Alterar Senha
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-foreground/60">Senha Atual</label>
                                        <div className="relative">
                                            <Input
                                                type={showCurrentPw ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={currentPassword}
                                                onChange={(e) => { setCurrentPassword(e.target.value); setPwError(""); }}
                                                disabled={isViewer}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPw(!showCurrentPw)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                                                tabIndex={-1}
                                            >
                                                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Nova Senha</label>
                                            <div className="relative">
                                                <Input
                                                    type={showNewPw ? "text" : "password"}
                                                    placeholder="Mínimo 8 caracteres"
                                                    value={newPassword}
                                                    onChange={(e) => { setNewPassword(e.target.value); setPwError(""); }}
                                                    disabled={isViewer}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPw(!showNewPw)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                                                    tabIndex={-1}
                                                >
                                                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {newPassword.length > 0 && newPassword.length < 8 && (
                                                <p className="mt-1 text-xs text-red-500">Mínimo 8 caracteres</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">Confirmar Nova Senha</label>
                                            <Input
                                                type="password"
                                                placeholder="Repita a nova senha"
                                                value={confirmPasswordVal}
                                                onChange={(e) => { setConfirmPasswordVal(e.target.value); setPwError(""); }}
                                                disabled={isViewer}
                                            />
                                            {confirmPasswordVal.length > 0 && confirmPasswordVal !== newPassword && (
                                                <p className="mt-1 text-xs text-red-500">As senhas não coincidem</p>
                                            )}
                                        </div>
                                    </div>

                                    {pwError && (
                                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">
                                            {pwError}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-xs text-foreground/30">
                                            Use uma senha forte com letras, números e símbolos
                                        </p>
                                        <Button
                                            onClick={async () => {
                                                if (!currentPassword || !newPassword || !confirmPasswordVal) {
                                                    setPwError("Preencha todos os campos");
                                                    return;
                                                }
                                                if (newPassword.length < 8) {
                                                    setPwError("A nova senha deve ter no mínimo 8 caracteres");
                                                    return;
                                                }
                                                if (newPassword !== confirmPasswordVal) {
                                                    setPwError("As senhas não coincidem");
                                                    return;
                                                }
                                                setIsChangingPw(true);
                                                setPwError("");
                                                try {
                                                    await changePassword(currentPassword, newPassword, confirmPasswordVal);
                                                    toast("Senha alterada com sucesso!", "success");
                                                    setCurrentPassword("");
                                                    setNewPassword("");
                                                    setConfirmPasswordVal("");
                                                } catch (err) {
                                                    const msg = err instanceof Error ? err.message : "Erro ao alterar senha";
                                                    setPwError(msg);
                                                    toast(msg, "error");
                                                } finally {
                                                    setIsChangingPw(false);
                                                }
                                            }}
                                            disabled={isViewer || isChangingPw || !currentPassword || !newPassword || !confirmPasswordVal}
                                            className={isViewer ? "opacity-50 cursor-not-allowed" : ""}
                                        >
                                            <Lock className="h-4 w-4" />
                                            {isChangingPw ? "Alterando..." : "Alterar Senha"}
                                        </Button>
                                    </div>
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
                        <Button
                            onClick={handleSaveClick}
                            disabled={isViewer || isPending}
                            className={isViewer ? "opacity-50 cursor-not-allowed" : ""}
                        >
                            <Save className="h-4 w-4" />
                            {isPending ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Confirmation Popup */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowConfirm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">Confirmar Alterações</h3>
                                    <p className="mt-1 text-sm text-foreground/60">
                                        As alterações serão <strong>permanentes</strong> e aplicadas imediatamente ao sistema. Deseja continuar?
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="rounded-xl p-1 text-foreground/40 hover:bg-foreground/5 hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="rounded-2xl px-4 py-2 text-sm font-medium text-foreground/60 hover:bg-foreground/5"
                                >
                                    Cancelar
                                </button>
                                <Button onClick={handleConfirmSave} disabled={isPending}>
                                    <Save className="h-4 w-4" />
                                    {isPending ? "Salvando..." : "Confirmar e Salvar"}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
