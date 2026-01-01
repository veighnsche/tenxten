import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function ChallengesPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>
}) {
  const params = await searchParams
  const track = params.track || "native"
  
  const supabase = await createClient()
  
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("track", track)
    .order("domain")

  const domains = [...new Set(challenges?.map(c => c.domain) || [])]

  const difficultyColor: Record<string, string> = {
    easy: "text-green-500 border-green-500",
    medium: "text-amber-500 border-amber-500",
    hard: "text-red-500 border-red-500",
    extreme: "text-purple-500 border-purple-500",
  }

  return (
    <div className="min-h-screen bg-black p-6 font-mono text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <Link href="/dashboard" className="text-neutral-500 text-xs hover:text-green-500">
            ← BACK TO DASHBOARD
          </Link>
          <div>
            <p className="text-neutral-500 text-xs uppercase tracking-widest">
              {">"} CHALLENGE CATALOG
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              {track === "native" ? (
                <span className="text-green-500">10x.NATIVE</span>
              ) : (
                <span className="text-amber-500">10x.AUGMENTED</span>
              )}
            </h1>
          </div>
        </header>

        {/* Track Toggle */}
        <div className="flex gap-2">
          <Link
            href="/challenges?track=native"
            className={`border px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
              track === "native"
                ? "border-green-500 bg-green-500/10 text-green-500"
                : "border-neutral-800 text-neutral-500 hover:border-neutral-600"
            }`}
          >
            10x.NATIVE
          </Link>
          <Link
            href="/challenges?track=augmented"
            className={`border px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
              track === "augmented"
                ? "border-amber-500 bg-amber-500/10 text-amber-500"
                : "border-neutral-800 text-neutral-500 hover:border-neutral-600"
            }`}
          >
            10x.AUGMENTED
          </Link>
        </div>

        {/* Track Info */}
        <div className={`border p-4 ${track === "native" ? "border-green-500/30 bg-green-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
          {track === "native" ? (
            <p className="text-sm text-neutral-300">
              <span className="text-green-500 font-bold">NATIVE</span> challenges test your raw programming ability. 
              No AI tools, no external resources. Just you and the code.
            </p>
          ) : (
            <p className="text-sm text-neutral-300">
              <span className="text-amber-500 font-bold">AUGMENTED</span> challenges measure your AI-assisted productivity. 
              Use any AI tools you want. Speed and quality matter.
            </p>
          )}
        </div>

        {/* Challenges by Domain */}
        {challenges && challenges.length > 0 ? (
          <div className="space-y-6">
            {domains.map((domain) => (
              <section key={domain} className="space-y-3">
                <h2 className="text-xs uppercase tracking-widest text-neutral-500">
                  {">"} {domain}
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {challenges
                    .filter((c) => c.domain === domain)
                    .map((challenge) => (
                      <Link
                        key={challenge.id}
                        href={`/arena/${challenge.slug}`}
                        className="group border border-neutral-800 p-4 transition-colors hover:border-neutral-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-bold group-hover:text-green-500">
                              {challenge.title}
                            </h3>
                            <p className="text-xs text-neutral-500">
                              {Math.floor(challenge.time_limit_seconds / 60)} min
                            </p>
                          </div>
                          <span
                            className={`border px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              difficultyColor[challenge.difficulty]
                            }`}
                          >
                            {challenge.difficulty}
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="border border-neutral-800 p-12 text-center">
            <p className="text-neutral-500">No challenges available for this track yet.</p>
            <p className="mt-2 text-xs text-neutral-600">Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
