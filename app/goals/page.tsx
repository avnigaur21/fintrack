import type { Metadata } from "next"
import { GoalsList } from "@/components/goals-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Financial Goals - FinTrack",
  description: "Track and manage your financial goals",
}

export default function GoalsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Financial Goals</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Financial Goals</CardTitle>
          <CardDescription>Track and manage your savings goals to achieve financial success</CardDescription>
        </CardHeader>
        <CardContent>
          <GoalsList />
        </CardContent>
      </Card>
    </div>
  )
}

