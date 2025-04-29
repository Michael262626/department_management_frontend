"use client"

import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Lock, User } from "lucide-react"
import Cookies from "js-cookie";
import { useEffect, useState } from "react"
import { loginUser } from "@/store/authSlice"
import { toast } from "./ui/use-toast"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { error, loading, isAuthenticated  } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const resultAction = await dispatch(loginUser({ username, password }));
  
    if (loginUser.fulfilled.match(resultAction)) {
      const token = resultAction.payload?.access_token;
  
      Cookies.set("authToken", token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
  
      localStorage.setItem('isAuthenticated', 'true');
  
      toast({ title: "Login successful", description: "Welcome back!" });
      router.push("/dashboard");
    } else {
      const errorPayload = resultAction.payload as any;
      const errorMessage = typeof errorPayload === 'string'
        ? errorPayload
        : errorPayload?.message || "Something went wrong";
  
      toast({
        title: "Login failed",
        description: errorMessage,
      });
    }
  }  

  return (
    <Card className="gradient-card shadow-xl border-purple-800/50 glow-effect">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="username-login" className="text-gray-300">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username-login"
                type="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-10 bg-gray-900/50 border-purple-800/50 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-login" className="text-gray-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password-login"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 bg-gray-900/50 border-purple-800/50 focus:border-purple-500"
              />
            </div>
          </div>
          <Button type="submit" className="w-full gradient-button font-medium py-5" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-purple-900/50 pt-4">
      <p className="text-sm text-gray-400">
            Don't have an account?{" "}
        <a href="/signup" className="text-purple-400 hover:underline">Sign up</a>
      </p>
        </CardFooter>
    </Card>
  )
}
