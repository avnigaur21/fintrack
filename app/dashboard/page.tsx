import type { Metadata } from "next"
import { DashboardPage } from "@/components/dashboard-page"

export const metadata: Metadata = {
  title: "Dashboard - FinTrack",
  description: "Your financial overview dashboard",
}

export default function Dashboard() {
  return <DashboardPage />
}

