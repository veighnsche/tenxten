"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    const supabase = createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    )

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4 font-mono">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="border border-signal-orange/30 bg-signal-orange/5 p-8 space-y-4">
            <div className="text-5xl">🔑</div>
            <h1 className="text-xl font-bold text-signal-orange uppercase tracking-wider">
              Reset Link Sent
            </h1>
            <p className="text-neutral-400 text-sm">
              If an account exists with this email, you will receive a password reset link.
            </p>
            <div className="bg-black border border-neutral-800 p-4 text-left">
              <pre className="text-signal-orange text-xs leading-relaxed">
{`> PASSWORD RESET INITIATED
> TARGET: ${email}
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
              className="inline-block text-xs text-signal-orange hover:underline"
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
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-bold text-signal-orange uppercase tracking-wider">
            Reset Password
          </h1>
          <p className="text-neutral-500 text-xs uppercase tracking-widest">
            {">"} RECOVER ACCESS TO YOUR ACCOUNT
          </p>
        </div>

        {/* Info */}
        <div className="border border-neutral-800 bg-neutral-900/30 px-4 py-3 text-xs text-neutral-400">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </div>

        {/* Error Message */}
        {error && (
          <div className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
            <span className="mr-2">✗</span>ERROR: {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-neutral-500 text-xs uppercase tracking-wider">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-800 bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-signal-orange placeholder:text-neutral-600"
              placeholder="operator@tenxten.dev"
              autoComplete="email"
              autoFocus
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-signal-orange bg-signal-orange/10 py-2.5 text-sm font-bold uppercase tracking-wider text-signal-orange transition-colors hover:bg-signal-orange/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block size-3 border border-signal-orange border-t-transparent animate-spin" />
                SENDING...
              </>
            ) : (
              "SEND RESET LINK"
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-xs text-neutral-500">
          Remember your password?{" "}
          <Link href="/login" className="text-signal-orange hover:underline">
            AUTHENTICATE
          </Link>
        </p>
      </div>
    </div>
  )
}
