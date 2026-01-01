"use client"

import type React from "react"
import { useState } from "react"

interface AuthModalProps {
  mode: "candidate" | "hunter"
  onClose: () => void
  onSuccess: (userType: "candidate" | "hunter") => void
}

export function AuthModal({ mode, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email && password) {
      console.log("[v0] Authentication successful for:", mode)
      onSuccess(mode)
    } else {
      setError("ACCESS_DENIED")
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-void/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-signal-orange/50 bg-card">
        <div className="border-b border-border bg-secondary/30 px-6 py-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">// AUTHENTICATION REQUIRED</div>
          <div className="text-lg uppercase tracking-wide text-foreground mt-1">
            {mode === "candidate" ? "CANDIDATE_AUTH" : "HUNTER_ACCESS"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="border border-terminal-red bg-terminal-red/10 px-4 py-3">
              <div className="text-terminal-red text-xs uppercase tracking-widest">[{error}]</div>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">EMAIL_ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-void border border-border px-4 py-3 text-foreground text-sm focus:border-signal-orange outline-none transition-colors"
              placeholder="architect@tenxten.dev"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">PASSWORD_HASH</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-void border border-border px-4 py-3 text-foreground text-sm focus:border-signal-orange outline-none transition-colors"
              placeholder="••••••••••••"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-signal-orange text-void px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-signal-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "AUTHENTICATING..." : "EXECUTE"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-border text-xs uppercase tracking-widest text-muted-foreground hover:bg-secondary/50 disabled:opacity-50 transition-colors"
            >
              ABORT
            </button>
          </div>

          <div className="text-xs text-muted-foreground uppercase tracking-widest">
            <span className="text-terminal-amber">&gt;</span> NO ACCOUNT? INITIALIZE_NEW
          </div>
        </form>
      </div>
    </div>
  )
}
