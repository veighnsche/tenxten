"use client"

import { useState, useMemo } from "react"
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
  if (score <= 4) return { score, label: "STRONG", color: "bg-green-500" }
  return { score, label: "EXCELLENT", color: "bg-green-400" }
}

function validateCallsign(callsign: string): { valid: boolean; error?: string } {
  if (callsign.length < 3) return { valid: false, error: "Minimum 3 characters" }
  if (callsign.length > 20) return { valid: false, error: "Maximum 20 characters" }
  if (!/^[a-z0-9_]+$/.test(callsign)) return { valid: false, error: "Only lowercase letters, numbers, underscores" }
  if (/^[0-9]/.test(callsign)) return { valid: false, error: "Cannot start with a number" }
  if (/^_|_$/.test(callsign)) return { valid: false, error: "Cannot start or end with underscore" }
  return { valid: true }
}

export default function SignUpPage() {
  const [callsign, setCallsign] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [callsignTouched, setCallsignTouched] = useState(false)

  const callsignValidation = useMemo(() => validateCallsign(callsign), [callsign])
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])
  const passwordsMatch = password === confirmPassword

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate callsign
    if (!callsignValidation.valid) {
      setError(callsignValidation.error || "Invalid callsign")
      setLoading(false)
      return
    }

    // Validate email
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    // Validate password
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
    
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          callsign: callsign.toLowerCase(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes("already registered")) {
        setError("An account with this email already exists")
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  const handleOAuth = async (provider: "github" | "google") => {
    setOauthLoading(provider)
    setError(null)
    
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setOauthLoading(null)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4 font-mono">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="border border-green-500/30 bg-green-500/5 p-8 space-y-4">
            <div className="text-5xl">✉</div>
            <h1 className="text-xl font-bold text-green-500 uppercase tracking-wider">
              Verification Required
            </h1>
            <p className="text-neutral-400 text-sm">
              Check your email for a verification link to complete initialization.
            </p>
            <div className="bg-black border border-neutral-800 p-4 text-left">
              <pre className="text-green-500 text-xs leading-relaxed">
{`> INITIALIZATION PENDING...
> AWAITING EMAIL CONFIRMATION
> TARGET: ${email}
> CALLSIGN: @${callsign}
>
> [CHECK YOUR INBOX]`}
              </pre>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-neutral-600 text-xs">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
            <Link
              href="/login"
              className="inline-block text-xs text-green-500 hover:underline"
            >
              ← RETURN TO LOGIN
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 font-mono">
      <div className="w-full max-w-md space-y-6">
        {/* Terminal Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-bold text-green-500 uppercase tracking-wider">
            Initialize Account
          </h1>
          <p className="text-neutral-500 text-xs uppercase tracking-widest">
            {">"} CREATE NEW OPERATOR PROFILE
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
            <span className="mr-2">✗</span>ERROR: {error}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Callsign */}
          <div className="space-y-2">
            <label htmlFor="callsign" className="text-neutral-500 text-xs uppercase tracking-wider">
              Callsign
            </label>
            <div className={`flex items-center border bg-black transition-colors ${
              callsignTouched && !callsignValidation.valid 
                ? "border-red-500" 
                : callsignTouched && callsignValidation.valid 
                  ? "border-green-500" 
                  : "border-neutral-800 focus-within:border-green-500"
            }`}>
              <span className="px-3 text-neutral-600 text-sm">@</span>
              <input
                id="callsign"
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                onBlur={() => setCallsignTouched(true)}
                className="w-full bg-transparent py-2.5 pr-3 text-sm text-white outline-none placeholder:text-neutral-600"
                placeholder="your_callsign"
                maxLength={20}
                autoComplete="username"
                disabled={loading}
              />
              {callsignTouched && callsign && (
                <span className={`pr-3 text-xs ${callsignValidation.valid ? "text-green-500" : "text-red-500"}`}>
                  {callsignValidation.valid ? "✓" : "✗"}
                </span>
              )}
            </div>
            <p className={`text-[10px] ${callsignTouched && !callsignValidation.valid ? "text-red-500" : "text-neutral-600"}`}>
              {callsignTouched && !callsignValidation.valid ? callsignValidation.error : "3-20 chars, lowercase, numbers, underscores"}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-neutral-500 text-xs uppercase tracking-wider">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-800 bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-green-500 placeholder:text-neutral-600"
              placeholder="operator@tenxten.dev"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-neutral-500 text-xs uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-800 bg-black px-3 py-2.5 pr-12 text-sm text-white outline-none transition-colors focus:border-green-500 placeholder:text-neutral-600"
                placeholder="••••••••"
                autoComplete="new-password"
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
                  "text-green-500"
                }`}>
                  STRENGTH: {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-neutral-500 text-xs uppercase tracking-wider">
              Confirm Password
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
                    ? "border-green-500" 
                    : "border-neutral-800 focus:border-green-500"
              }`}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
            {confirmPassword && (
              <p className={`text-[10px] ${passwordsMatch ? "text-green-500" : "text-red-500"}`}>
                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !!oauthLoading || !callsignValidation.valid || !passwordsMatch || password.length < 8}
            className="w-full border border-green-500 bg-green-500/10 py-2.5 text-sm font-bold uppercase tracking-wider text-green-500 transition-colors hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block size-3 border border-green-500 border-t-transparent animate-spin" />
                INITIALIZING...
              </>
            ) : (
              "INITIALIZE ACCOUNT"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-neutral-800" />
          <span className="text-neutral-600 text-xs">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-neutral-800" />
        </div>

        {/* OAuth */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("github")}
            disabled={loading || !!oauthLoading}
            className="flex items-center justify-center gap-2 border border-neutral-800 bg-black py-2.5 text-sm uppercase tracking-wider text-white transition-colors hover:border-neutral-600 hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {oauthLoading === "github" ? (
              <span className="inline-block size-4 border border-white border-t-transparent animate-spin" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            GitHub
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={loading || !!oauthLoading}
            className="flex items-center justify-center gap-2 border border-neutral-800 bg-black py-2.5 text-sm uppercase tracking-wider text-white transition-colors hover:border-neutral-600 hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {oauthLoading === "google" ? (
              <span className="inline-block size-4 border border-white border-t-transparent animate-spin" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Google
          </button>
        </div>

        {/* Login link */}
        <div className="space-y-3 pt-2">
          <p className="text-center text-xs text-neutral-500">
            Already initialized?{" "}
            <Link href="/login" className="text-green-500 hover:underline">
              AUTHENTICATE
            </Link>
          </p>
          <p className="text-center text-[10px] text-neutral-700">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
