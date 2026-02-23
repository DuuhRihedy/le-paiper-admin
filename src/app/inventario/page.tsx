import { Metadata } from "next";
import { requireAuth, getUserRole } from "@/lib/auth-guard";
import { getProducts } from "@/lib/actions/products";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { serialize } from "@/lib/serialize";
import { InventarioClient } from "./inventario-client";

export const metadata: Metadata = {
    title: "Inventário | Le Paiper Admin",
    description: "Gerenciamento de produtos e estoque da papelaria Le Paiper",
};

export default async function InventarioPage() {
    await requireAuth();
    const role = await getUserRole();
    const isViewer = role === "viewer";
    const products = isViewer ? MOCK_PRODUCTS : serialize(await getProducts());
    return <InventarioClient products={products} role={role ?? "admin"} />;
}
