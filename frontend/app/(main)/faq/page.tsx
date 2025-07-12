export default function FAQPage() {
  const faqs = [
    {
      question: "What is SkillSwap?",
      answer:
        "SkillSwap is an online platform that connects individuals who want to exchange skills. You can offer skills you possess and learn new skills from others in a peer-to-peer learning environment.",
    },
    {
      question: "How does SkillSwap work?",
      answer:
        "You create a profile listing skills you can teach and skills you want to learn. You can then browse other members' profiles, send swap requests, and arrange sessions to exchange knowledge, either virtually or in person.",
    },
    {
      question: "Is SkillSwap free to use?",
      answer:
        "Yes, creating a profile, browsing skills, and sending swap requests are completely free. We may introduce premium features in the future, but core skill exchange will remain free.",
    },
    {
      question: "How do I ensure a safe and productive swap?",
      answer:
        "We encourage users to communicate clearly before a swap, set clear expectations, and utilize our rating and feedback system after each session. Our platform also has moderation to ensure a safe environment.",
    },
    {
      question: "What kind of skills can I exchange?",
      answer:
        "You can exchange a wide variety of skills, from academic subjects like coding and languages to practical skills like graphic design, cooking, photography, and more. If you can teach it or want to learn it, it likely has a place on SkillSwap!",
    },
    {
      question: "Can I offer multiple skills and learn multiple skills?",
      answer:
        "Your profile allows you to list as many skills as you can offer and as many as you wish to learn. This increases your chances of finding suitable swap partners.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-lg">Everything you need to know about SkillSwap.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{faq.question}</h2>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
