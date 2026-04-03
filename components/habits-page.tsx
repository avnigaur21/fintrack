"use client"

import { useState, useEffect } from "react"
import { FinancialHabitScore } from "@/components/financial-habit-score"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

const efficiencyData = [
  { name: "Food", score: 85, change: 17, color: "#22c55e" },
  { name: "Housing", score: 95, change: 8, color: "#22c55e" },
  { name: "Transportation", score: 60, change: 0, color: "#f59e0b" },
  { name: "Entertainment", score: 40, change: -35, color: "#ef4444" },
  { name: "Shopping", score: 75, change: 12, color: "#22c55e" },
  { name: "Utilities", score: 90, change: 5, color: "#22c55e" },
]

const improvementTips = [
  { 
    id: "entertainment", 
    category: "Entertainment", 
    icon: "🎬", 
    priority: "Action Needed", 
    priorityType: "error", 
    text: "Your spending in this category has increased by 35% compared to last month. Consider setting a specific entertainment budget and tracking each expense manually to identify non-essential subscriptions." 
  },
  { 
    id: "food", 
    category: "Food", 
    icon: "🍔", 
    priority: "Keep it up", 
    priorityType: "success", 
    text: "Great job reducing food expenses! Your meal planning strategy is working perfectly. Continue cooking at home to maintain this positive trend and consider bulk-buying non-perishables." 
  },
  { 
    id: "transport", 
    category: "Transportation", 
    icon: "🚗", 
    priority: "Suggestion", 
    priorityType: "info", 
    text: "Your transportation costs are consistent, but there's room for optimization. Consider carpooling or using public transport during peak hours to further reduce fuel and parking expenses." 
  },
  { 
    id: "overall", 
    category: "Overall", 
    icon: "📈", 
    priority: "Suggestion", 
    priorityType: "info", 
    text: "Set up automatic transfers to your savings account on payday. This 'pay yourself first' mentality ensures you're consistently building wealth before daily expenses take over." 
  },
]

export function HabitsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({
    entertainment: true
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTip = (id: string) => {
    setExpandedTips(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="container mx-auto py-6 space-y-6 page-enter">
      <h1 className="text-3xl font-bold">Financial Habits Analysis</h1>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Financial Habits Comparison</CardTitle>
          <CardDescription>Compare your current month's spending habits with the previous month</CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialHabitScore detailed />
        </CardContent>
      </Card>

      {/* FIX 3 — SECTION HEADER */}
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-2xl font-bold">Detailed Analysis</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-muted cursor-pointer hover:bg-muted transition-colors">
          <span className="text-sm font-medium">This Month</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* FIX 1 — SPENDING EFFICIENCY CARD */}
        <Card className="flex flex-col h-full bg-background/50 backdrop-blur-sm border-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Spending Efficiency</CardTitle>
            <CardDescription>How efficiently you're spending in each category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[13px] font-medium text-muted-foreground">Overall efficiency</span>
                <span className="text-2xl font-black text-green-500">74%</span>
              </div>
              <Progress value={isMounted ? 74 : 0} className="h-2.5 bg-muted/30" indicatorClassName="bg-green-500" />
            </div>

            <div className="flex justify-end pr-1 -mt-2 mb-2">
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">↑ ↓ → change vs last month</span>
            </div>

            <div className="space-y-4 pt-2">
              {efficiencyData.map((habit) => (
                <div key={habit.name} className="flex flex-col mb-3 group last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]" style={{ 
                        backgroundColor: habit.score >= 70 ? "#22c55e" : habit.score >= 40 ? "#f59e0b" : "#ef4444" 
                      }} />
                      <span className="text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity">{habit.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black w-8 text-right">{habit.score}%</span>
                      <span className={cn(
                        "text-[10px] font-bold w-16 text-right",
                        habit.change > 0 ? "text-green-500" : habit.change < 0 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {habit.change === 0 ? "→ Stable" : `${habit.change > 0 ? "↑ +" : "↓ "}${habit.change}%`}
                      </span>
                    </div>
                  </div>
                  <Progress value={isMounted ? habit.score : 0} className="h-1.5 bg-muted/20" indicatorClassName={cn(
                    habit.score >= 70 ? "bg-green-500" : habit.score >= 40 ? "bg-yellow-500" : "bg-red-500"
                  )} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FIX 2 — IMPROVEMENT TIPS CARD */}
        <Card className="flex flex-col h-full bg-background/50 backdrop-blur-sm border-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Improvement Tips</CardTitle>
            <CardDescription>AI-generated suggestions to improve your financial habits</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {improvementTips.map((tip) => (
                <div 
                  key={tip.id} 
                  className={cn(
                    "relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer group",
                    expandedTips[tip.id] ? "bg-muted/30 border-muted-foreground/20" : "bg-muted/10 border-transparent hover:bg-muted/20"
                  )}
                  onClick={() => toggleTip(tip.id)}
                >
                  <div className="p-4 pr-12">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{tip.icon}</span>
                      <span className="font-bold text-sm tracking-tight">{tip.category}</span>
                    </div>
                    
                    <p className={cn(
                      "text-sm text-muted-foreground transition-all duration-300 leading-relaxed",
                      expandedTips[tip.id] ? "line-clamp-none" : "line-clamp-1"
                    )}>
                      {tip.text}
                    </p>

                    {/* Priority Badge */}
                    <div className="absolute top-4 right-10">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[9px] uppercase font-black px-2 py-0.5 rounded-full",
                          tip.priorityType === 'error' && "bg-red-500/10 text-red-500 border border-red-500/20",
                          tip.priorityType === 'success' && "bg-green-500/10 text-green-500 border border-green-500/20",
                          tip.priorityType === 'info' && "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        )}
                      >
                        {tip.priority === 'Action Needed' && <AlertTriangle className="mr-1 h-2.5 w-2.5 inline" />}
                        {tip.priority === 'Keep it up' && <CheckCircle2 className="mr-1 h-2.5 w-2.5 inline" />}
                        {tip.priority === 'Suggestion' && <Lightbulb className="mr-1 h-2.5 w-2.5 inline" />}
                        {tip.priority}
                      </Badge>
                    </div>

                    <div className="absolute top-1/2 -translate-y-1/2 right-3 opacity-30 group-hover:opacity-100 transition-opacity">
                      {expandedTips[tip.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

