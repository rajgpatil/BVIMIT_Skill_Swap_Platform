"use client"

import { Star, ArrowRight } from "lucide-react" // Import Lucide icons

export default function CommunitySection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Graphic Designer",
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20young%20Asian%20woman%20graphic%20designer%2C%20friendly%20smile%2C%20modern%20office%20background%2C%20creative%20professional%20portrait%2C%20contemporary%20business%20attire&width=100&height=100&seq=avatar-sarah&orientation=squarish",
      content:
        "I traded my Photoshop skills for Excel training and landed my dream job! The community here is incredibly supportive and professional.",
      rating: 5,
      skillsOffered: ["Photoshop", "Illustrator"],
      skillsLearned: ["Excel", "Data Analysis"],
    },
    {
      name: "Marcus Johnson",
      role: "Software Developer",
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20young%20Black%20male%20software%20developer%2C%20confident%20expression%2C%20tech%20office%20environment%2C%20modern%20programmer%20portrait%2C%20casual%20professional%20attire&width=100&height=100&seq=avatar-marcus&orientation=squarish",
      content:
        "Learning Spanish while teaching React has been an amazing experience. The quality of interactions on this platform is outstanding.",
      rating: 5,
      skillsOffered: ["React", "Node.js"],
      skillsLearned: ["Spanish", "UI Design"],
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Manager",
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20young%20Hispanic%20woman%20marketing%20manager%2C%20warm%20smile%2C%20corporate%20office%20setting%2C%20business%20professional%20portrait%2C%20contemporary%20styling&width=100&height=100&seq=avatar-elena&orientation=squarish",
      content:
        "The skill exchange system works perfectly! I've improved my coding skills while helping others with digital marketing strategies.",
      rating: 5,
      skillsOffered: ["Digital Marketing", "SEO"],
      skillsLearned: ["Python", "Web Development"],
    },
  ]

  const popularSkills = [
    { name: "Photoshop", count: "2.3k" },
    { name: "Excel", count: "1.9k" },
    { name: "Python", count: "1.7k" },
    { name: "Spanish", count: "1.5k" },
    { name: "React", count: "1.2k" },
    { name: "Digital Marketing", count: "1.1k" },
    { name: "UI/UX Design", count: "950" },
    { name: "French", count: "820" },
    { name: "Data Analysis", count: "780" },
    { name: "Photography", count: "650" },
  ]

  return (
    <section id="community" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join Our Thriving
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Community
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with thousands of learners and teachers sharing knowledge across hundreds of skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">What Our Members Say</h3>
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover object-top"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{testimonial.content}</p>
                      <div className="flex flex-wrap gap-2">
                        <div className="text-xs">
                          <span className="text-gray-500">Teaches:</span>
                          {testimonial.skillsOffered.map((skill, i) => (
                            <span key={i} className="ml-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Learns:</span>
                          {testimonial.skillsLearned.map((skill, i) => (
                            <span key={i} className="ml-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Most Popular Skills</h3>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {popularSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {skill.count}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer whitespace-nowrap">
                  View All Skills <ArrowRight className="inline-block h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Skill Journey?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and teachers in our community. Share what you know, learn what you love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer">
              Join the Community
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all whitespace-nowrap cursor-pointer">
              Browse Skills
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
