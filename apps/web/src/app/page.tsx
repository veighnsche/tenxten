import Link from "next/link"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Navigation */}
      <nav className="border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="text-sm bg-white text-black px-4 py-2 hover:bg-neutral-200 transition-colors"
            >
              Get Certified
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-signal-orange text-sm font-medium mb-4">
            Technical certification for the AI era
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Prove you're a real engineer,{" "}
            <span className="text-neutral-500">not just an AI wrapper.</span>
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-2xl">
            TENXTEN certifies software engineers on two dimensions: your ability to code 
            without AI (10x Native) and your ability to ship faster with AI (10x Augmented). 
            Complete both to prove you're 100x.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center bg-signal-orange text-black font-bold px-8 py-4 text-sm uppercase tracking-wider hover:bg-signal-orange/90 transition-colors"
            >
              Start Certification →
            </Link>
            <Link 
              href="#how-it-works" 
              className="inline-flex items-center justify-center border border-neutral-700 px-8 py-4 text-sm uppercase tracking-wider text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-y border-neutral-800 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">The hiring problem in 2026</h2>
              <p className="text-neutral-400 leading-relaxed mb-4">
                AI has made it trivially easy to appear competent. Portfolios are generated. 
                Take-home tests are solved by Claude. Technical screens are gamed with copilots.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Employers can't tell who actually knows how to build software and who's just 
                good at prompting. <span className="text-white">TENXTEN fixes this.</span>
              </p>
            </div>
            <div className="border border-neutral-800 p-6 space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-red-500 text-xl">✗</span>
                <div>
                  <p className="font-medium">Traditional certifications</p>
                  <p className="text-sm text-neutral-500">Memorizable, cheatable, meaningless</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-red-500 text-xl">✗</span>
                <div>
                  <p className="font-medium">LeetCode grinding</p>
                  <p className="text-sm text-neutral-500">Tests puzzle-solving, not engineering</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-red-500 text-xl">✗</span>
                <div>
                  <p className="font-medium">Portfolio projects</p>
                  <p className="text-sm text-neutral-500">Can't verify who actually wrote the code</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-signal-orange text-xl">✓</span>
                <div>
                  <p className="font-medium text-signal-orange">TENXTEN Certification</p>
                  <p className="text-sm text-neutral-400">Proctored, practical, verifiable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Tracks */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Two certifications. One complete picture.</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Modern engineering requires both foundational skills and AI fluency. 
            We test both dimensions separately to give employers a complete signal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Native Track */}
          <div className="border border-neutral-800 p-8 hover:border-signal-orange/50 transition-colors group">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-3 rounded-full bg-signal-orange" />
              <span className="text-sm uppercase tracking-widest text-neutral-500">Track 1</span>
            </div>
            <h3 className="text-2xl font-bold text-signal-orange mb-4">10x.NATIVE</h3>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              Prove you can solve real engineering problems without any AI assistance. 
              Browser-based IDE with AI detection. Timed challenges covering algorithms, 
              system design, and debugging.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-neutral-300">
                <span className="text-signal-orange">→</span>
                No copilot, no ChatGPT, no external tools
              </li>
              <li className="flex items-center gap-3 text-neutral-300">
                <span className="text-signal-orange">→</span>
                45-minute proctored challenges
              </li>
              <li className="flex items-center gap-3 text-neutral-300">
                <span className="text-signal-orange">→</span>
                Pass 4 challenges across difficulty levels
              </li>
            </ul>
          </div>

          {/* Augmented Track */}
          <div className="border border-neutral-800 p-8 hover:border-amber-500/50 transition-colors group">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-3 rounded-full bg-amber-500" />
              <span className="text-sm uppercase tracking-widest text-neutral-500">Track 2</span>
            </div>
            <h3 className="text-2xl font-bold text-amber-500 mb-4">10x.AUGMENTED</h3>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              Prove you can leverage AI to ship at 10x speed. Use any tools you want—Cursor, 
              Claude, Copilot—and deliver production-ready solutions under time pressure.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-neutral-300">
                <span className="text-amber-500">→</span>
                Use any AI tools available
              </li>
              <li className="flex items-center gap-3 text-neutral-300">
                <span className="text-amber-500">→</span>
                Larger scope, tighter deadlines
              </li>
              <li className="flex items-center gap-3 text-neutral-300">
                <span className="text-amber-500">→</span>
                Evaluated on output quality and speed
              </li>
            </ul>
          </div>
        </div>

        {/* 100x Badge */}
        <div className="mt-8 border border-purple-500/30 bg-purple-500/5 p-8 text-center">
          <p className="text-sm uppercase tracking-widest text-purple-400 mb-2">Complete Both Tracks</p>
          <h3 className="text-2xl font-bold mb-2">Earn 100x.PROVEN Status</h3>
          <p className="text-neutral-400 max-w-xl mx-auto">
            The ultimate credential. Proves you have deep engineering foundations AND 
            you know how to multiply your output with AI. The complete modern engineer.
          </p>
        </div>
      </section>

      {/* For Employers */}
      <section className="border-y border-neutral-800 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-500 text-sm font-medium mb-4">For Employers</p>
              <h2 className="text-3xl font-bold mb-6">Hire with confidence</h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Every TENXTEN certificate is verifiable. See exactly what challenges a candidate 
                passed, their completion times, and code quality scores. No more guessing if 
                they can actually code.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-signal-orange mt-1">✓</span>
                  <span className="text-neutral-300">Unique verification URLs for each certificate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-signal-orange mt-1">✓</span>
                  <span className="text-neutral-300">Detailed performance metrics and timestamps</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-signal-orange mt-1">✓</span>
                  <span className="text-neutral-300">Identity verification to prevent impersonation</span>
                </li>
              </ul>
            </div>
            <div className="border border-neutral-800 p-1">
              <div className="bg-neutral-900 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 bg-neutral-800 flex items-center justify-center text-lg font-bold">
                    J
                  </div>
                  <div>
                    <p className="font-medium">@jane_doe</p>
                    <p className="text-xs text-signal-orange">✓ Identity Verified</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-neutral-800">
                    <span className="text-neutral-500">10x.NATIVE</span>
                    <span className="text-signal-orange">CERTIFIED</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-800">
                    <span className="text-neutral-500">10x.AUGMENTED</span>
                    <span className="text-amber-500">CERTIFIED</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-500">100x.PROVEN</span>
                    <span className="text-purple-500">ACHIEVED</span>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-600 mt-4">
                  Verified Jan 1, 2026 • ID: txtn_c8f3k2m9
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to prove yourself?
        </h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
          Join the engineers who are building verifiable credentials for the AI era. 
          Free to start. Pay only when you pass.
        </p>
        <Link 
          href="/signup" 
          className="inline-flex items-center justify-center bg-white text-black font-bold px-10 py-4 text-sm uppercase tracking-wider hover:bg-neutral-200 transition-colors"
        >
          Create Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <Logo size="sm" linkToHome={false} />
              <span className="text-neutral-600 text-sm">The Proving Ground</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/employers" className="hover:text-white transition-colors">For Employers</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
