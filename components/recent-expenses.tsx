"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle, ArrowDown, ArrowUp, Search, X, Download, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useRole } from "@/components/role-context"

// Sample data
const initialExpenses = [
  { id: 1, date: new Date("2024-03-28"), description: "Grocery Shopping", category: "Food", type: "expense", amount: 85.42 },
  { id: 2, date: new Date("2024-03-25"), description: "Monthly Rent", category: "Housing", type: "expense", amount: 250.00 },
  { id: 3, date: new Date("2024-03-27"), description: "Petrol", category: "Transportation", type: "expense", amount: 25.00 },
  { id: 4, date: new Date("2024-03-26"), description: "Netflix Subscription", category: "Entertainment", type: "expense", amount: 6.49 },
  { id: 5, date: new Date("2024-03-28"), description: "Chai and Snacks", category: "Food", type: "expense", amount: 2.50 },
  { id: 6, date: new Date("2024-03-01"), description: "Monthly Salary", category: "Income", type: "income", amount: 45000 },
  { id: 7, date: new Date("2024-03-10"), description: "Freelance Payment", category: "Income", type: "income", amount: 12000 },
  { id: 8, date: new Date("2024-03-15"), description: "Electricity Bill", category: "Utilities", type: "expense", amount: 1800 },
  { id: 9, date: new Date("2024-03-18"), description: "Amazon Shopping", category: "Shopping", type: "expense", amount: 3200 },
  { id: 10, date: new Date("2024-03-20"), description: "Gym Membership", category: "Health", type: "expense", amount: 2000 },
  { id: 11, date: new Date("2024-03-22"), description: "Restaurant Dinner", category: "Food", type: "expense", amount: 1850 },
  { id: 12, date: new Date("2024-03-24"), description: "Spotify", category: "Entertainment", type: "expense", amount: 119 },
  { id: 13, date: new Date("2024-03-05"), description: "Internet Bill", category: "Utilities", type: "expense", amount: 999 },
  { id: 14, date: new Date("2024-03-12"), description: "Doctor Visit", category: "Health", type: "expense", amount: 800 },
  { id: 15, date: new Date("2024-03-29"), description: "Dividend Credit", category: "Income", type: "income", amount: 3400 },
]

