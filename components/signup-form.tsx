"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Lock, Mail, User } from "lucide-react"
import { toast } from "./ui/use-toast"
import { useAppDispatch } from "@/store/hooks"
import { registerUser } from "@/store/authSlice"

export function SignupForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const resultAction = await dispatch(registerUser({ username, email, password }))

    if (registerUser.fulfilled.match(resultAction)) {
      toast({ title: "Signup successful", description: "Welcome aboard!" })
      router.push("/login")
    } else {
      const errorMessage = resultAction.payload as string
      toast({
        title: "Signup failed",
        description: errorMessage || "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <Card className="gradient-card shadow-xl border-purple-800/50 glow-effect">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Create your account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-10 bg-gray-900/50 border-purple-800/50 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-gray-900/50 border-purple-800/50 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 bg-gray-900/50 border-purple-800/50 focus:border-purple-500"
              />
            </div>
          </div>
          <Button type="submit" className="w-full gradient-button font-medium py-5" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-purple-900/50 pt-4">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:underline">Sign in</a>
        </p>
      </CardFooter>
    </Card>
  )
}
