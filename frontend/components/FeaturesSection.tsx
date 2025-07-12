"use client"

import { User, Search, Repeat, Star, ShieldCheck, BarChart } from "lucide-react" // Import Lucide icons

export default function FeaturesSection() {
  const features = [
    {
      icon: User, // Use Lucide component directly
      title: "Complete Profile Management",
      description:
        "Create detailed profiles with skills offered, skills wanted, availability, and privacy controls. Upload photos and showcase your expertise.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Search, // Use Lucide component directly
      title: "Smart Skill Discovery",
      description:
        "Browse and search for skills like Photoshop, Excel, coding, languages, and more. Find the perfect match for your learning goals.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Repeat, // Use Lucide component directly
      title: "Seamless Swap Requests",
      description:
        "Send, accept, or reject swap offers with ease. Manage all your current and pending requests in one organized dashboard.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Star, // Use Lucide component directly
      title: "Rating & Feedback System",
      description:
        "Build trust in the community with comprehensive ratings and feedback after each successful skill swap session.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: ShieldCheck, // Use Lucide component directly
      title: "Admin Moderation",
      description:
        "Safe and secure platform with admin oversight, spam protection, user management, and platform-wide communication.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: BarChart, // Use Lucide component directly
      title: "Activity Analytics",
      description:
        "Track your learning progress, swap history, and community engagement with detailed reports and statistics.",
      color: "from-indigo-500 to-indigo-600",
    },
  ]

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Skill Exchange
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to connect, learn, and grow with fellow skill enthusiasts in our comprehensive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group hover:transform hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="text-white h-8 w-8" /> {/* Render Lucide icon */}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
