import { requireAuth } from "@/lib/auth-guard";
import { getReportsData } from "@/lib/actions/reports";
import { RelatoriosClient } from "./relatorios-client";

export default async function RelatoriosPage() {
    await requireAuth();
    const data = await getReportsData();
    return <RelatoriosClient data={data} />;
}
