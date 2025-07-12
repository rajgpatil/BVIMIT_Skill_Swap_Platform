"use client"

import { UserPlus, Search, Repeat, Star } from "lucide-react" // Import Lucide icons

export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Create Your Profile",
      description:
        "Sign up and build your profile by listing skills you can teach and skills you want to learn. Add your availability and preferences.",
      icon: UserPlus, // Use Lucide component directly
      image:
        "https://readdy.ai/api/search-image?query=Person%20creating%20online%20profile%20on%20laptop%20screen%20with%20skill%20categories%20and%20personal%20information%2C%20modern%20clean%20interface%20design%2C%20professional%20workspace%20setup%20with%20good%20lighting%2C%20user-friendly%20dashboard%20mockup&width=600&height=400&seq=profile-creation&orientation=landscape",
    },
    {
      step: "02",
      title: "Discover & Connect",
      description:
        "Browse through our community of skilled individuals. Search by specific skills, location, or availability to find your perfect learning partner.",
      icon: Search, // Use Lucide component directly
      image:
        "https://readdy.ai/api/search-image?query=Person%20browsing%20and%20searching%20through%20profiles%20on%20computer%20screen%2C%20skill%20matching%20interface%20with%20user%20cards%20and%20search%20filters%2C%20modern%20web%20application%20design%20with%20collaborative%20learning%20platform&width=600&height=400&seq=skill-discovery&orientation=landscape",
    },
    {
      step: "03",
      title: "Exchange Skills",
      description:
        "Send swap requests and start learning! Meet virtually or in person, share knowledge, and grow together in a supportive environment.",
      icon: Repeat, // Use Lucide component directly
      image:
        "https://readdy.ai/api/search-image?query=Two%20people%20having%20online%20video%20call%20for%20skill%20sharing%20session%2C%20teaching%20and%20learning%20interaction%2C%20collaborative%20workspace%20with%20shared%20screens%2C%20modern%20educational%20technology%20setup&width=600&height=400&seq=skill-exchange&orientation=landscape",
    },
    {
      step: "04",
      title: "Rate & Grow",
      description:
        "After each swap, rate your experience and provide feedback. Build your reputation and help others make informed connections.",
      icon: Star, // Use Lucide component directly
      image:
        "https://readdy.ai/api/search-image?query=Person%20giving%20positive%20rating%20and%20feedback%20on%20mobile%20app%20interface%2C%20five%20star%20rating%20system%2C%20user%20review%20and%20testimonial%20screen%2C%20modern%20app%20design%20with%20satisfaction%20metrics&width=600&height=400&seq=rating-feedback&orientation=landscape",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in just four simple steps and begin your skill-sharing journey today.
          </p>
        </div>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
            >
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mr-4">
                    {step.step}
                  </span>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <step.icon className="text-white h-6 w-6" /> {/* Render Lucide icon */}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <img
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    className="w-full h-80 object-cover object-top rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
