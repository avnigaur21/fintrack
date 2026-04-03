"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format } from "date-fns"

const balanceData = [
  { month: "Aug", balance: 45000 },
  { month: "Sep", balance: 52000 },
  { month: "Oct", balance: 48000 },
  { month: "Nov", balance: 61000 },
  { month: "Dec", balance: 55000 },
  { month: "Jan", balance: 67000 },
  { month: "Feb", balance: 72000 },
]

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 p-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 min-w-[140px]">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1.5 opacity-70">
            {label} 2024
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div 
                className="h-2 w-2 rounded-full ring-4 ring-background shadow-sm" 
                style={{ backgroundColor: payload[0].color }} 
              />
              <span className="text-xs font-medium text-muted-foreground">
                Balance
              </span>
            </div>
            <p className="text-sm font-black text-foreground tracking-tight">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(payload[0].value)}
            </p>
          </div>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-green-500/20 blur-sm rounded-full" />
      </div>
    )
  }
  return null
}

export function BalanceTrendChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={balanceData}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
          <XAxis 
            dataKey="month" 
            stroke="#888888" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={8}
            opacity={0.5}
          />
          <YAxis 
            stroke="#888888" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `₹${value / 1000}k`}
            opacity={0.5}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Area 
            type="monotone" 
            dataKey="balance" 
            name="Net Balance (₹)" 
            stroke="#22c55e" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorBalance)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
