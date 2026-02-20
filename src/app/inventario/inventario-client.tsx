"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Package, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions/products";

type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    color: string;
};

const categories = ["Cadernos", "Canetas", "Acessórios", "Tintas", "Papéis"];
const colors = ["#8B5CF6", "#EC4899", "#F59E0B", "#14B8A6", "#6366F1", "#06B6D4"];

const emptyForm = {
    name: "", category: "Cadernos", price: 0, cost: 0, stock: 0, minStock: 5, color: "#8B5CF6",
};

export function InventarioClient({ products }: { products: Product[] }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Todos");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "Todos" || p.category === filter;
        return matchSearch && matchFilter;
    });

    function openEdit(product: Product) {
        setForm({
            name: product.name,
            category: product.category,
            price: product.price,
            cost: product.cost,
            stock: product.stock,
            minStock: product.minStock,
            color: product.color,
        });
        setEditingId(product.id);
        setShowForm(true);
    }

    function openNew() {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
    }

    function handleSave() {
        if (!form.name.trim()) {
            toast("Preencha o nome do produto", "error");
            return;
        }

        startTransition(async () => {
            if (editingId) {
                await updateProduct(editingId, form);
                toast("Produto atualizado!", "success");
            } else {
                await createProduct(form);
                toast("Produto criado!", "success");
            }
            setShowForm(false);
            setEditingId(null);
        });
    }

    function handleDelete(id: string) {
        startTransition(async () => {
            await deleteProduct(id);
            toast("Produto removido", "info");
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
                    <h1 className="text-2xl font-semibold tracking-tight text-brand-purple sm:text-3xl">
                        Inventário
                    </h1>
                    <p className="mt-1 text-sm text-foreground/50">
                        {products.length} produtos cadastrados
                    </p>
                </div>
                <Button onClick={openNew}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Produto
                </Button>
            </motion.div>

            {/* Search + Filter */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-3 sm:flex-row"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
                    <Input
                        placeholder="Buscar produto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {["Todos", ...categories].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${filter === cat
                                    ? "bg-brand-purple text-white shadow-md"
                                    : "bg-surface text-foreground/60 hover:bg-brand-lilac/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Products Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-foreground/5">
                                    <th className="px-4 py-3 text-left font-medium text-foreground/50">Produto</th>
                                    <th className="px-4 py-3 text-left font-medium text-foreground/50">Categoria</th>
                                    <th className="px-4 py-3 text-right font-medium text-foreground/50">Preço</th>
                                    <th className="px-4 py-3 text-center font-medium text-foreground/50">Estoque</th>
                                    <th className="px-4 py-3 text-right font-medium text-foreground/50">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((product, i) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-foreground/5 last:border-0"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-8 w-8 rounded-lg"
                                                    style={{ backgroundColor: product.color + "30" }}
                                                >
                                                    <div className="flex h-full items-center justify-center">
                                                        <Package className="h-4 w-4" style={{ color: product.color }} />
                                                    </div>
                                                </div>
                                                <span className="font-medium">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-foreground/60">{product.category}</td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            R$ {product.price.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge variant={product.stock <= product.minStock ? "pink" : "mint"}>
                                                {product.stock} un.
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEdit(product)}
                                                    className="rounded-lg p-2 text-foreground/40 transition-colors hover:bg-brand-lilac/10 hover:text-brand-purple"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={isPending}
                                                    className="rounded-lg p-2 text-foreground/40 transition-colors hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-950"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                            onClick={() => setShowForm(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg rounded-2xl border border-border-glass bg-surface-elevated p-6 shadow-2xl sm:inset-x-auto"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    {editingId ? "Editar Produto" : "Novo Produto"}
                                </h2>
                                <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-foreground/40 hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-foreground/60">Nome</label>
                                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground/60">Categoria</label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            className="flex h-10 w-full rounded-2xl border border-border-glass bg-surface px-3 text-sm"
                                        >
                                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground/60">Cor</label>
                                        <div className="flex gap-2">
                                            {colors.map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => setForm({ ...form, color: c })}
                                                    className={`h-8 w-8 rounded-lg transition-all ${form.color === c ? "ring-2 ring-brand-purple ring-offset-2" : ""}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground/60">Preço (R$)</label>
                                        <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground/60">Custo (R$)</label>
                                        <Input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground/60">Estoque</label>
                                        <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-foreground/60">Estoque Mínimo</label>
                                        <Input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1">
                                    Cancelar
                                </Button>
                                <Button onClick={handleSave} disabled={isPending} className="flex-1">
                                    {isPending ? "Salvando..." : "Salvar"}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
