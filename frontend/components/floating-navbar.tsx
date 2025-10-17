"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Sun, Moon } from "lucide-react"

export default function FloatingNavbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "About", href: "#about" },
  ]

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-8 px-8 py-3 rounded-full bg-background/80 dark:bg-background/80 backdrop-blur-md border border-border shadow-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            H
          </div>
          <span className="hidden sm:inline text-foreground">HealthHub</span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-foreground/70 hover:text-foreground transition-colors duration-200 text-sm font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right Section - Theme Toggle and Sign In */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>

          <Link href="/signin">
            <button className="px-6 py-2 border border-foreground bg-transparent text-foreground dark:border-foreground relative group transition duration-200 rounded-lg font-medium text-sm">
              <div className="absolute -bottom-2 -right-2 bg-primary h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200 rounded-lg" />
              <span className="relative">Sign In</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
