import { requireRouteAccess, getUserRole } from "@/lib/auth-guard";
import { getDashboardData } from "@/lib/actions/dashboard";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  await requireRouteAccess("/");
  const [data, role] = await Promise.all([getDashboardData(), getUserRole()]);
  return <DashboardClient data={data} role={role ?? "admin"} />;
}
