import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") || "/dashboard"
  const next = searchParams.get("next")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Handle password reset redirect
      if (next === "/auth/reset-password") {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      
      // Normal auth redirect
      const decodedRedirect = decodeURIComponent(redirect)
      return NextResponse.redirect(`${origin}${decodedRedirect}`)
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/login?error=Authentication%20failed.%20Please%20try%20again.`)
}
