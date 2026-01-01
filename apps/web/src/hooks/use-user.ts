"use client"

import { useAuthStore } from "@/stores"

export function useUser() {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const signOut = useAuthStore((state) => state.signOut)

  return {
    user,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    callsign: profile?.callsign || user?.email?.split("@")[0] || null,
    signOut,
  }
}
