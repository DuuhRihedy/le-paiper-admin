import { Metadata } from "next";
import { requireAuth } from "@/lib/auth-guard";
import { getProducts } from "@/lib/actions/products";
import { InventarioClient } from "./inventario-client";

export const metadata: Metadata = {
    title: "Inventário | Le Paiper Admin",
    description: "Gerenciamento de produtos e estoque da papelaria Le Paiper",
};


export default async function InventarioPage() {
    await requireAuth();
    const products = await getProducts();
    return <InventarioClient products={products} />;
}
