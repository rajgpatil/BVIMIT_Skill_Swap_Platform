"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import FeaturesSection from "../components/FeaturesSection"
import HowItWorksSection from "../components/HowItWorksSection"
import CommunitySection from "../components/CommunitySection"
import Footer from "../components/Footer"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (isLoggedIn) {
      router.push("/people") // Redirect to /people if already logged in
    }
  }, [router])

  // If the user is logged in, this component will not render its content
  // as the redirect will happen before.
  // If not logged in, it will render the landing page.
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CommunitySection />
      <Footer />
    </div>
  )
}
