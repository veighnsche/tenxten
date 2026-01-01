import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .eq("user_id", user.id)

  const { data: recentAttempts } = await supabase
    .from("challenge_attempts")
    .select("*, challenges(*)")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(5)

  const nativeCert = certifications?.find(c => c.track === "native")
  const augmentedCert = certifications?.find(c => c.track === "augmented")

  return (
    <div className="min-h-screen bg-black p-6 font-mono text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-800 pb-6">
          <div>
            <p className="text-neutral-500 text-xs uppercase tracking-widest">
              {">"} OPERATOR DASHBOARD
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              @{profile?.callsign || user.email?.split("@")[0]}
            </h1>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-neutral-500 text-xs uppercase tracking-wider hover:text-red-500">
              [TERMINATE SESSION]
            </button>
          </form>
        </header>

        {/* Certification Status */}
        <section className="grid gap-4 md:grid-cols-2">
          {/* Native Cert */}
          <div className={`border p-6 ${nativeCert?.status === "verified" ? "border-green-500 bg-green-500/5" : "border-neutral-800"}`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-500">Track</span>
                <h2 className="mt-1 text-lg font-bold text-green-500">10x.NATIVE</h2>
                <p className="mt-2 text-xs text-neutral-400">
                  Prove your skills without AI assistance
                </p>
              </div>
              {nativeCert?.status === "verified" ? (
                <span className="border border-green-500 bg-green-500/10 px-2 py-1 text-xs font-bold text-green-500">
                  VERIFIED
                </span>
              ) : (
                <span className="border border-neutral-700 px-2 py-1 text-xs text-neutral-500">
                  NOT STARTED
                </span>
              )}
            </div>
            <Link
              href="/challenges?track=native"
              className="mt-4 inline-block text-xs text-green-500 hover:underline"
            >
              {nativeCert ? "VIEW PROGRESS →" : "BEGIN PROVING →"}
            </Link>
          </div>

          {/* Augmented Cert */}
          <div className={`border p-6 ${augmentedCert?.status === "verified" ? "border-amber-500 bg-amber-500/5" : "border-neutral-800"}`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-500">Track</span>
                <h2 className="mt-1 text-lg font-bold text-amber-500">10x.AUGMENTED</h2>
                <p className="mt-2 text-xs text-neutral-400">
                  Prove your AI-augmented productivity
                </p>
              </div>
              {augmentedCert?.status === "verified" ? (
                <span className="border border-amber-500 bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-500">
                  VERIFIED
                </span>
              ) : (
                <span className="border border-neutral-700 px-2 py-1 text-xs text-neutral-500">
                  NOT STARTED
                </span>
              )}
            </div>
            <Link
              href="/challenges?track=augmented"
              className="mt-4 inline-block text-xs text-amber-500 hover:underline"
            >
              {augmentedCert ? "VIEW PROGRESS →" : "BEGIN PROVING →"}
            </Link>
          </div>
        </section>

        {/* 100x Status */}
        {nativeCert?.status === "verified" && augmentedCert?.status === "verified" && (
          <section className="border border-purple-500 bg-purple-500/5 p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏆</div>
              <div>
                <h2 className="text-lg font-bold text-purple-500">100x.PROVEN</h2>
                <p className="text-xs text-neutral-400">
                  You have achieved the ultimate certification. 10x × 10x = 100x.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Recent Activity */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            {">"} RECENT ACTIVITY
          </h2>
          
          {recentAttempts && recentAttempts.length > 0 ? (
            <div className="divide-y divide-neutral-800 border border-neutral-800">
              {recentAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-4">
                  <div>
                    <span className={`mr-2 text-xs ${
                      attempt.status === "passed" ? "text-green-500" : 
                      attempt.status === "failed" ? "text-red-500" : 
                      "text-amber-500"
                    }`}>
                      {attempt.status === "passed" ? "✓" : 
                       attempt.status === "failed" ? "✗" : "◐"}
                    </span>
                    <span className="text-sm">
                      {(attempt.challenges as { title: string })?.title || "Challenge"}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    {new Date(attempt.started_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-neutral-800 p-8 text-center">
              <p className="text-neutral-500 text-sm">No challenges attempted yet</p>
              <Link href="/challenges" className="mt-2 inline-block text-xs text-green-500 hover:underline">
                START YOUR FIRST CHALLENGE →
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
