import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white pt-20">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
          Ace Your Interviews with AI-Powered Practice
        </h1>

        <p className="mt-6 text-lg text-gray-400 max-w-xl">
          Practice real interview questions, get instant AI feedback, and track your improvement — all in one place.
        </p>

        <div className="mt-8 flex gap-4">
          <Button className="text-lg px-6 py-4">
            Start Interview
          </Button>

          <Button variant="secondary" className="text-lg px-6 py-4">
            View Dashboard
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-black">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Crack Interviews
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900">
            <h3 className="text-xl font-semibold mb-2">AI Mock Interviews</h3>
            <p className="text-gray-400">
              Practice real interview scenarios with AI-driven questions tailored to your role.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900">
            <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
            <p className="text-gray-400">
              Get detailed feedback on your answers including clarity, structure, and correctness.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900">
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-400">
              Monitor your improvement over time with performance analytics and insights.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-24 bg-black border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div>
            <div className="text-4xl font-bold text-gray-500 mb-4">01</div>
            <h3 className="text-xl font-semibold mb-2">Start Interview</h3>
            <p className="text-gray-400">
              Choose your interview type and begin your AI-powered mock session.
            </p>
          </div>

          <div>
            <div className="text-4xl font-bold text-gray-500 mb-4">02</div>
            <h3 className="text-xl font-semibold mb-2">Answer Questions</h3>
            <p className="text-gray-400">
              Respond using voice or text just like a real interview environment.
            </p>
          </div>

          <div>
            <div className="text-4xl font-bold text-gray-500 mb-4">03</div>
            <h3 className="text-xl font-semibold mb-2">Get AI Feedback</h3>
            <p className="text-gray-400">
              Receive instant evaluation with actionable insights to improve.
            </p>
          </div>

        </div>
      </section>
      {/* CTA Section */}
<section className="px-6 py-24 bg-linear-to-b from-black to-gray-900 text-center">
  <h2 className="text-4xl font-bold mb-6">
    Ready to Ace Your Next Interview?
  </h2>

  <p className="text-gray-400 mb-8 max-w-xl mx-auto">
    Start practicing today with AI-powered mock interviews and take your preparation to the next level.
  </p>

  <Button className="text-lg px-8 py-6">
    Start Practicing Now 
  </Button>
</section>
{/* Footer */}
<footer className="px-6 py-10 border-t border-gray-800 text-center text-gray-400">
  <p>© {new Date().getFullYear()} PrepWise AI. All rights reserved.</p>
</footer>

    </main>
  );
}