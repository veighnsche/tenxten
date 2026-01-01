import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { useChallengeStore } from "@/stores/challenge-store"
import type { Tables } from "@/lib/supabase/database.types"

type Challenge = Tables<"challenges">
type TestCase = Tables<"challenge_test_cases">

const mockChallenge: Challenge = {
  id: "challenge-1",
  title: "Test Challenge",
  slug: "test-challenge",
  domain: "Algorithms",
  difficulty: "medium",
  track: "native",
  description: "Test description",
  constraints: ["constraint 1"],
  hints: ["hint 1"],
  time_limit_seconds: 2700,
  starter_code: {
    typescript: "function solve() { }",
    python: "def solve(): pass",
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockTestCases: TestCase[] = [
  {
    id: "tc-1",
    challenge_id: "challenge-1",
    input: '{"n": 5}',
    expected_output: "10",
    is_hidden: false,
    order: 1,
  },
  {
    id: "tc-2",
    challenge_id: "challenge-1",
    input: '{"n": 10}',
    expected_output: "20",
    is_hidden: true,
    order: 2,
  },
]

describe("Challenge Store", () => {
  beforeEach(() => {
    useChallengeStore.getState().reset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("initChallenge", () => {
    it("should initialize challenge with correct data", () => {
      const store = useChallengeStore.getState()
      store.initChallenge(mockChallenge, mockTestCases, "attempt-1")

      const state = useChallengeStore.getState()
      expect(state.challenge).toEqual(mockChallenge)
      expect(state.testCases).toEqual(mockTestCases)
      expect(state.attemptId).toBe("attempt-1")
      expect(state.timeRemaining).toBe(2700)
      expect(state.status).toBe("ready")
    })

    it("should set starter code based on language", () => {
      const store = useChallengeStore.getState()
      store.initChallenge(mockChallenge, mockTestCases, "attempt-1")

      expect(useChallengeStore.getState().code).toBe("function solve() { }")
      expect(useChallengeStore.getState().language).toBe("typescript")
    })
  })

  describe("setCode", () => {
    it("should update code", () => {
      const store = useChallengeStore.getState()
      store.setCode("const x = 1;")

      expect(useChallengeStore.getState().code).toBe("const x = 1;")
    })
  })

  describe("setLanguage", () => {
    it("should change language and update starter code", () => {
      const store = useChallengeStore.getState()
      store.initChallenge(mockChallenge, mockTestCases, "attempt-1")
      store.setLanguage("python")

      const state = useChallengeStore.getState()
      expect(state.language).toBe("python")
      expect(state.code).toBe("def solve(): pass")
    })
  })

  describe("timer", () => {
    it("should start timer and update status", () => {
      const store = useChallengeStore.getState()
      store.initChallenge(mockChallenge, mockTestCases, "attempt-1")
      store.startTimer()

      expect(useChallengeStore.getState().status).toBe("in_progress")
      expect(useChallengeStore.getState().startedAt).not.toBeNull()
    })

    it("should decrement time on tick", () => {
      const store = useChallengeStore.getState()
      store.initChallenge(mockChallenge, mockTestCases, "attempt-1")
      store.startTimer()

      const initialTime = useChallengeStore.getState().timeRemaining

      // Advance timer by 1 second
      vi.advanceTimersByTime(1000)

      expect(useChallengeStore.getState().timeRemaining).toBe(initialTime - 1)
    })

    it("should fail challenge when time runs out", () => {
      const store = useChallengeStore.getState()
      store.initChallenge(mockChallenge, mockTestCases, "attempt-1")
      
      // Set time to 1 second
      useChallengeStore.setState({ timeRemaining: 1 })
      store.startTimer()

      // Advance timer by 2 seconds
      vi.advanceTimersByTime(2000)

      const state = useChallengeStore.getState()
      expect(state.timeRemaining).toBe(0)
      expect(state.status).toBe("failed")
    })

    it("should pause timer", () => {
      const store = useChallengeStore.getState()
      store.initChallenge(mockChallenge, mockTestCases, "attempt-1")
      store.startTimer()

      vi.advanceTimersByTime(1000)
      const timeAfterStart = useChallengeStore.getState().timeRemaining

      store.pauseTimer()
      vi.advanceTimersByTime(5000)

      // Time should not have changed after pause
      expect(useChallengeStore.getState().timeRemaining).toBe(timeAfterStart)
    })
  })

  describe("reset", () => {
    it("should reset all state to initial values", () => {
      const store = useChallengeStore.getState()
      store.initChallenge(mockChallenge, mockTestCases, "attempt-1")
      store.setCode("some code")
      store.startTimer()

      store.reset()

      const state = useChallengeStore.getState()
      expect(state.challenge).toBeNull()
      expect(state.code).toBe("")
      expect(state.status).toBe("idle")
      expect(state.timerInterval).toBeNull()
    })
  })
})
