"use client"
import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    // Mock authentication
    localStorage.setItem("user", JSON.stringify({ email }))
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side - Image */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏥</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Healthcare Management</h2>
                <p className="text-muted-foreground">Streamline your hospital operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground mb-8">Sign in to your healthcare dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-2 border border-black bg-transparent text-black dark:border-white dark:text-white relative group transition duration-200 w-full rounded-lg font-medium"
              >
                <div className="absolute -bottom-2 -right-2 bg-primary h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200 rounded-lg" />
                <span className="relative">Sign In</span>
              </button>
            </form>

            <p className="text-center text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