const categoryColors: Record<string, string> = {
  Food: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Housing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Transportation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Utilities: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  Shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  Health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Income: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

export function RecentExpenses() {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [open, setOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const { role } = useRole()
  
  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: "date" | "amount"; direction: "asc" | "desc" }>({
    key: "date",
    direction: "desc",
  })

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date(),
  })

  const [editingExpense, setEditingExpense] = useState<typeof initialExpenses[0] | null>(null)

  // Filter and Sort Logic
  const filteredExpenses = expenses
    .filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
      const matchesType = typeFilter === "all" || expense.type === typeFilter
      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => {
      const aValue = sortConfig.key === "date" ? a.date.getTime() : a.amount
      const bValue = sortConfig.key === "date" ? b.date.getTime() : b.amount

      if (sortConfig.direction === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

  const toggleSort = (key: "date" | "amount") => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "desc" ? "asc" : "desc",
    })
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setTypeFilter("all")
  }

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const handleEditClick = (expense: typeof initialExpenses[0]) => {
    setEditingExpense(expense)
    setEditDialogOpen(true)
  }

  const handleUpdateExpense = () => {
    if (!editingExpense) return
    setExpenses(expenses.map((e) => (e.id === editingExpense.id ? editingExpense : e)))
    setEditDialogOpen(false)
  }
 
  const handleExportCSV = () => {
    const csvContent = [
      ["Date", "Description", "Category", "Type", "Amount"],
      ...filteredExpenses.map((t) => [
        format(t.date, "yyyy-MM-dd"),
        t.description,
        t.category,
        t.type,
        t.amount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()
  }
  // Format currency based on USD only
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) return

    setExpenses([
      {
        id: expenses.length + 1,
        description: newExpense.description,
        amount: Number.parseFloat(newExpense.amount),
        category: newExpense.category,
        type: newExpense.type as "expense" | "income",
        date: newExpense.date,
      },
      ...expenses,
    ])

    setNewExpense({
      description: "",
      amount: "",
      category: "",
      type: "expense",
      date: new Date(),
    })

    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <div className="flex gap-2">
          {role === "analyst" && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
          {role === "admin" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>Record a new expense to track your spending.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="e.g., Grocery Shopping"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("justify-start text-left font-normal", !newExpense.date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newExpense.date ? format(newExpense.date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newExpense.date}
                          onSelect={(date) => setNewExpense({ ...newExpense, date: date || new Date() })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddExpense}>Add Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 py-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9 bg-background dark:bg-muted/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px] bg-background dark:bg-muted/50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Housing">Housing</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Utilities">Utilities</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px] bg-background dark:bg-muted/50">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Headers */}
      <div className="hidden border-b pb-2 lg:grid lg:grid-cols-7 lg:gap-4 lg:px-3 text-sm font-medium text-muted-foreground">
        <div className="col-span-2 cursor-pointer hover:text-foreground flex items-center gap-1">
          Description
        </div>
        <div 
          className="col-span-1 cursor-pointer hover:text-foreground flex items-center gap-1 transition-colors"
          onClick={() => toggleSort("date")}
        >
          Date {sortConfig.key === "date" && (sortConfig.direction === "desc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
        </div>
        <div className="col-span-1">Category</div>
        <div className="col-span-1 text-center">Type</div>
        <div 
          className="col-span-1 cursor-pointer hover:text-foreground flex items-center justify-end gap-1.5 transition-colors group px-1 rounded-sm hover:bg-muted/50"
          onClick={() => toggleSort("amount")}
        >
          <span className="group-hover:mr-0.5 transition-all">Amount</span> 
          <div className="flex flex-col -space-y-1 opacity-50 group-hover:opacity-100 transition-opacity">
            {sortConfig.key === "amount" ? (
              sortConfig.direction === "desc" ? <ArrowDown className="h-3.5 w-3.5 text-primary" /> : <ArrowUp className="h-3.5 w-3.5 text-primary" />
            ) : (
              <div className="flex flex-col -space-y-1">
                <ArrowUp className="h-2.5 w-2.5" />
                <ArrowDown className="h-2.5 w-2.5" />
              </div>
            )}
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>

      <div className="space-y-2">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense, index) => (
            <div 
              key={expense.id} 
              className="transaction-row flex flex-col gap-3 md:grid md:grid-cols-7 md:gap-4 md:items-center p-3 rounded-lg hover:bg-muted/50 transition-colors border-b border-muted last:border-0"
              style={{ animationDelay: `${Math.min(index, 10) * 0.05}s` }}
            >
              {/* Description & Amount (Amount hidden on desktop in this div) */}
              <div className="md:col-span-2 flex justify-between items-start md:flex-col md:justify-center">
                <div className="flex flex-col">
                  <span className="font-medium text-sm md:text-base leading-tight">{expense.description}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{format(expense.date, "MMM d, yyyy")}</span>
                </div>
                <div className={cn(
                  "md:hidden font-bold text-sm whitespace-nowrap flex items-center gap-0.5",
                  expense.type === "income" ? "text-emerald-500" : "text-foreground"
                )}>
                  <span>{expense.type === "income" ? " + " : "-"}</span>
                  <span>{formatCurrency(expense.amount)}</span>
                </div>
              </div>

              {/* Desktop Date (Hidden on mobile) */}
              <div className="hidden md:block md:col-span-1 text-sm text-muted-foreground">
                {format(expense.date, "MMM d, yyyy")}
              </div>

              {/* Category Badge */}
              <div className="flex items-center gap-2 md:col-span-1">
                <Badge variant="secondary" className={cn("font-normal text-[10px] md:text-xs px-2 whitespace-nowrap", categoryColors[expense.category])}>
                  {expense.category}
                </Badge>
              </div>

              {/* Type Badge & Desktop Amount */}
              <div className="flex items-center justify-between md:col-span-2 md:grid md:grid-cols-2 md:gap-4 md:items-center">
                <div className="flex justify-center md:col-span-1">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[9px] md:text-[10px] uppercase font-bold px-1.5 py-0.5 tracking-wider",
                      expense.type === "income" 
                        ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/5" 
                        : "text-red-500 border-red-500/30 bg-red-500/5"
                    )}
                  >
                    {expense.type}
                  </Badge>
                </div>
                <div className={cn(
                  "hidden md:flex col-span-1 items-center justify-end font-bold transition-colors whitespace-nowrap gap-0.5",
                  expense.type === "income" ? "text-emerald-500" : "text-foreground"
                )}>
                  <span>{expense.type === "income" ? " + " : "-"}</span>
                  <span>{formatCurrency(expense.amount)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-start md:justify-end gap-2 md:col-span-1 border-t md:border-0 pt-2 md:pt-0 pb-1 md:pb-0">
                {role === "admin" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-blue-500/50 text-blue-500 hover:bg-blue-500/10 transition-colors shadow-sm"
                      onClick={() => handleEditClick(expense)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors shadow-sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {role !== "admin" && (
                  <div className="h-8 w-8 md:hidden" /> /* Spacing for mobile layout */
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="text-4xl">🔍</div>
            <div className="space-y-1">
              <p className="text-lg font-medium">No transactions match your filters</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilters}
              className="text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {editingExpense && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>Modify the details of this transaction.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingExpense.description}
                  onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-amount">Amount (₹)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={editingExpense.amount}
                  onChange={(e) => setEditingExpense({ ...editingExpense, amount: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingExpense.category}
                  onValueChange={(value) => setEditingExpense({ ...editingExpense, category: value })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                  value={editingExpense.type}
                  onValueChange={(value: "income" | "expense") => setEditingExpense({ ...editingExpense, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !editingExpense.date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingExpense.date ? format(editingExpense.date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingExpense.date}
                      onSelect={(date) => setEditingExpense({ ...editingExpense, date: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateExpense}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
