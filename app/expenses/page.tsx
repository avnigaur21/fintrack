import type { Metadata } from "next"
import { ExpensesPage } from "@/components/expenses-page"

export const metadata: Metadata = {
  title: "Expense Tracking - FinTrack",
  description: "Track and analyze your expenses",
}

export default function ExpensesRoute() {
  return <ExpensesPage />
}

