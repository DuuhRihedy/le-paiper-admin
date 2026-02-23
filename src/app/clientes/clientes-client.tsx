"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Users, X, Crown, Award, Medal, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createClient, updateClient, deleteClient } from "@/lib/actions/clients";

type Client = {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalSpent: number;
    totalOrders: number;
    lastPurchase: Date | null;
    joinDate: Date;
};

function getTier(totalSpent: number) {
    if (totalSpent >= 2000) return { name: "Ouro", icon: Crown, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" };
    if (totalSpent >= 1000) return { name: "Prata", icon: Award, color: "text-slate-400", bg: "bg-slate-100 dark:bg-slate-900/30" };
    return { name: "Bronze", icon: Medal, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" };
}

function formatCurrency(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const emptyForm = { name: "", email: "", phone: "" };

export function ClientesClient({ clients, role }: { clients: Client[]; role: string }) {
    const isViewer = role === "viewer";
    const [search, setSearch] = useState("");
    const [tierFilter, setTierFilter] = useState("Todos");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const filtered = clients.filter((c) => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
        const matchTier = tierFilter === "Todos" || getTier(c.totalSpent).name === tierFilter;
        return matchSearch && matchTier;
    });

    // Summary stats
    const totalClients = clients.length;
    const goldClients = clients.filter((c) => c.totalSpent >= 2000).length;
    const totalRevenue = clients.reduce((acc, c) => acc + c.totalSpent, 0);

    function openEdit(client: Client) {
        setForm({ name: client.name, email: client.email, phone: client.phone });
        setEditingId(client.id);
        setShowForm(true);
    }

    function openNew() {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
    }

    function handleSave() {
        if (!form.name.trim() || !form.email.trim()) {
            toast("Preencha nome e email", "error");
            return;
        }
        startTransition(async () => {
            if (editingId) {
                await updateClient(editingId, form);
                toast("Cliente atualizado!", "success");
            } else {
                await createClient(form);
                toast("Cliente cadastrado!", "success");
            }
            setShowForm(false);
            setEditingId(null);
        });
    }

    function confirmDelete(client: Client) {
        setDeleteConfirm({ id: client.id, name: client.name });
    }

    function handleDelete() {
        if (!deleteConfirm) return;
        startTransition(async () => {
            const result = await deleteClient(deleteConfirm.id);
            if (result?.error) {
                toast(result.error, "error");
            } else {
                toast("Cliente removido", "info");
            }
            setDeleteConfirm(null);
        });
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-brand-purple sm:text-3xl">Clientes</h1>
                    <p className="mt-1 text-sm text-foreground/50">{totalClients} clientes cadastrados</p>
                </div>
                {!isViewer && <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Novo Cliente</Button>}
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
                {[
                    { label: "Total", value: totalClients, icon: Users, bg: "bg-brand-sky/30", color: "text-blue-600" },
                    { label: "Clientes Ouro", value: goldClients, icon: Crown, bg: "bg-amber-100 dark:bg-amber-900/30", color: "text-amber-500" },
                    { label: "Receita Total", value: formatCurrency(totalRevenue), icon: Award, bg: "bg-brand-mint/30", color: "text-emerald-600" },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label}>
                            <CardContent className="flex items-center gap-3 py-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-foreground/50">{stat.label}</p>
                                    <p className="text-lg font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </motion.div>

            {/* Search + Filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
                    <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
                <div className="flex gap-2">
                    {["Todos", "Ouro", "Prata", "Bronze"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTierFilter(t)}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${tierFilter === t ? "bg-brand-purple text-white shadow-md" : "bg-surface text-foreground/60 hover:bg-brand-lilac/10"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-foreground/5">
                                    <th className="px-4 py-3 text-left font-medium text-foreground/50">Cliente</th>
                                    <th className="px-4 py-3 text-left font-medium text-foreground/50">Tier</th>
                                    <th className="px-4 py-3 text-right font-medium text-foreground/50">Gasto Total</th>
                                    <th className="px-4 py-3 text-center font-medium text-foreground/50">Pedidos</th>
                                    {!isViewer && <th className="px-4 py-3 text-right font-medium text-foreground/50">Ações</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((client, i) => {
                                    const tier = getTier(client.totalSpent);
                                    const TierIcon = tier.icon;
                                    return (
                                        <motion.tr
                                            key={client.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-foreground/5 last:border-0"
                                        >
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium">{client.name}</p>
                                                    <p className="text-xs text-foreground/40">{client.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${tier.bg} ${tier.color}`}>
                                                    <TierIcon className="h-3 w-3" />
                                                    {tier.name}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(client.totalSpent)}</td>
                                            <td className="px-4 py-3 text-center">{client.totalOrders}</td>
                                            {!isViewer && (
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button onClick={() => openEdit(client)} className="rounded-lg p-2 text-foreground/40 hover:bg-brand-lilac/10 hover:text-brand-purple">
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => confirmDelete(client)} disabled={isPending} className="rounded-lg p-2 text-foreground/40 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-950">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </motion.tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={isViewer ? 4 : 5} className="px-4 py-12 text-center">
                                            <Users className="mx-auto mb-3 h-10 w-10 text-foreground/20" />
                                            <p className="text-sm font-medium text-foreground/40">Nenhum cliente encontrado</p>
                                            <p className="mt-1 text-xs text-foreground/30">Tente alterar os filtros ou buscar por outro nome</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-x-4 top-[15%] z-50 mx-auto max-w-md rounded-2xl border border-border-glass bg-surface-elevated p-6 shadow-2xl sm:inset-x-auto">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">{editingId ? "Editar Cliente" : "Novo Cliente"}</h2>
                                <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-foreground/40 hover:text-foreground"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-foreground/60">Nome</label>
                                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-foreground/60">Email</label>
                                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-foreground/60">Telefone</label>
                                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Cancelar</Button>
                                <Button onClick={handleSave} disabled={isPending} className="flex-1">{isPending ? "Salvando..." : "Salvar"}</Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Popup de Confirmação de Exclusão */}
            <AnimatePresence>
                {deleteConfirm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                            onClick={() => setDeleteConfirm(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 top-[25%] z-50 mx-auto max-w-sm rounded-2xl border border-border-glass bg-surface-elevated p-6 shadow-2xl sm:inset-x-auto"
                        >
                            <div className="mb-4 flex flex-col items-center gap-3 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
                                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h2 className="text-lg font-semibold">Excluir Cliente</h2>
                                <p className="text-sm text-foreground/60">
                                    Deseja realmente excluir <strong>{deleteConfirm.name}</strong>? Esta ação não pode ser desfeita.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1">
                                    Cancelar
                                </Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={isPending} className="flex-1">
                                    {isPending ? "Excluindo..." : "Excluir"}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
