import type { Metadata } from "next"
import { HabitsPage } from "@/components/habits-page"

export const metadata: Metadata = {
  title: "Financial Habits - FinTrack",
  description: "Analyze your financial habits",
}

export default function HabitsRoute() {
  return <HabitsPage />
}

