"use client";

import { useState, useTransition, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ShoppingCart, Plus, Minus, Trash2, CreditCard,
    Banknote, Smartphone, CheckCircle, Package,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createSale } from "@/lib/actions/sales";

type Product = {
    id: string; name: string; category: string; price: number; stock: number; color: string;
};
type Client = {
    id: string; name: string; email: string;
};
type CartItem = Product & { quantity: number };

const paymentMethods = [
    { id: "pix", label: "Pix", icon: Smartphone },
    { id: "cartao", label: "Cartão", icon: CreditCard },
    { id: "dinheiro", label: "Dinheiro", icon: Banknote },
];

function formatCurrency(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PdvClient({ products, clients, role }: { products: Product[]; clients: Client[]; role: string }) {
    const isViewer = role === "viewer";
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [payment, setPayment] = useState("pix");
    const [selectedClient, setSelectedClient] = useState("");
    const [isPending, startTransition] = useTransition();
    const [showSuccess, setShowSuccess] = useState(false);
    const { toast } = useToast();

    const filteredProducts = useMemo(() => products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0
    ), [products, search]);

    const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0), [cart]);
    const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

    function addToCart(product: Product) {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    // Schedule toast outside of setState updater
                    setTimeout(() => toast("Estoque insuficiente", "warning"), 0);
                    return prev;
                }
                return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    }

    function updateQuantity(id: string, delta: number) {
        setCart((prev) =>
            prev
                .map((i) => {
                    if (i.id !== id) return i;
                    const newQty = i.quantity + delta;
                    if (newQty > i.stock) {
                        toast("Estoque insuficiente", "warning");
                        return i;
                    }
                    return { ...i, quantity: newQty };
                })
                .filter((i) => i.quantity > 0)
        );
    }

    function removeFromCart(id: string) {
        setCart((prev) => prev.filter((i) => i.id !== id));
    }

    function handleFinish() {
        if (cart.length === 0) {
            toast("Carrinho vazio", "error");
            return;
        }
        startTransition(async () => {
            await createSale({
                clientId: selectedClient || null,
                paymentMethod: payment,
                items: cart.map((i) => ({
                    productId: i.id,
                    quantity: i.quantity,
                    price: Number(i.price),
                })),
            });
            setCart([]);
            setSelectedClient("");
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        });
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-semibold tracking-tight text-brand-purple sm:text-3xl">
                    Nova Venda
                </h1>
                <p className="mt-1 text-sm text-foreground/50">
                    Selecione os produtos e finalize a venda
                </p>
                {isViewer && (
                    <p className="mt-2 text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 rounded-xl inline-block">
                        🔒 Modo demonstração — somente visualização
                    </p>
                )}
            </motion.div>

            <div className="grid gap-6 xl:grid-cols-3">
                {/* Product Catalog */}
                <div className="space-y-4 xl:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
                        <Input
                            placeholder="Buscar produto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product, i) => {
                            const inCart = cart.find((c) => c.id === product.id);
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    <Card
                                        hover
                                        className={`cursor-pointer transition-all ${inCart ? "ring-2 ring-brand-purple" : ""} ${isViewer ? "pointer-events-none opacity-70" : ""}`}
                                        onClick={() => !isViewer && addToCart(product)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: product.color + "20" }}>
                                                        <Package className="h-5 w-5" style={{ color: product.color }} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{product.name}</p>
                                                        <p className="text-xs text-foreground/40">{product.category}</p>
                                                    </div>
                                                </div>
                                                {inCart && (
                                                    <Badge variant="purple">{inCart.quantity}</Badge>
                                                )}
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <p className="text-lg font-bold text-brand-purple">
                                                    {formatCurrency(Number(product.price))}
                                                </p>
                                                <p className="text-xs text-foreground/40">{product.stock} un.</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full flex flex-col items-center py-12">
                                <Package className="h-10 w-10 text-foreground/20" />
                                <p className="mt-3 text-sm font-medium text-foreground/40">Nenhum produto encontrado</p>
                                <p className="mt-1 text-xs text-foreground/30">Tente buscar por outro nome</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="sticky top-20">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-sky/30">
                                    <ShoppingCart className="h-[18px] w-[18px] text-blue-600" />
                                </div>
                                <CardTitle>
                                    Carrinho
                                    {cartCount > 0 && (
                                        <span className="ml-2 text-sm font-normal text-foreground/50">
                                            ({cartCount} {cartCount === 1 ? "item" : "itens"})
                                        </span>
                                    )}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Client selector */}
                            <div>
                                <label htmlFor="client-select" className="mb-1 block text-xs font-medium text-foreground/60">Cliente (opcional)</label>
                                <select
                                    id="client-select"
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                    className="flex h-10 w-full appearance-none rounded-2xl border border-border-glass bg-surface px-3 pr-8 text-sm text-foreground transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                                >
                                    <option value="">Cliente avulso</option>
                                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            {/* Cart Items */}
                            <div className="max-h-64 space-y-2 overflow-y-auto">
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center gap-3 rounded-xl bg-surface border border-foreground/5 px-3 py-2"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-foreground/40">{formatCurrency(Number(item.price))}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} aria-label="Diminuir quantidade" className="rounded-lg p-2 text-foreground/40 hover:bg-brand-lilac/15 hover:text-brand-purple transition-colors">
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} aria-label="Aumentar quantidade" className="rounded-lg p-2 text-foreground/40 hover:bg-brand-lilac/15 hover:text-brand-purple transition-colors">
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-semibold w-20 text-right">
                                                {formatCurrency(Number(item.price) * item.quantity)}
                                            </p>
                                            <button onClick={() => removeFromCart(item.id)} aria-label="Remover item" className="rounded-lg p-2 text-foreground/30 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-950/30 transition-colors">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {cart.length === 0 && (
                                    <p className="py-8 text-center text-sm text-foreground/30">
                                        Carrinho vazio
                                    </p>
                                )}
                            </div>

                            {/* Payment Method */}
                            {cart.length > 0 && (
                                <>
                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-foreground/60">Pagamento</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {paymentMethods.map((m) => {
                                                const Icon = m.icon;
                                                return (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => setPayment(m.id)}
                                                        className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-all ${payment === m.id
                                                            ? "bg-brand-purple text-white shadow-md"
                                                            : "bg-surface border border-foreground/5 text-foreground/60 hover:border-brand-lilac/30"
                                                            }`}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                        {m.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Total + Finish */}
                                    <div className="border-t border-foreground/5 pt-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-sm font-medium text-foreground/60">Total</span>
                                            <span className="text-2xl font-bold text-brand-purple">
                                                {formatCurrency(cartTotal)}
                                            </span>
                                        </div>
                                        <Button onClick={handleFinish} disabled={isPending || isViewer} className="w-full">
                                            {isPending ? "Processando..." : isViewer ? "🔒 Somente Visualização" : "Finalizar Venda"}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Success Animation */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="flex flex-col items-center gap-4 rounded-3xl bg-surface-elevated p-10 shadow-2xl"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <CheckCircle className="h-16 w-16 text-emerald-500" />
                            </motion.div>
                            <h2 className="text-xl font-bold">Venda Realizada!</h2>
                            <p className="text-sm text-foreground/50">A venda foi registrada com sucesso</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
