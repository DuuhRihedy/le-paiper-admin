import { requireAuth, getUserRole } from "@/lib/auth-guard";
import { getSettings } from "@/lib/actions/settings";
import { ConfiguracoesClient } from "./configuracoes-client";

export default async function ConfiguracoesPage() {
    await requireAuth();
    const role = await getUserRole();
    const settings = await getSettings();
    return <ConfiguracoesClient role={role ?? "admin"} settings={settings} />;
}
