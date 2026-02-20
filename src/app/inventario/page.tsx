import { requireAuth } from "@/lib/auth-guard";
import { getProducts } from "@/lib/actions/products";
import { InventarioClient } from "./inventario-client";

export default async function InventarioPage() {
    await requireAuth();
    const products = await getProducts();
    return <InventarioClient products={products} />;
}
