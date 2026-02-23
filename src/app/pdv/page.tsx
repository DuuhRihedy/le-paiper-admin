import { Metadata } from "next";
import { requireAuth, getUserRole } from "@/lib/auth-guard";
import { getProducts } from "@/lib/actions/products";
import { getClients } from "@/lib/actions/clients";
import { PdvClient } from "./pdv-client";

export const metadata: Metadata = {
    title: "Ponto de Venda | Le Paiper Admin",
    description: "Sistema de vendas e PDV da papelaria Le Paiper",
};

export default async function PdvPage() {
    await requireAuth();
    const [products, clients, role] = await Promise.all([getProducts(), getClients(), getUserRole()]);
    return <PdvClient products={products} clients={clients} role={role ?? "admin"} />;
}
