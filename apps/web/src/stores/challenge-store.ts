import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Tables } from "@/lib/supabase/database.types"

type Challenge = Tables<"challenges">
type TestCase = Tables<"challenge_test_cases">

export type TestStatus = "pending" | "running" | "passed" | "failed"

export interface TestResult {
  id: string
  name: string
  status: TestStatus
  input?: string
  expected?: string
  actual?: string
  executionTime?: number
  error?: string
}

interface ChallengeState {
  // Current challenge
  challenge: Challenge | null
  testCases: TestCase[]
  
  // Attempt state
  attemptId: string | null
  code: string
  language: string
  
  // Timer
  startedAt: number | null
  timeRemaining: number
  timerInterval: NodeJS.Timeout | null
  
  // Test execution
  testResults: TestResult[]
  isRunning: boolean
  isSubmitting: boolean
  output: string
  
  // Status
  status: "idle" | "ready" | "in_progress" | "submitted" | "passed" | "failed"
  
  // Actions
  initChallenge: (challenge: Challenge, testCases: TestCase[], attemptId: string) => void
  setCode: (code: string) => void
  setLanguage: (language: string) => void
  
  // Timer actions
  startTimer: () => void
  pauseTimer: () => void
  tick: () => void
  
  // Test actions
  runTests: () => Promise<void>
  submitChallenge: () => Promise<void>
  setTestResults: (results: TestResult[]) => void
  
  // Reset
  reset: () => void
}

const initialState = {
  challenge: null,
  testCases: [],
  attemptId: null,
  code: "",
  language: "typescript",
  startedAt: null,
  timeRemaining: 0,
  timerInterval: null,
  testResults: [],
  isRunning: false,
  isSubmitting: false,
  output: "",
  status: "idle" as const,
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initChallenge: (challenge, testCases, attemptId) => {
        const starterCode = challenge.starter_code as Record<string, string>
        const code = starterCode?.typescript || starterCode?.javascript || ""
        
        set({
          challenge,
          testCases,
          attemptId,
          code,
          language: "typescript",
          timeRemaining: challenge.time_limit_seconds,
          status: "ready",
          testResults: [],
          output: "",
        })
      },

      setCode: (code) => set({ code }),
      
      setLanguage: (language) => {
        const { challenge } = get()
        if (challenge) {
          const starterCode = challenge.starter_code as Record<string, string>
          const code = starterCode?.[language] || ""
          set({ language, code })
        } else {
          set({ language })
        }
      },

      startTimer: () => {
        const { timerInterval, status } = get()
        
        // Clear existing interval
        if (timerInterval) {
          clearInterval(timerInterval)
        }
        
        // Start the timer
        const interval = setInterval(() => {
          get().tick()
        }, 1000)
        
        set({ 
          timerInterval: interval,
          startedAt: status === "ready" ? Date.now() : get().startedAt,
          status: "in_progress",
        })
      },

      pauseTimer: () => {
        const { timerInterval } = get()
        if (timerInterval) {
          clearInterval(timerInterval)
          set({ timerInterval: null })
        }
      },

      tick: () => {
        const { timeRemaining, timerInterval } = get()
        
        if (timeRemaining <= 0) {
          if (timerInterval) clearInterval(timerInterval)
          set({ 
            timeRemaining: 0, 
            timerInterval: null,
            status: "failed",
            output: "> TIME EXPIRED\n> Challenge failed due to timeout.",
          })
          return
        }
        
        set({ timeRemaining: timeRemaining - 1 })
      },

      runTests: async () => {
        const { testCases, code, language } = get()
        
        set({ 
          isRunning: true, 
          output: "> Executing tests...\n",
          testResults: testCases
            .filter(tc => !tc.is_hidden)
            .map((tc, i) => ({
              id: tc.id,
              name: `Test Case ${i + 1}`,
              status: "running" as TestStatus,
            }))
        })

        // Simulate test execution (in production, this would call a code execution API)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock results for now
        const results: TestResult[] = testCases
          .filter(tc => !tc.is_hidden)
          .map((tc, i) => {
            const passed = Math.random() > 0.3 // 70% pass rate for demo
            return {
              id: tc.id,
              name: `Test Case ${i + 1}`,
              status: passed ? "passed" : "failed",
              input: tc.input,
              expected: tc.expected_output,
              actual: passed ? tc.expected_output : "incorrect output",
              executionTime: Math.floor(Math.random() * 50) + 1,
            }
          })

        const passedCount = results.filter(r => r.status === "passed").length
        const totalCount = results.length

        set({ 
          isRunning: false,
          testResults: results,
          output: `> Execution complete\n> ${passedCount}/${totalCount} tests passed\n`,
        })
      },

      submitChallenge: async () => {
        const { testCases, code, language } = get()
        
        set({ 
          isSubmitting: true,
          output: "> Submitting solution...\n> Running all test cases (including hidden)...\n",
        })

        // Run all tests including hidden ones
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock final results
        const allPassed = Math.random() > 0.5
        
        const results: TestResult[] = testCases.map((tc, i) => ({
          id: tc.id,
          name: tc.is_hidden ? `Hidden Test ${i + 1}` : `Test Case ${i + 1}`,
          status: allPassed ? "passed" : (Math.random() > 0.3 ? "passed" : "failed"),
          executionTime: Math.floor(Math.random() * 50) + 1,
        }))

        const passedCount = results.filter(r => r.status === "passed").length
        const totalCount = results.length
        const passed = passedCount === totalCount

        get().pauseTimer()

        set({
          isSubmitting: false,
          testResults: results,
          status: passed ? "passed" : "failed",
          output: passed 
            ? `> ALL TESTS PASSED\n> Challenge completed successfully!\n> Time: ${get().challenge?.time_limit_seconds ? get().challenge!.time_limit_seconds - get().timeRemaining : 0}s`
            : `> ${passedCount}/${totalCount} tests passed\n> Some tests failed. Try again.`,
        })
      },

      setTestResults: (results) => set({ testResults: results }),

      reset: () => {
        const { timerInterval } = get()
        if (timerInterval) clearInterval(timerInterval)
        set(initialState)
      },
    }),
    {
      name: "challenge-store",
      partialize: (state) => ({
        // Only persist these fields
        attemptId: state.attemptId,
        code: state.code,
        language: state.language,
        timeRemaining: state.timeRemaining,
        startedAt: state.startedAt,
      }),
    }
  )
)
