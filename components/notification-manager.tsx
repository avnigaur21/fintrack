"use client"

import { useState, useEffect } from "react"
import { Bell, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export function NotificationManager() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationDay, setNotificationDay] = useState("sunday")
  const [notificationTime, setNotificationTime] = useState("18:00")
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unknown">("unknown")

  // Check if notifications are supported and get permission status
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionState(Notification.permission)
    }
  }, [])

  // Request notification permission
  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        setPermissionState(permission)

        if (permission === "granted") {
          setNotificationsEnabled(true)
          toast({
            title: "Notifications enabled",
            description: "You'll receive weekly reminders to update your expenses.",
          })

          // Show a test notification
          new Notification("FinTrack Notification", {
            body: "You'll receive weekly reminders to update your expenses.",
            icon: "/favicon.ico",
          })
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error)
        toast({
          title: "Notification error",
          description: "Could not enable notifications. Please check your browser settings.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      })
    }
  }

  // Toggle notifications
  const toggleNotifications = (enabled: boolean) => {
    if (enabled && permissionState !== "granted") {
      requestPermission()
    } else {
      setNotificationsEnabled(enabled)
      if (enabled) {
        toast({
          title: "Notifications enabled",
          description: `You'll receive reminders every ${notificationDay} at ${notificationTime}.`,
        })
      } else {
        toast({
          title: "Notifications disabled",
          description: "You won't receive expense reminders anymore.",
        })
      }
    }
  }

  // Simulate a notification for demo purposes
  const sendTestNotification = () => {
    toast({
      title: "Expense Reminder",
      description: "Don't forget to update your expenses for this week!",
      action: (
        <Button variant="outline" size="sm" onClick={() => (window.location.href = "/expenses")}>
          Add Expenses
        </Button>
      ),
    })

    // If browser notifications are enabled, send one
    if (permissionState === "granted") {
      new Notification("FinTrack Expense Reminder", {
        body: "Don't forget to update your expenses for this week!",
        icon: "/favicon.ico",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Expense Reminders
        </CardTitle>
        <CardDescription>Set up weekly reminders to update your expenses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={toggleNotifications} />
            <Label htmlFor="notifications">Enable weekly reminders</Label>
          </div>
          <div
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              permissionState === "granted"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : permissionState === "denied"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            )}
          >
            {permissionState === "granted" ? "Enabled" : permissionState === "denied" ? "Blocked" : "Not set"}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="notification-day" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Reminder Day
            </Label>
            <Select value={notificationDay} onValueChange={setNotificationDay} disabled={!notificationsEnabled}>
              <SelectTrigger id="notification-day">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Reminder Time
            </Label>
            <Select value={notificationTime} onValueChange={setNotificationTime} disabled={!notificationsEnabled}>
              <SelectTrigger id="notification-time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="08:00">8:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="18:00">6:00 PM</SelectItem>
                <SelectItem value="20:00">8:00 PM</SelectItem>
                <SelectItem value="21:00">9:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {permissionState === "denied" && (
          <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md">
            Notifications are blocked in your browser. Please update your browser settings to enable notifications.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          onClick={sendTestNotification}
          disabled={!notificationsEnabled && permissionState !== "granted"}
          className="w-full"
        >
          Send Test Notification
        </Button>
      </CardFooter>
    </Card>
  )
}

