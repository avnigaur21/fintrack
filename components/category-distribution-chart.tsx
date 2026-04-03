"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const categoryData = [
  { name: "Food", amount: 10187, color: "#22c55e", percent: 25 },
  { name: "Housing", amount: 12500, color: "#3b82f6", percent: 31 },
  { name: "Entertainment", amount: 6625, color: "#a855f7", percent: 16 },
  { name: "Shopping", amount: 3200, color: "#ec4899", percent: 8 },
  { name: "Transportation", amount: 2825, color: "#eab308", percent: 7 },
  { name: "Health", amount: 2800, color: "#ef4444", percent: 7 },
  { name: "Utilities", amount: 2799, color: "#6366f1", percent: 6 },
].sort((a, b) => b.amount - a.amount)

const categoryColors: Record<string, string> = {
  Food: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Housing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Transportation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Utilities: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  Shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  Health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function CategoryDistributionChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-8">
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#888888" opacity={0.1} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              fontSize={12}
              width={100}
              tick={{ fill: "currentColor", opacity: 0.7 }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
                      <p className="font-bold">{payload[0].payload.name}</p>
                      <p className="text-muted-foreground">{formatCurrency(payload[0].value as number)}</p>
                      <p className="text-primary font-medium">{payload[0].payload.percent}% of total</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryData.map((item) => (
          <Card key={item.name} className="dashboard-card bg-muted/10 border-none shadow-sm hover:bg-muted/20 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Badge variant="secondary" className={cn("w-fit font-normal text-[10px]", categoryColors[item.name])}>
                  {item.name}
                </Badge>
                <span className="text-lg font-bold">{formatCurrency(item.amount)}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-muted-foreground">{item.percent}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
