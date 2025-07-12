export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">About SkillSwap</h1>
          <p className="text-gray-600 text-lg">Our mission, vision, and values.</p>
        </div>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            SkillSwap was founded on the belief that everyone has something valuable to teach and something new to
            learn. In a world that's constantly evolving, continuous learning is key, and we believe the best way to
            learn is often directly from others. Our platform provides a vibrant, secure, and easy-to-use environment
            for individuals to exchange skills, knowledge, and expertise.
          </p>
          <p>
            Our mission is to empower individuals globally by fostering a community where skill exchange is seamless,
            accessible, and rewarding. We aim to break down traditional learning barriers, making education and personal
            growth a collaborative journey.
          </p>
          <p>
            We envision a future where learning is not confined to institutions or formal courses, but is a dynamic,
            peer-to-peer process that enriches lives and builds stronger communities. We are committed to creating a
            platform that is inclusive, trustworthy, and constantly evolving to meet the needs of our diverse user base.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8">Our Values</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>**Community:** Building a supportive and engaging network of learners and teachers.</li>
            <li>**Empowerment:** Enabling individuals to take control of their learning and teaching journey.</li>
            <li>**Accessibility:** Making skill exchange available to everyone, everywhere.</li>
            <li>**Trust:** Ensuring a safe and reliable platform through robust moderation and feedback systems.</li>
            <li>**Growth:** Encouraging continuous personal and professional development.</li>
          </ul>
          <p>Join us on this exciting journey to unlock your potential and connect with a world of knowledge!</p>
        </div>
      </div>
    </div>
  )
}
