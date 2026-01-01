"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: "WEAK", color: "bg-red-500" }
  if (score <= 2) return { score, label: "FAIR", color: "bg-amber-500" }
  if (score <= 3) return { score, label: "GOOD", color: "bg-yellow-500" }
  if (score <= 4) return { score, label: "STRONG", color: "bg-signal-orange" }
  return { score, label: "EXCELLENT", color: "bg-signal-orange/80" }
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])
  const passwordsMatch = password === confirmPassword

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setIsValidSession(!!session)
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const supabase = createClient()
    
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  if (isValidSession === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4 font-mono">
        <div className="text-center space-y-4">
          <div className="inline-block size-8 border-2 border-signal-orange border-t-transparent animate-spin" />
          <p className="text-neutral-500 text-xs uppercase tracking-wider">VERIFYING SESSION...</p>
        </div>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4 font-mono">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="border border-red-500/30 bg-red-500/5 p-8 space-y-4">
            <div className="text-5xl">⚠</div>
            <h1 className="text-xl font-bold text-red-500 uppercase tracking-wider">
              Invalid or Expired Link
            </h1>
            <p className="text-neutral-400 text-sm">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
          
          <Link
            href="/forgot-password"
            className="inline-block border border-signal-orange bg-signal-orange/10 px-6 py-2 text-xs font-bold uppercase tracking-wider text-signal-orange hover:bg-signal-orange/20"
          >
            REQUEST NEW LINK
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4 font-mono">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="border border-signal-orange/30 bg-signal-orange/5 p-8 space-y-4">
            <div className="text-5xl">✓</div>
            <h1 className="text-xl font-bold text-signal-orange uppercase tracking-wider">
              Password Updated
            </h1>
            <p className="text-neutral-400 text-sm">
              Your password has been successfully reset.
            </p>
            <div className="bg-black border border-neutral-800 p-4 text-left">
              <pre className="text-signal-orange text-xs leading-relaxed">
{`> PASSWORD RESET COMPLETE
> REDIRECTING TO DASHBOARD...`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 font-mono">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-bold text-signal-orange uppercase tracking-wider">
            Set New Password
          </h1>
          <p className="text-neutral-500 text-xs uppercase tracking-widest">
            {">"} CHOOSE A STRONG PASSWORD
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
            <span className="mr-2">✗</span>ERROR: {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-neutral-500 text-xs uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-800 bg-black px-3 py-2.5 pr-12 text-sm text-white outline-none transition-colors focus:border-signal-orange placeholder:text-neutral-600"
                placeholder="••••••••"
                autoComplete="new-password"
                autoFocus
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 text-xs"
                tabIndex={-1}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 transition-colors ${
                        i <= passwordStrength.score ? passwordStrength.color : "bg-neutral-800"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-[10px] ${
                  passwordStrength.score <= 1 ? "text-red-500" : 
                  passwordStrength.score <= 2 ? "text-amber-500" : 
                  "text-signal-orange"
                }`}>
                  STRENGTH: {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-neutral-500 text-xs uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 ${
                confirmPassword && !passwordsMatch 
                  ? "border-red-500" 
                  : confirmPassword && passwordsMatch 
                    ? "border-signal-orange" 
                    : "border-neutral-800 focus:border-signal-orange"
              }`}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
            {confirmPassword && (
              <p className={`text-[10px] ${passwordsMatch ? "text-signal-orange" : "text-red-500"}`}>
                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordsMatch || password.length < 8}
            className="w-full border border-signal-orange bg-signal-orange/10 py-2.5 text-sm font-bold uppercase tracking-wider text-signal-orange transition-colors hover:bg-signal-orange/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block size-3 border border-signal-orange border-t-transparent animate-spin" />
                UPDATING...
              </>
            ) : (
              "UPDATE PASSWORD"
            )}
          </button>
        </form>

        {/* Cancel */}
        <p className="text-center text-xs text-neutral-500">
          <Link href="/login" className="text-neutral-600 hover:text-signal-orange">
            CANCEL
          </Link>
        </p>
      </div>
    </div>
  )
}
