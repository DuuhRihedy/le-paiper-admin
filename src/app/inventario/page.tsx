import { Metadata } from "next";
import { requireAuth, getUserRole } from "@/lib/auth-guard";
import { getProducts } from "@/lib/actions/products";
import { InventarioClient } from "./inventario-client";

export const metadata: Metadata = {
    title: "Inventário | Le Paiper Admin",
    description: "Gerenciamento de produtos e estoque da papelaria Le Paiper",
};

export default async function InventarioPage() {
    await requireAuth();
    const [products, role] = await Promise.all([getProducts(), getUserRole()]);
    return <InventarioClient products={products} role={role ?? "admin"} />;
}
