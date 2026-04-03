"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { BadgeDollarSign, Goal, PiggyBank, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseChart } from "@/components/expense-chart"
import { BalanceTrendChart } from "@/components/balance-trend-chart"
import { GoalsList } from "@/components/goals-list"
import { RecentExpenses } from "@/components/recent-expenses"
import { FinancialHabitScore } from "@/components/financial-habit-score"
import { NotificationManager } from "@/components/notification-manager"
import { cn } from "@/lib/utils"
import { useCountUp } from "@/hooks/use-count-up"

export function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  // Handle tab from URL
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["overview", "goals", "expenses", "habits"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Update the formatCurrency function to use INR
  // Format currency based on INR only
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const habitScore = 78
  const totalSavings = 455000
  const monthlyExpenses = 235000
  const activeGoalsCount = 3

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Track your financial health and habits</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="overview" className="relative overflow-hidden group">
              <span className="relative z-10">Overview</span>
              <span className="absolute inset-0 bg-primary/10 scale-0 group-data-[state=active]:scale-100 transition-transform duration-300 rounded-md"></span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="relative overflow-hidden group">
              <span className="relative z-10">Goals</span>
              <span className="absolute inset-0 bg-primary/10 scale-0 group-data-[state=active]:scale-100 transition-transform duration-300 rounded-md"></span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="relative overflow-hidden group">
              <span className="relative z-10">Expenses</span>
              <span className="absolute inset-0 bg-primary/10 scale-0 group-data-[state=active]:scale-100 transition-transform duration-300 rounded-md"></span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="relative overflow-hidden group">
              <span className="relative z-10">Habits</span>
              <span className="absolute inset-0 bg-primary/10 scale-0 group-data-[state=active]:scale-100 transition-transform duration-300 rounded-md"></span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                  <PiggyBank className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      "text-2xl font-bold transition-all duration-500",
                      isLoading ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {isLoading ? "..." : formatCurrency(totalSavings)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-500">+20.1%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                  <BadgeDollarSign className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      "text-2xl font-bold transition-all duration-500",
                      isLoading ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {isLoading ? "..." : formatCurrency(monthlyExpenses)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-500">-5.2%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                  <Goal className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      "text-2xl font-bold transition-all duration-500",
                      isLoading ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {isLoading ? "..." : activeGoalsCount}
                  </div>
                  <p className="text-xs text-muted-foreground">1 goal near completion</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Habit Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      "text-2xl font-bold transition-all duration-500",
                      isLoading ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {isLoading ? "..." : `${habitScore}/100`}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-500">+12</span> points from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4 border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <CardTitle>Financial Analytics</CardTitle>
                  <CardDescription>Switch between your spending overview and balance trends</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="spending" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                      <TabsTrigger value="spending">Spending Overview</TabsTrigger>
                      <TabsTrigger value="trend">Balance Trend</TabsTrigger>
                    </TabsList>
                    <TabsContent value="spending" className="space-y-4 pt-4">
                      <ExpenseChart />
                    </TabsContent>
                    <TabsContent value="trend" className="space-y-4 pt-4">
                      <BalanceTrendChart />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
 
              <Card className="col-span-full lg:col-span-3 border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <CardTitle>Goal Progress</CardTitle>
                  <CardDescription>Your top financial goals</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Vacation Fund</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(250000)} / {formatCurrency(500000)}
                        </div>
                      </div>
                      <Progress value={50} className="h-2 bg-green-100 dark:bg-green-900">
                        <div className="h-full bg-green-500 transition-all duration-500"></div>
                      </Progress>
                      <div className="text-xs text-muted-foreground">50% complete • 3 months left</div>
                    </div>
 
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">New Laptop</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(120000)} / {formatCurrency(150000)}
                        </div>
                      </div>
                      <Progress value={80} className="h-2 bg-blue-100 dark:bg-blue-900">
                        <div className="h-full bg-blue-500 transition-all duration-500"></div>
                      </Progress>
                      <div className="text-xs text-muted-foreground">80% complete • 1 month left</div>
                    </div>
 
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Emergency Fund</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(85000)} / {formatCurrency(1000000)}
                        </div>
                      </div>
                      <Progress value={8.5} className="h-2 bg-amber-100 dark:bg-amber-900">
                        <div className="h-full bg-amber-500 transition-all duration-500"></div>
                      </Progress>
                      <div className="text-xs text-muted-foreground">8.5% complete • Ongoing</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
 
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4 border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>Your latest transactions</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <RecentExpenses />
                </CardContent>
              </Card>
 
              <Card className="col-span-full lg:col-span-3 border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
                  <CardTitle>Financial Habits</CardTitle>
                  <CardDescription>This month vs. last month</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <FinancialHabitScore />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <NotificationManager />
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardTitle>Financial Goals</CardTitle>
                <CardDescription>Track and manage your savings goals</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <GoalsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
                <CardTitle>Expense Tracking</CardTitle>
                <CardDescription>Monitor your spending across categories</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ExpenseChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="habits" className="space-y-4">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
                <CardTitle>Financial Habits Analysis</CardTitle>
                <CardDescription>AI-powered comparison of your spending habits</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <FinancialHabitScore detailed />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

