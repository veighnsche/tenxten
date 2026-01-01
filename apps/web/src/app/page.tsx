"use client"

import { useState } from "react"
import { StatusBar } from "@/components/status-bar"
import { CLIInterface } from "@/components/cli-interface"
import { HunterDashboard } from "@/components/hunter-dashboard"
import { AuthModal } from "@/components/auth-modal"
import { ChallengeInterface } from "@/components/challenge-interface"

type AppMode = "landing" | "challenge" | "hunter"
type AuthState = "unauthenticated" | "candidate" | "hunter"

export default function Home() {
  const [mode, setMode] = useState<AppMode>("landing")
  const [authState, setAuthState] = useState<AuthState>("unauthenticated")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingMode, setPendingMode] = useState<"candidate" | "hunter" | null>(null)

  const handleCommand = (command: string) => {
    console.log("[v0] Command received:", command)

    if (command === "/hunter") {
      setPendingMode("hunter")
      setShowAuthModal(true)
    } else if (command === "initialize" || command === "prove") {
      setPendingMode("candidate")
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = (userType: "candidate" | "hunter") => {
    console.log("[v0] Auth successful for:", userType)
    setAuthState(userType)
    setShowAuthModal(false)

    if (userType === "hunter") {
      setMode("hunter")
    } else {
      setMode("challenge")
    }
    setPendingMode(null)
  }

  const handleAuthClose = () => {
    setShowAuthModal(false)
    setPendingMode(null)
  }

  const handleHunterClose = () => {
    setMode("landing")
  }

  return (
    <>
      <StatusBar />
      <div className="min-h-screen bg-void text-foreground flex flex-col pt-12">
        {mode === "landing" && <CLIInterface onCommand={handleCommand} />}
        {mode === "challenge" && <ChallengeInterface />}
        {mode === "hunter" && <HunterDashboard onClose={handleHunterClose} />}

        <footer className="px-6 py-4 border-t border-border mt-auto">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground">
            <span>
              MODE:{" "}
              <span
                className={
                  mode === "hunter"
                    ? "text-terminal-red"
                    : mode === "challenge"
                      ? "text-terminal-amber"
                      : "text-terminal-green"
                }
              >
                {mode.toUpperCase()}
              </span>
            </span>
            <span>
              AUTH:{" "}
              <span className={authState !== "unauthenticated" ? "text-terminal-green" : "text-muted-foreground"}>
                {authState.toUpperCase()}
              </span>
            </span>
            <span>BUILD: 2026.01.01</span>
          </div>
        </footer>
      </div>

      {showAuthModal && pendingMode && (
        <AuthModal mode={pendingMode} onClose={handleAuthClose} onSuccess={handleAuthSuccess} />
      )}
    </>
  )
}
