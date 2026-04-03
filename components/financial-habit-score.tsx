"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

// Sample data for financial habits comparison
const habitScores = [
  { name: "Food", score: 85, status: "improved", color: "#22c55e" },
  { name: "Housing", score: 95, status: "improved", color: "#22c55e" },
  { name: "Transportation", score: 60, status: "neutral", color: "#eab308" },
  { name: "Entertainment", score: 40, status: "worsened", color: "#ef4444" },
  { name: "Shopping", score: 75, status: "improved", color: "#22c55e" },
  { name: "Utilities", score: 90, status: "improved", color: "#22c55e" },
]

const pieData = [
  { name: "Improved", value: 4, color: "#22c55e" },
  { name: "Neutral", value: 1, color: "#eab308" },
  { name: "Worsened", value: 1, color: "#ef4444" },
]

const statusColors: Record<string, string> = {
  improved: "text-green-600 dark:text-green-400",
  neutral: "text-yellow-600 dark:text-yellow-400",
  worsened: "text-red-600 dark:text-red-400",
}

const statusIcons: Record<string, string> = {
  improved: "↑",
  neutral: "→",
  worsened: "↓",
}

const habitColors = [
  "#6366f1", // Indigo
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f97316", // Orange
  "#22c55e", // Green
]

export function FinancialHabitScore({ detailed = false }: { detailed?: boolean }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Calculate overall score (weighted average)
  const overallScore = Math.round(habitScores.reduce((acc, habit) => acc + habit.score, 0) / habitScores.length)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">{overallScore}/100</h3>
          <p className="text-sm text-muted-foreground">Overall Financial Habit Score</p>
        </div>
        <div className="h-16 w-16">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={15} outerRadius={30} paddingAngle={2} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Progress value={isMounted ? overallScore : 0} className="h-2" />

      {!detailed && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm md:text-base text-muted-foreground bg-muted/20 p-2.5 rounded-md transition-colors hover:bg-muted/40">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Food</span>
              <span className="text-green-500">↑</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-foreground">85/100</span>
              <Progress value={isMounted ? 85 : 0} className="h-2 w-24 bg-background" />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm md:text-base text-muted-foreground bg-muted/20 p-2.5 rounded-md transition-colors hover:bg-muted/40">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Entertainment</span>
              <span className="text-red-500">↓</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-foreground">40/100</span>
              <Progress value={isMounted ? 40 : 0} className="h-2 w-24 bg-background" />
            </div>
          </div>

          <div className="pt-2">
            <Link 
              href="/habits" 
              className="text-xs font-semibold text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition-all"
            >
              View full analysis <span className="text-[14px]">→</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-muted-foreground/5 mt-2 space-y-2">
            <div className="flex justify-between text-[13px] md:text-sm text-muted-foreground">
              <span>Last month score:</span>
              <span className="font-medium">62/100</span>
            </div>
            <div className="flex justify-between text-[13px] md:text-sm text-muted-foreground">
              <span>This month score:</span>
              <div className="flex items-center gap-2 text-foreground">
                <span className="font-bold">{overallScore}/100</span>
                <span className="text-green-500 flex items-center font-bold text-[11px]">↑ +12 pts</span>
              </div>
            </div>
          </div>

          {/* Expanded Category Distribution Donut Chart */}
          <div className="relative h-[240px] w-full mt-6 pt-6 border-t border-muted-foreground/5 flex flex-col items-center">
            <div className="h-[160px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={habitScores}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="score"
                    stroke="none"
                  >
                    {habitScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={habitColors[index % habitColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total</span>
                <span className="text-2xl font-black leading-none">{overallScore}</span>
              </div>
            </div>
            
            {/* Legend with increased font size */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-1.5 w-full mt-4 px-3">
              {habitScores.map((habit, index) => (
                <div key={habit.name} className="flex items-center gap-2 overflow-hidden">
                  <div className="h-2 w-2 shadow-sm rounded-full flex-shrink-0" style={{ backgroundColor: habitColors[index] }} />
                  <span className="text-[13px] text-muted-foreground truncate font-bold uppercase tracking-normal">
                    {habit.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {detailed && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Category Breakdown</h4>
          <div className="grid gap-3">
            {habitScores.map((habit) => (
              <Card key={habit.name}>
                <CardContent className="p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm md:text-base">{habit.name}</span>
                        <span className={cn("text-sm font-bold", statusColors[habit.status])}>
                          {statusIcons[habit.status]}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={habit.score} className="h-2 w-32 bg-muted" />
                        <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">{habit.score}/100</span>
                      </div>
                    </div>
                    <div className={cn(
                      "text-[10px] md:text-xs font-bold tracking-wider px-2.5 py-1 rounded-full bg-muted/50 border border-muted w-fit sm:text-right",
                      statusColors[habit.status]
                    )}>
                      {habit.status === "improved" && "Spending more efficiently"}
                      {habit.status === "neutral" && "Similar to last month"}
                      {habit.status === "worsened" && "Spending less efficiently"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="mb-2 font-medium">AI Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Your overall financial habits have improved by 12% compared to last month. You've made significant
              progress in reducing unnecessary spending in the Food and Housing categories. However, your Entertainment
              spending has increased beyond your set budget. Consider reviewing your Entertainment expenses to identify
              areas where you can cut back.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

