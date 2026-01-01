import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Tables } from "@/lib/supabase/database.types"

type Profile = Tables<"profiles">

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
  
  // Actions
  initialize: () => Promise<void>
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  fetchProfile: () => Promise<void>
  signOut: () => Promise<void>
  reset: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    const supabase = createClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      set({ user, isLoading: false, isInitialized: true })
      
      if (user) {
        await get().fetchProfile()
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        const newUser = session?.user ?? null
        set({ user: newUser })
        
        if (event === "SIGNED_IN" && newUser) {
          await get().fetchProfile()
        } else if (event === "SIGNED_OUT") {
          get().reset()
        }
      })
    } catch (error) {
      console.error("Auth initialization error:", error)
      set({ isLoading: false, isInitialized: true })
    }
  },

  setUser: (user) => set({ user }),
  
  setProfile: (profile) => set({ profile }),

  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    const supabase = createClient()
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (data) {
      set({ profile: data })
    }
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    get().reset()
  },

  reset: () => set({ 
    user: null, 
    profile: null, 
    isLoading: false 
  }),
}))
