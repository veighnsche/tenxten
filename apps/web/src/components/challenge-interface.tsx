"use client"

import { useState } from "react"

interface ChallengeInterfaceProps {
  onComplete?: () => void
}

export function ChallengeInterface({ onComplete }: ChallengeInterfaceProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)

  const challenges = [
    {
      id: "rust-concurrency",
      title: "CONCURRENT_HASH_MAP",
      stack: "RUST",
      difficulty: "EXTREME",
      timeLimit: "45m",
      description: "Implement a lock-free concurrent hash map with wait-free reads",
    },
    {
      id: "go-scheduler",
      title: "TASK_SCHEDULER",
      stack: "GO",
      difficulty: "HIGH",
      timeLimit: "60m",
      description: "Build a distributed task scheduler with fault tolerance",
    },
    {
      id: "system-design",
      title: "RATE_LIMITER",
      stack: "LANGUAGE_AGNOSTIC",
      difficulty: "MEDIUM",
      timeLimit: "30m",
      description: "Design a distributed rate limiter for 1M requests/second",
    },
  ]

  return (
    <div className="min-h-screen bg-void text-foreground pt-16">
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <header className="mb-8">
          <div className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">
            CANDIDATE MODE // CHALLENGE_SELECT
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground uppercase">PROVE YOUR MULTIPLIER</h1>
          <div className="text-signal-orange text-xs uppercase tracking-widest mt-2">SELECT YOUR PROVING GROUND</div>
        </header>

        <div className="space-y-4">
          {challenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => setSelectedChallenge(challenge.id)}
              className="w-full border border-border bg-card hover:border-signal-orange transition-colors text-left"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                      {challenge.stack}
                    </div>
                    <h3 className="text-xl font-bold text-foreground uppercase tracking-wide">{challenge.title}</h3>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs uppercase tracking-widest mb-1 ${
                        challenge.difficulty === "EXTREME"
                          ? "text-terminal-red"
                          : challenge.difficulty === "HIGH"
                            ? "text-terminal-amber"
                            : "text-signal-orange"
                      }`}
                    >
                      {challenge.difficulty}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">{challenge.timeLimit}</div>
                  </div>
                </div>

                <p className="text-sm text-smoke leading-relaxed">{challenge.description}</p>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-signal-orange uppercase tracking-widest">[CLICK_TO_INITIALIZE]</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">// PROVING_GROUND_RULES</div>
          <div className="space-y-2 text-sm text-smoke">
            <p>
              <span className="text-terminal-amber">&gt;</span> Time limits are enforced. No extensions.
            </p>
            <p>
              <span className="text-terminal-amber">&gt;</span> Solutions are evaluated by automated test suites and
              peer architects.
            </p>
            <p>
              <span className="text-terminal-amber">&gt;</span> Your GRIT_SCORE reflects: correctness, efficiency, and
              architectural elegance.
            </p>
            <p>
              <span className="text-terminal-amber">&gt;</span> Only verified 10x10 architects gain permanent registry
              access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
