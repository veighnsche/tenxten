import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Logo } from "@/components/logo"

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, "0")}`
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  // Fetch all data in parallel
  const [profileRes, certsRes, attemptsRes, nativeChallengesRes, augmentedChallengesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("certifications").select("*").eq("user_id", user.id),
    supabase.from("challenge_attempts").select("*, challenges(*)").eq("user_id", user.id).order("started_at", { ascending: false }).limit(10),
    supabase.from("challenges").select("id").eq("track", "native"),
    supabase.from("challenges").select("id").eq("track", "augmented"),
  ])

  const profile = profileRes.data
  const certifications = certsRes.data
  const recentAttempts = attemptsRes.data
  const totalNativeChallenges = nativeChallengesRes.data?.length || 4
  const totalAugmentedChallenges = augmentedChallengesRes.data?.length || 4

  const nativeCert = certifications?.find(c => c.track === "native")
  const augmentedCert = certifications?.find(c => c.track === "augmented")

  // Calculate progress for each track
  const nativePassedChallenges = recentAttempts?.filter(
    a => a.status === "passed" && (a.challenges as { track: string })?.track === "native"
  ).length || 0
  const augmentedPassedChallenges = recentAttempts?.filter(
    a => a.status === "passed" && (a.challenges as { track: string })?.track === "augmented"
  ).length || 0

  const nativeProgress = Math.min((nativePassedChallenges / totalNativeChallenges) * 100, 100)
  const augmentedProgress = Math.min((augmentedPassedChallenges / totalAugmentedChallenges) * 100, 100)

  // Calculate stats
  const totalAttempts = recentAttempts?.length || 0
  const passedAttempts = recentAttempts?.filter(a => a.status === "passed").length || 0
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0
  const totalTimeSpent = recentAttempts?.reduce((acc, a) => {
    if (a.completed_at && a.started_at) {
      const diff = new Date(a.completed_at).getTime() - new Date(a.started_at).getTime()
      return acc + Math.floor(diff / 1000)
    }
    return acc
  }, 0) || 0

  const is100xProven = nativeCert?.status === "verified" && augmentedCert?.status === "verified"

  return (
    <div className="min-h-screen bg-black font-mono text-white">
      {/* Top Bar */}
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Logo size="md" />
          <div className="flex items-center gap-6">
            <Link href="/challenges" className="text-neutral-400 text-xs uppercase tracking-wider hover:text-white">
              Challenges
            </Link>
            <Link href="/profile" className="text-neutral-400 text-xs uppercase tracking-wider hover:text-white">
              Profile
            </Link>
            <form action="/auth/signout" method="post">
              <button className="text-neutral-500 text-xs uppercase tracking-wider hover:text-red-500">
                Exit
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="size-12 border border-neutral-700 bg-neutral-900 flex items-center justify-center text-xl">
                {(profile?.callsign || user.email)?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  @{profile?.callsign || user.email?.split("@")[0]}
                </h1>
                <p className="text-neutral-500 text-xs">
                  {profile?.identity_verified ? (
                  <span className="text-signal-orange">✓ Identity Verified</span>
                  ) : (
                    <span>Unverified Operator</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-neutral-500 text-[10px] uppercase tracking-widest">Session Active</p>
            <p className="text-xs text-neutral-400">{new Date().toLocaleDateString()}</p>
          </div>
        </header>

        {/* 100x Status Banner */}
        {is100xProven ? (
          <section className="border-2 border-purple-500 bg-gradient-to-r from-purple-500/10 to-purple-500/5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">⚡</div>
                <div>
                  <h2 className="text-xl font-bold text-purple-400">100x.PROVEN</h2>
                  <p className="text-xs text-neutral-400">
                    You are a verified 10x10 Architect. The elite of the elite.
                  </p>
                </div>
              </div>
              <Link href="/certificate/100x" className="border border-purple-500 px-4 py-2 text-xs font-bold text-purple-400 hover:bg-purple-500/10">
                VIEW CERTIFICATE
              </Link>
            </div>
          </section>
        ) : (
          <section className="border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl opacity-30">🔒</div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-500">100x.PROVEN</h2>
                  <p className="text-xs text-neutral-600">
                    Complete both tracks to unlock the ultimate certification
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`size-3 border ${nativeCert?.status === "verified" ? "border-signal-orange bg-signal-orange" : "border-neutral-700"}`} />
                <div className={`size-3 border ${augmentedCert?.status === "verified" ? "border-amber-500 bg-amber-500" : "border-neutral-700"}`} />
              </div>
            </div>
          </section>
        )}

        {/* Track Progress Cards */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Native Track */}
          <div className={`border p-6 space-y-4 ${nativeCert?.status === "verified" ? "border-signal-orange bg-signal-orange/5" : "border-neutral-800 hover:border-neutral-700"} transition-colors`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-signal-orange animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500">Native Track</span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-signal-orange">10x.NATIVE</h2>
              </div>
              {nativeCert?.status === "verified" ? (
                <span className="border border-signal-orange bg-signal-orange/20 px-3 py-1 text-xs font-bold text-signal-orange/80">
                  ✓ CERTIFIED
                </span>
              ) : (
                <span className="text-xs text-neutral-600">
                  {nativePassedChallenges}/{totalNativeChallenges}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Prove your raw programming skills without any AI assistance. 
              Pure human intellect and years of experience.
            </p>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-2 bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-signal-orange transition-all duration-500"
                  style={{ width: `${nativeProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>{nativePassedChallenges} PASSED</span>
                <span>{Math.round(nativeProgress)}% COMPLETE</span>
              </div>
            </div>

            <Link
              href="/challenges?track=native"
              className="block border border-signal-orange/50 bg-signal-orange/10 py-3 text-center text-xs font-bold uppercase tracking-wider text-signal-orange hover:bg-signal-orange/20 transition-colors"
            >
              {nativeCert?.status === "verified" ? "VIEW CHALLENGES" : nativePassedChallenges > 0 ? "CONTINUE PROVING" : "BEGIN PROVING"}
            </Link>
          </div>

          {/* Augmented Track */}
          <div className={`border p-6 space-y-4 ${augmentedCert?.status === "verified" ? "border-amber-500 bg-amber-500/5" : "border-neutral-800 hover:border-neutral-700"} transition-colors`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500">Augmented Track</span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-amber-500">10x.AUGMENTED</h2>
              </div>
              {augmentedCert?.status === "verified" ? (
                <span className="border border-amber-500 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
                  ✓ CERTIFIED
                </span>
              ) : (
                <span className="text-xs text-neutral-600">
                  {augmentedPassedChallenges}/{totalAugmentedChallenges}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Demonstrate mastery of AI-augmented development. 
              Speed, scale, and intelligent tooling.
            </p>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-2 bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${augmentedProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>{augmentedPassedChallenges} PASSED</span>
                <span>{Math.round(augmentedProgress)}% COMPLETE</span>
              </div>
            </div>

            <Link
              href="/challenges?track=augmented"
              className="block border border-amber-500/50 bg-amber-500/10 py-3 text-center text-xs font-bold uppercase tracking-wider text-amber-500 hover:bg-amber-500/20 transition-colors"
            >
              {augmentedCert?.status === "verified" ? "VIEW CHALLENGES" : augmentedPassedChallenges > 0 ? "CONTINUE PROVING" : "BEGIN PROVING"}
            </Link>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-neutral-800 p-4">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Challenges</p>
            <p className="mt-1 text-2xl font-bold">{totalAttempts}</p>
            <p className="text-[10px] text-neutral-600">attempted</p>
          </div>
          <div className="border border-neutral-800 p-4">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Pass Rate</p>
            <p className="mt-1 text-2xl font-bold text-signal-orange">{passRate}%</p>
            <p className="text-[10px] text-neutral-600">{passedAttempts} passed</p>
          </div>
          <div className="border border-neutral-800 p-4">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Time Spent</p>
            <p className="mt-1 text-2xl font-bold">{Math.floor(totalTimeSpent / 60)}</p>
            <p className="text-[10px] text-neutral-600">minutes</p>
          </div>
          <div className="border border-neutral-800 p-4">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Certifications</p>
            <p className="mt-1 text-2xl font-bold">{(nativeCert?.status === "verified" ? 1 : 0) + (augmentedCert?.status === "verified" ? 1 : 0)}</p>
            <p className="text-[10px] text-neutral-600">of 2 tracks</p>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              {">"} Recent Activity
            </h2>
            {recentAttempts && recentAttempts.length > 0 && (
              <Link href="/history" className="text-[10px] text-neutral-600 hover:text-signal-orange">
                VIEW ALL →
              </Link>
            )}
          </div>
          
          {recentAttempts && recentAttempts.length > 0 ? (
            <div className="border border-neutral-800 divide-y divide-neutral-800">
              {recentAttempts.slice(0, 5).map((attempt) => {
                const challenge = attempt.challenges as { title: string; track: string; difficulty: string } | null
                const duration = attempt.completed_at && attempt.started_at
                  ? Math.floor((new Date(attempt.completed_at).getTime() - new Date(attempt.started_at).getTime()) / 1000)
                  : null
                
                return (
                  <div key={attempt.id} className="flex items-center justify-between p-4 hover:bg-neutral-900/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`size-8 flex items-center justify-center text-sm ${
                        attempt.status === "passed" ? "bg-signal-orange/10 text-signal-orange border border-signal-orange/30" : 
                        attempt.status === "failed" ? "bg-red-500/10 text-red-500 border border-red-500/30" : 
                        "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                      }`}>
                        {attempt.status === "passed" ? "✓" : 
                         attempt.status === "failed" ? "✗" : "◐"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {challenge?.title || "Challenge"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] ${challenge?.track === "native" ? "text-green-600" : "text-amber-600"}`}>
                            {challenge?.track === "native" ? "NATIVE" : "AUGMENTED"}
                          </span>
                          <span className="text-neutral-700">•</span>
                          <span className="text-[10px] text-neutral-600 uppercase">
                            {challenge?.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {duration && (
                        <p className="text-xs font-mono text-neutral-400">
                          {formatDuration(duration)}
                        </p>
                      )}
                      <p className="text-[10px] text-neutral-600">
                        {formatTimeAgo(new Date(attempt.started_at))}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="border border-neutral-800 border-dashed p-12 text-center">
              <div className="text-4xl mb-4 opacity-30">🎯</div>
              <p className="text-neutral-500 text-sm mb-2">No challenges attempted yet</p>
              <p className="text-neutral-600 text-xs mb-4">Start proving your skills today</p>
              <Link 
                href="/challenges" 
                className="inline-block border border-signal-orange bg-signal-orange/10 px-6 py-2 text-xs font-bold uppercase tracking-wider text-signal-orange hover:bg-signal-orange/20"
              >
                Browse Challenges
              </Link>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-800 pt-6 pb-12">
          <div className="flex items-center justify-between text-[10px] text-neutral-600">
            <p>TENXTEN — The Proving Ground</p>
            <p>GRIT = Give Results, Inspire Trust</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
