"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for different time frames (Earnings > Expenses)
const weeklyExpenses = [
  { name: "Mon", amount: 8500, income: 12500 },
  { name: "Tue", amount: 7200, income: 11000 },
  { name: "Wed", amount: 9800, income: 14500 },
  { name: "Thu", amount: 6500, income: 10200 },
  { name: "Fri", amount: 12000, income: 18500 },
  { name: "Sat", amount: 15000, income: 21000 },
  { name: "Sun", amount: 10500, income: 16500 },
]

const monthlyExpenses = [
  { name: "Jan", amount: 45000, income: 62000 },
  { name: "Feb", amount: 38000, income: 55000 },
  { name: "Mar", amount: 42000, income: 58000 },
  { name: "Apr", amount: 55000, income: 72000 },
  { name: "May", amount: 48000, income: 65000 },
  { name: "Jun", amount: 43000, income: 60000 },
  { name: "Jul", amount: 47000, income: 63000 },
  { name: "Aug", amount: 52000, income: 75000 },
  { name: "Sep", amount: 49000, income: 68000 },
  { name: "Oct", amount: 47000, income: 64000 },
  { name: "Nov", amount: 53000, income: 74000 },
  { name: "Dec", amount: 50000, income: 69000 },
]

const yearlyExpenses = [
  { name: "2018", amount: 420000, income: 580000 },
  { name: "2019", amount: 480000, income: 650000 },
  { name: "2020", amount: 450000, income: 610000 },
  { name: "2021", amount: 520000, income: 720000 },
  { name: "2022", amount: 580000, income: 840000 },
  { name: "2023", amount: 620000, income: 890000 },
  { name: "2024", amount: 570000, income: 810000 },
]

const categoryExpenses = [
  { name: "Food", value: 15000, color: "#8884d8" },
  { name: "Housing", value: 25000, color: "#82ca9d" },
  { name: "Transportation", value: 5000, color: "#ffc658" },
  { name: "Entertainment", value: 3500, color: "#ff8042" },
  { name: "Shopping", value: 7500, color: "#0088fe" },
  { name: "Utilities", value: 6000, color: "#00C49F" },
]

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 p-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 min-w-[160px]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-3 border-b border-border/50 pb-1.5 opacity-70">
          {label || payload[0].payload.name}
        </p>
        <div className="space-y-2.5">
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div 
                  className="h-2 w-2 rounded-full ring-4 ring-background shadow-sm" 
                  style={{ backgroundColor: item.color || item.fill }} 
                />
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                  {item.name === "amount" ? "Expenses" : (item.name === "income" ? "Earnings" : item.name)}
                </span>
              </div>
              <p className="text-xs font-black text-foreground tracking-tight">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(item.value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function ExpenseChart() {
  const [chartType, setChartType] = useState("bar")
  const [timeFrame, setTimeFrame] = useState("monthly")

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Get the appropriate data based on the selected time frame
  const getChartData = () => {
    switch (timeFrame) {
      case "weekly":
        return weeklyExpenses
      case "yearly":
        return yearlyExpenses
      case "category":
        return categoryExpenses
      case "monthly":
      default:
        return monthlyExpenses
    }
  }

  // Handle chart type change
  const handleChartTypeChange = (value: string) => {
    // If timeFrame is category, always use pie chart
    if (timeFrame === "category" && value === "bar") {
      // Do nothing, keep pie chart for category
    } else {
      setChartType(value)
    }
  }

  // Handle time frame change
  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value)
    // If changing to category view, force pie chart
    if (value === "category") {
      setChartType("pie")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select value={chartType} onValueChange={handleChartTypeChange} disabled={timeFrame === "category"}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px] w-full">
      <div className="h-[300px] w-full overflow-x-auto overflow-y-hidden pb-2 no-scrollbar">
        <div className="h-full min-w-[600px] sm:min-w-full">
          {chartType === "bar" && timeFrame !== "category" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8884d8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8884d8" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 11 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 11 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)', radius: [6, 6, 0, 0] }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="income" 
                  name="Earnings" 
                  fill="url(#incomeGradient)" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar 
                  dataKey="amount" 
                  name="Expenses" 
                  fill="url(#expenseGradient)" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

        {(chartType === "pie" || timeFrame === "category") && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={timeFrame === "category" ? categoryExpenses : getChartData()}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey={timeFrame === "category" ? "value" : "amount"}
                nameKey="name"
              >
                {timeFrame === "category"
                  ? categoryExpenses.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                  : getChartData().map((_, index) => {
                      const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F"]
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    })}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

