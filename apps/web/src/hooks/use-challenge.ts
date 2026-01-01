"use client"

import { useChallengeStore } from "@/stores"

export function useChallenge() {
  const challenge = useChallengeStore((state) => state.challenge)
  const code = useChallengeStore((state) => state.code)
  const language = useChallengeStore((state) => state.language)
  const timeRemaining = useChallengeStore((state) => state.timeRemaining)
  const testResults = useChallengeStore((state) => state.testResults)
  const isRunning = useChallengeStore((state) => state.isRunning)
  const isSubmitting = useChallengeStore((state) => state.isSubmitting)
  const output = useChallengeStore((state) => state.output)
  const status = useChallengeStore((state) => state.status)

  const setCode = useChallengeStore((state) => state.setCode)
  const setLanguage = useChallengeStore((state) => state.setLanguage)
  const startTimer = useChallengeStore((state) => state.startTimer)
  const runTests = useChallengeStore((state) => state.runTests)
  const submitChallenge = useChallengeStore((state) => state.submitChallenge)
  const reset = useChallengeStore((state) => state.reset)

  const totalTime = challenge?.time_limit_seconds || 0
  const timePercentage = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0
  const isTimeWarning = timePercentage <= 25
  const isTimeCritical = timePercentage <= 10

  const passedTests = testResults.filter((t) => t.status === "passed").length
  const failedTests = testResults.filter((t) => t.status === "failed").length
  const totalTests = testResults.length

  return {
    // Challenge data
    challenge,
    code,
    language,
    
    // Timer
    timeRemaining,
    totalTime,
    timePercentage,
    isTimeWarning,
    isTimeCritical,
    
    // Tests
    testResults,
    passedTests,
    failedTests,
    totalTests,
    output,
    
    // Status
    status,
    isRunning,
    isSubmitting,
    isCompleted: status === "passed" || status === "failed",
    
    // Actions
    setCode,
    setLanguage,
    startTimer,
    runTests,
    submitChallenge,
    reset,
  }
}
