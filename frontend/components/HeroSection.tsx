"use client"

import Link from "next/link"
import { Users, Repeat, Star } from "lucide-react" // Import Lucide icons

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Modern%20collaborative%20workspace%20with%20diverse%20professionals%20working%20together%2C%20sharing%20knowledge%20and%20skills%20in%20a%20bright%20contemporary%20office%20environment%20with%20natural%20lighting%2C%20laptops%20and%20creative%20tools%2C%20representing%20skill%20exchange%20and%20learning%20community%2C%20minimalist%20design%20with%20warm%20colors&width=1920&height=1080&seq=hero-bg&orientation=landscape')`,
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Exchange Skills,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Expand Your World
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-200">
            Connect with talented individuals worldwide. Trade your expertise for new skills and grow together in our
            vibrant learning community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
            >
              Start Swapping Skills
            </Link>
            <Link
              href="#how-it-works"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all whitespace-nowrap cursor-pointer"
            >
              Learn How It Works
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white h-6 w-6" /> {/* Lucide icon */}
              </div>
              <h3 className="text-xl font-semibold mb-2">50K+ Members</h3>
              <p className="text-gray-200">Active community of skill sharers</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Repeat className="text-white h-6 w-6" /> {/* Lucide icon */}
              </div>
              <h3 className="text-xl font-semibold mb-2">100K+ Swaps</h3>
              <p className="text-gray-200">Successful skill exchanges completed</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-white h-6 w-6" /> {/* Lucide icon */}
              </div>
              <h3 className="text-xl font-semibold mb-2">4.9 Rating</h3>
              <p className="text-gray-200">Average user satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
