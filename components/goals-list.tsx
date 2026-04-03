"use client"

import { useState } from "react"
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useRole } from "@/components/role-context"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Sample data
const initialGoals = [
  {
    id: 1,
    name: "Vacation Fund",
    target: 500000,
    current: 250000,
    deadline: new Date(2024, 8, 15),
    category: "Travel",
    completed: false,
  },
  {
    id: 2,
    name: "New Laptop",
    target: 150000,
    current: 120000,
    deadline: new Date(2024, 5, 30),
    category: "Electronics",
    completed: false,
  },
  {
    id: 3,
    name: "Emergency Fund",
    target: 1000000,
    current: 85000,
    deadline: null,
    category: "Savings",
    completed: false,
  },
]

export function GoalsList() {
  const [goals, setGoals] = useState(initialGoals)
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useState(() => {
    setTimeout(() => setIsMounted(true), 100)
  })
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    current: "",
    deadline: undefined as Date | undefined,
    category: "",
  })
  const { role } = useRole()
  const [addSavingsOpen, setAddSavingsOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null)
  const [savingsAmount, setSavingsAmount] = useState("")

  // Format currency based on USD only
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.target) return

    setGoals([
      ...goals,
      {
        id: goals.length + 1,
        name: newGoal.name,
        target: Number.parseFloat(newGoal.target),
        current: Number.parseFloat(newGoal.current || "0"),
        deadline: newGoal.deadline || null,
        category: newGoal.category || "Other",
        completed: false,
      },
    ])

    setNewGoal({
      name: "",
      target: "",
      current: "",
      deadline: undefined,
      category: "",
    })

    setOpen(false)
  }

  const handleAddSavings = () => {
    if (!selectedGoal || !savingsAmount) return

    setGoals(
      goals.map((goal) => {
        if (goal.id === selectedGoal) {
          const newAmount = goal.current + Number.parseFloat(savingsAmount)
          const isCompleted = newAmount >= goal.target

          // If goal is completed, show notification
          if (isCompleted && !goal.completed) {
            // Show toast notification
            setTimeout(() => {
              toast({
                title: "Goal Completed! 🎉",
                description: `Congratulations! You've reached your goal: ${goal.name}`,
                action: (
                  <ToastAction altText="View" onClick={() => {}}>
                    View
                  </ToastAction>
                ),
              })

              // Auto-delete goal after 5 seconds if it's completed
              setTimeout(() => {
                setGoals((prevGoals) => prevGoals.filter((g) => g.id !== goal.id))
              }, 5000)
            }, 500)
          }

          return {
            ...goal,
            current: newAmount > goal.target ? goal.target : newAmount,
            completed: isCompleted,
          }
        }
        return goal
      }),
    )

    setSavingsAmount("")
    setSelectedGoal(null)
    setAddSavingsOpen(false)
  }

  const handleDeleteGoal = (goalId: number) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Your Goals</h3>
        {role === "admin" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Financial Goal</DialogTitle>
                <DialogDescription>Set a new savings goal to track your progress.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Vacation Fund"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="target">Target Amount (₹)</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="5000"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="current">Initial Savings (₹)</Label>
                    <Input
                      id="current"
                      type="number"
                      placeholder="0"
                      value={newGoal.current}
                      onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Deadline (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !newGoal.deadline && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newGoal.deadline ? format(newGoal.deadline, "PPP") : "No deadline"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newGoal.deadline}
                        onSelect={(date) => setNewGoal({ ...newGoal, deadline: date || undefined })}
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
                <Button onClick={handleCreateGoal}>Create Goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="dashboard-card overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{goal.name}</h4>
                    <p className="text-sm text-muted-foreground">{goal.category}</p>
                                    <div className="flex gap-2">
                    {role === "admin" && (
                      <>
                        <Dialog
                          open={addSavingsOpen && selectedGoal === goal.id}
                          onOpenChange={(open) => {
                            setAddSavingsOpen(open)
                            if (open) setSelectedGoal(goal.id)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              Add Savings
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Savings to {goal.name}</DialogTitle>
                              <DialogDescription className="font-medium text-foreground">How much to add?</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="savings-amount">Amount (₹)</Label>
                                <Input
                                  id="savings-amount"
                                  type="number"
                                  placeholder="Enter amount"
                                  value={savingsAmount}
                                  onChange={(e) => setSavingsAmount(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setAddSavingsOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleAddSavings}>Add Savings</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this goal? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
  </div>
                </div>
                <div className="space-y-3">
                  {Math.round((goal.current / goal.target) * 100) >= 100 ? (
                    <div className="flex items-center justify-center py-2">
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 py-1.5 px-4 text-sm font-bold flex items-center gap-2">
                        <span>✅</span> Completed!
                      </Badge>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                        </span>
                        <span className="font-bold text-foreground">
                          {Math.round((goal.current / goal.target) * 100)}%
                        </span>
                      </div>
                      <Progress value={isMounted ? (goal.current / goal.target) * 100 : 0} className="h-2 bg-muted/30 overflow-hidden" />
                    </>
                  )}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(goal.target - goal.current)} remaining</span>
                  {goal.deadline ? (
                    <span>Due by {format(goal.deadline, "MMM d, yyyy")}</span>
                  ) : (
                    <span>No deadline</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

