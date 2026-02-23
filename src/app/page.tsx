import { requireAuth, getUserRole } from "@/lib/auth-guard";
import { getDashboardData } from "@/lib/actions/dashboard";
import { getMockDashboardData } from "@/lib/mock-data";
import { serialize } from "@/lib/serialize";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  await requireAuth();
  const role = await getUserRole();
  const isViewer = role === "viewer";
  const data = isViewer ? getMockDashboardData() : serialize(await getDashboardData());
  return <DashboardClient data={data} role={role ?? "admin"} />;
}
