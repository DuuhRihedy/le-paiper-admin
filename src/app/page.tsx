import { requireAuth } from "@/lib/auth-guard";
import { getDashboardData } from "@/lib/actions/dashboard";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  await requireAuth();
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
