import { Metadata } from "next";
import { requireAuth, getUserRole } from "@/lib/auth-guard";
import { getProducts } from "@/lib/actions/products";
import { getClients } from "@/lib/actions/clients";
import { MOCK_PRODUCTS, MOCK_CLIENTS } from "@/lib/mock-data";
import { serialize } from "@/lib/serialize";
import { PdvClient } from "./pdv-client";

export const metadata: Metadata = {
    title: "Ponto de Venda | Le Paiper Admin",
    description: "Sistema de vendas e PDV da papelaria Le Paiper",
};

export default async function PdvPage() {
    await requireAuth();
    const role = await getUserRole();
    const isViewer = role === "viewer";

    const [products, clients] = isViewer
        ? [MOCK_PRODUCTS, MOCK_CLIENTS]
        : await Promise.all([getProducts(), getClients()]);

    return <PdvClient products={serialize(products)} clients={serialize(clients)} role={role ?? "admin"} />;
}
