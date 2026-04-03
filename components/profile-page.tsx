"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Mail, Phone, MapPin, LogOut } from "lucide-react"

// Sample user database
const userDatabase = [
  {
    email: "alex.johnson@example.com",
    password: "password123",
    name: "Alex Johnson",
    phone: "+1 (555) 123-4567",
    address: "123 Financial Street, Money City, CA 94103",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    security: {
      twoFactor: false,
      passwordReset: false,
    },
  },
]

export function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    security: {
      twoFactor: false,
      passwordReset: false,
    },
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Check if user exists in database
    const user = userDatabase.find((user) => user.email === loginForm.email && user.password === loginForm.password)

    if (user) {
      setIsLoggedIn(true)
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        notifications: user.notifications,
        security: user.security,
      })
      toast({
        title: "Login successful",
        description: "Welcome back to FinTrack!",
      })
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      })
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      toast({
        title: "Signup failed",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Signup failed",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    // Check if user already exists
    const userExists = userDatabase.some((user) => user.email === signupForm.email)
    if (userExists) {
      toast({
        title: "Signup failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      })
      return
    }

    // Add user to database (in a real app, this would be a server call)
    userDatabase.push({
      email: signupForm.email,
      password: signupForm.password,
      name: signupForm.name,
      phone: "",
      address: "",
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      security: {
        twoFactor: false,
        passwordReset: false,
      },
    })

    // Log in the new user
    setProfileData({
      name: signupForm.name,
      email: signupForm.email,
      phone: "",
      address: "",
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      security: {
        twoFactor: false,
        passwordReset: false,
      },
    })

    setIsLoggedIn(true)
    toast({
      title: "Signup successful",
      description: "Welcome to FinTrack!",
    })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setLoginForm({ email: "", password: "" })
    setSignupForm({ name: "", email: "", password: "", confirmPassword: "" })
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleToggleNotification = (key: keyof typeof profileData.notifications, value: boolean) => {
    setProfileData({
      ...profileData,
      notifications: {
        ...profileData.notifications,
        [key]: value,
      },
    })
  }

  const handleToggleSecurity = (key: keyof typeof profileData.security, value: boolean) => {
    setProfileData({
      ...profileData,
      security: {
        ...profileData.security,
        [key]: value,
      },
    })

    if (key === "twoFactor" && value) {
      toast({
        title: "Two-factor authentication enabled",
        description: "You'll receive a verification code when logging in.",
      })
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {isSigningUp ? "Create an Account" : "Login to FinTrack"}
              </CardTitle>
              <CardDescription>
                {isSigningUp
                  ? "Enter your information to create an account"
                  : "Enter your credentials to access your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSigningUp ? (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex.johnson@example.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="link" className="p-0 h-auto text-xs">
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-sm text-muted-foreground mt-2">
                {isSigningUp ? (
                  <>
                    Already have an account?{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setIsSigningUp(false)}>
                      Login
                    </Button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setIsSigningUp(true)}>
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback>
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold">{profileData.name}</h2>
                  <p className="text-muted-foreground">{profileData.email}</p>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  Premium Member
                </Badge>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">{profileData.phone || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-sm text-muted-foreground">{profileData.address || "Not set"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={profileData.security.twoFactor}
                      onCheckedChange={(checked) => handleToggleSecurity("twoFactor", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password Reset Protection</Label>
                      <p className="text-sm text-muted-foreground">
                        Require additional verification for password resets
                      </p>
                    </div>
                    <Switch
                      checked={profileData.security.passwordReset}
                      onCheckedChange={(checked) => handleToggleSecurity("passwordReset", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

