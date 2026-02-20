import { requireAuth } from "@/lib/auth-guard";
import { getClients } from "@/lib/actions/clients";
import { ClientesClient } from "./clientes-client";

export default async function ClientesPage() {
    await requireAuth();
    const clients = await getClients();
    return <ClientesClient clients={clients} />;
}
