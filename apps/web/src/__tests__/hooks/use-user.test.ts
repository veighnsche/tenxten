import { describe, it, expect, beforeEach } from "vitest"
import { useAuthStore } from "@/stores/auth-store"

// Test the store directly since hooks require React context
describe("useUser Hook (via store)", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      profile: null,
      isLoading: false,
      isInitialized: true,
    })
  })

  it("should have null user when not authenticated", () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
  })

  it("should have user when set", () => {
    const mockUser = { id: "user-1", email: "test@example.com" } as any
    useAuthStore.getState().setUser(mockUser)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
  })

  it("should have callsign from profile", () => {
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

    const state = useAuthStore.getState()
    expect(state.profile?.callsign).toBe("testuser")
  })

  it("should track isLoading state", () => {
    useAuthStore.setState({ isLoading: true })
    expect(useAuthStore.getState().isLoading).toBe(true)

    useAuthStore.setState({ isLoading: false })
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it("should track isInitialized state", () => {
    useAuthStore.setState({ isInitialized: false })
    expect(useAuthStore.getState().isInitialized).toBe(false)

    useAuthStore.setState({ isInitialized: true })
    expect(useAuthStore.getState().isInitialized).toBe(true)
  })
})
