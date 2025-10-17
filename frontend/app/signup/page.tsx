"use client"
import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    // Mock registration
    localStorage.setItem("user", JSON.stringify({ email: formData.email, name: formData.name }))
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
                <h2 className="text-2xl font-bold text-foreground mb-2">Join Our Platform</h2>
                <p className="text-muted-foreground">Manage healthcare efficiently</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground mb-8">Join our healthcare management system</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-2 border border-black bg-transparent text-black dark:border-white dark:text-white relative group transition duration-200 w-full rounded-lg font-medium"
              >
                <div className="absolute -bottom-2 -right-2 bg-primary h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200 rounded-lg" />
                <span className="relative">Create Account</span>
              </button>
            </form>

            <p className="text-center text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
