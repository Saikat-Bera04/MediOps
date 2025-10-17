"use client"

import { useEffect, useState } from "react"
import FloatingNavbar from "@/components/floating-navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Cards from "@/components/cards"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <FloatingNavbar />
      <div className="pt-24">
        <Hero />
        <Features />
        <Cards />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}
