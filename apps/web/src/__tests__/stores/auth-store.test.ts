import { describe, it, expect, beforeEach, vi } from "vitest"
import { useAuthStore } from "@/stores/auth-store"

describe("Auth Store", () => {
  beforeEach(() => {
    // Reset to initial state values
    useAuthStore.setState({
      user: null,
      profile: null,
      isLoading: true,
      isInitialized: false,
    })
  })

  describe("initial state", () => {
    it("should have correct initial values after reset", () => {
      const state = useAuthStore.getState()
      
      expect(state.user).toBeNull()
      expect(state.profile).toBeNull()
      expect(state.isLoading).toBe(true)
      expect(state.isInitialized).toBe(false)
    })
  })

  describe("setUser", () => {
    it("should update user", () => {
      const mockUser = { id: "user-1", email: "test@example.com" } as any
      
      useAuthStore.getState().setUser(mockUser)
      
      expect(useAuthStore.getState().user).toEqual(mockUser)
    })

    it("should set user to null", () => {
      const mockUser = { id: "user-1", email: "test@example.com" } as any
      useAuthStore.getState().setUser(mockUser)
      
      useAuthStore.getState().setUser(null)
      
      expect(useAuthStore.getState().user).toBeNull()
    })
  })

  describe("setProfile", () => {
    it("should update profile", () => {
      const mockProfile = {
        id: "user-1",
        callsign: "testuser",
        email: "test@example.com",
        avatar_url: null,
        identity_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      useAuthStore.getState().setProfile(mockProfile)
      
      expect(useAuthStore.getState().profile).toEqual(mockProfile)
    })
  })

  describe("reset", () => {
    it("should reset user and profile to null", () => {
      const mockUser = { id: "user-1", email: "test@example.com" } as any
      const mockProfile = {
        id: "user-1",
        callsign: "testuser",
        email: "test@example.com",
        avatar_url: null,
        identity_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      useAuthStore.getState().setUser(mockUser)
      useAuthStore.getState().setProfile(mockProfile)
      
      useAuthStore.getState().reset()
      
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.profile).toBeNull()
      expect(state.isLoading).toBe(false)
    })
  })
})
