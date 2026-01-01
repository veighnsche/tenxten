"use client"

interface Candidate {
  id: string
  stack: string
  timeToResolve: string
  gritScore: number
  verified: boolean
  timestamp: string
}

const mockCandidates: Candidate[] = [
  {
    id: "0x4A2F...89B3",
    stack: "RUST/ACTIX",
    timeToResolve: "42m",
    gritScore: 98,
    verified: true,
    timestamp: "2026-01-01T08:23:00Z",
  },
  {
    id: "0x7C1E...22D4",
    stack: "GO/FIBER",
    timeToResolve: "1h 12m",
    gritScore: 94,
    verified: true,
    timestamp: "2026-01-01T07:15:00Z",
  },
  {
    id: "0x9B3A...44F1",
    stack: "TYPESCRIPT/NODE",
    timeToResolve: "38m",
    gritScore: 96,
    verified: true,
    timestamp: "2026-01-01T06:42:00Z",
  },
  {
    id: "0x2D5C...77E8",
    stack: "PYTHON/FASTAPI",
    timeToResolve: "1h 5m",
    gritScore: 91,
    verified: false,
    timestamp: "2026-01-01T05:33:00Z",
  },
  {
    id: "0x8F4B...99A2",
    stack: "ELIXIR/PHOENIX",
    timeToResolve: "52m",
    gritScore: 97,
    verified: true,
    timestamp: "2026-01-01T04:18:00Z",
  },
]

interface HunterDashboardProps {
  onClose?: () => void
}

export function HunterDashboard({ onClose }: HunterDashboardProps) {
  return (
    <div className="min-h-screen bg-void text-foreground pt-16">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">
                HUNTER MODE // OBSERVATORY
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground uppercase">REGISTRY</h1>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-xs uppercase tracking-widest text-terminal-red border border-terminal-red px-4 py-2 hover:bg-terminal-red/10 transition-colors"
              >
                EXIT
              </button>
            )}
          </div>
          <div className="text-terminal-green text-xs uppercase tracking-widest">SCANNING FOR 10x10 ARCHITECTS</div>
        </header>

        <div className="border border-border bg-card p-6 mb-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">// REALTIME METRICS</div>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-terminal-green mb-1">1,337</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">TOTAL CERTIFIED</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-terminal-amber mb-1">23</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">IN PROGRESS</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground mb-1">47m</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">AVG TIME</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-terminal-green mb-1">95%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">AVG GRIT SCORE</div>
            </div>
          </div>
        </div>

        <div className="border border-border bg-card">
          <div className="border-b border-border px-6 py-3 bg-secondary/30">
            <div className="grid grid-cols-6 gap-4 text-xs uppercase tracking-widest text-muted-foreground">
              <div>HASH_ID</div>
              <div>STACK</div>
              <div>TIME</div>
              <div>GRIT_SCORE</div>
              <div>STATUS</div>
              <div>TIMESTAMP</div>
            </div>
          </div>
          <div className="divide-y divide-border">
            {mockCandidates.map((candidate) => (
              <div key={candidate.id} className="px-6 py-4 hover:bg-secondary/20 transition-colors">
                <div className="grid grid-cols-6 gap-4 text-xs items-center">
                  <div className="font-mono text-terminal-green">{candidate.id}</div>
                  <div className="text-foreground uppercase tracking-wider">{candidate.stack}</div>
                  <div className="text-foreground">{candidate.timeToResolve}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-terminal-green font-bold">{candidate.gritScore}%</div>
                    <div className="flex-1 bg-border h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-terminal-green h-full transition-all"
                        style={{ width: `${candidate.gritScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    {candidate.verified ? (
                      <span className="text-terminal-green uppercase tracking-widest">[VERIFIED]</span>
                    ) : (
                      <span className="text-terminal-amber uppercase tracking-widest">[PENDING]</span>
                    )}
                  </div>
                  <div className="text-muted-foreground">{new Date(candidate.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-widest">
            <span className="text-terminal-amber">&gt;</span> EXPORT OPTIONS: .CSV | .JSON | DIRECT_PIPELINE
          </div>
        </div>
      </div>
    </div>
  )
}
