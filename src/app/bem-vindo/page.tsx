import { requireRouteAccess } from "@/lib/auth-guard";
import { BemVindoClient } from "./bem-vindo-client";

export default async function BemVindoPage() {
    await requireRouteAccess("/bem-vindo");
    return <BemVindoClient />;
}
