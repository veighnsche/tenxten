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
]

// Test the store directly since hooks require React context
describe("useChallenge Hook (via store)", () => {
  beforeEach(() => {
    useChallengeStore.getState().reset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should have initial state", () => {
    const state = useChallengeStore.getState()

    expect(state.challenge).toBeNull()
    expect(state.code).toBe("")
    expect(state.status).toBe("idle")
  })

  it("should have challenge data after init", () => {
    useChallengeStore.getState().initChallenge(mockChallenge, mockTestCases, "attempt-1")

    const state = useChallengeStore.getState()

    expect(state.challenge).toEqual(mockChallenge)
    expect(state.timeRemaining).toBe(2700)
    expect(state.status).toBe("ready")
  })

  it("should calculate time percentage correctly", () => {
    useChallengeStore.getState().initChallenge(mockChallenge, mockTestCases, "attempt-1")
    useChallengeStore.setState({ timeRemaining: 1350 }) // Half time

    const state = useChallengeStore.getState()
    const timePercentage = (state.timeRemaining / mockChallenge.time_limit_seconds) * 100

    expect(timePercentage).toBe(50)
  })

  it("should detect time warning at 25%", () => {
    useChallengeStore.getState().initChallenge(mockChallenge, mockTestCases, "attempt-1")
    useChallengeStore.setState({ timeRemaining: 675 }) // 25% of 2700

    const state = useChallengeStore.getState()
    const timePercentage = (state.timeRemaining / mockChallenge.time_limit_seconds) * 100
    const isTimeWarning = timePercentage <= 25

    expect(isTimeWarning).toBe(true)
  })

  it("should detect time critical at 10%", () => {
    useChallengeStore.getState().initChallenge(mockChallenge, mockTestCases, "attempt-1")
    useChallengeStore.setState({ timeRemaining: 270 }) // 10% of 2700

    const state = useChallengeStore.getState()
    const timePercentage = (state.timeRemaining / mockChallenge.time_limit_seconds) * 100
    const isTimeCritical = timePercentage <= 10

    expect(isTimeCritical).toBe(true)
  })

  it("should count passed and failed tests", () => {
    useChallengeStore.getState().initChallenge(mockChallenge, mockTestCases, "attempt-1")
    useChallengeStore.setState({
      testResults: [
        { id: "1", name: "Test 1", status: "passed" },
        { id: "2", name: "Test 2", status: "passed" },
        { id: "3", name: "Test 3", status: "failed" },
      ],
    })

    const state = useChallengeStore.getState()
    const passedTests = state.testResults.filter((t) => t.status === "passed").length
    const failedTests = state.testResults.filter((t) => t.status === "failed").length

    expect(passedTests).toBe(2)
    expect(failedTests).toBe(1)
    expect(state.testResults.length).toBe(3)
  })

  it("should detect completed status", () => {
    useChallengeStore.getState().initChallenge(mockChallenge, mockTestCases, "attempt-1")

    expect(useChallengeStore.getState().status).toBe("ready")

    useChallengeStore.setState({ status: "passed" })

    expect(useChallengeStore.getState().status).toBe("passed")
  })

  it("should update code via setCode", () => {
    useChallengeStore.getState().setCode("const x = 1;")

    expect(useChallengeStore.getState().code).toBe("const x = 1;")
  })

  it("should update language via setLanguage", () => {
    useChallengeStore.getState().initChallenge(mockChallenge, mockTestCases, "attempt-1")
    useChallengeStore.getState().setLanguage("python")

    expect(useChallengeStore.getState().language).toBe("python")
  })
})
