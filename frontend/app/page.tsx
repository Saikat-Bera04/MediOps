"use client"

import { useEffect, useState } from "react"
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
    <main className="relative flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <div className="pt-24">
        <Features />
        <Cards />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
