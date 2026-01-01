"use client"

import type React from "react"

import { useState, useEffect } from "react"

function BlinkingCursor() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setVisible((v) => !v), 530)
    return () => clearInterval(interval)
  }, [])

  return <span className={`${visible ? "opacity-100" : "opacity-0"} text-signal-orange`}>_</span>
}

function SystemCheck({
  label,
  status,
  delay,
}: {
  label: string
  status: "OK" | "PENDING" | "FAILED"
  delay: number
}) {
  const [currentStatus, setCurrentStatus] = useState<"LOADING" | "OK" | "PENDING" | "FAILED">("LOADING")

  useEffect(() => {
    const timer = setTimeout(() => setCurrentStatus(status), delay)
    return () => clearTimeout(timer)
  }, [status, delay])

  const statusColor = {
    LOADING: "text-muted-foreground",
    OK: "text-signal-orange",
    PENDING: "text-terminal-amber",
    FAILED: "text-terminal-red",
  }

  const statusText = {
    LOADING: "...",
    OK: "VERIFIED",
    PENDING: "PENDING",
    FAILED: "FAILED",
  }

  return (
    <div className="flex justify-between gap-8 text-xs uppercase tracking-widest">
      <span className="text-muted-foreground">{label}</span>
      <span className={statusColor[currentStatus]}>[{statusText[currentStatus]}]</span>
    </div>
  )
}

interface CLIInterfaceProps {
  onCommand?: (command: string) => void
}

export function CLIInterface({ onCommand }: CLIInterfaceProps) {
  const [initialized, setInitialized] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showPrompt, setShowPrompt] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setInitialized(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (initialized) {
      const timer = setTimeout(() => setShowPrompt(true), 500)
      return () => clearTimeout(timer)
    }
  }, [initialized])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const command = inputValue.trim().toLowerCase()

    if (command) {
      setCommandHistory((prev) => [...prev, inputValue])
      onCommand?.(command)
      setInputValue("")
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-3xl mx-auto w-full">
      <header className="mb-12">
        <div className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">SYSTEM BOOT v1.0.0</div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground uppercase">TENXTEN</h1>
        <div className="text-signal-orange text-xs uppercase tracking-widest mt-2">THE PROVING GROUND</div>
      </header>

      <div className="border border-border p-6 mb-8 bg-card">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">// SYSTEM DIAGNOSTICS</div>
        <div className="space-y-2">
          <SystemCheck label="Git Protocol" status="OK" delay={400} />
          <SystemCheck label="Logic Core" status="OK" delay={800} />
          <SystemCheck label="Memory Allocation" status="OK" delay={1200} />
          <SystemCheck label="Grit Index" status="PENDING" delay={1600} />
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <p className="text-sm leading-relaxed text-smoke">
          <span className="text-terminal-amber">&gt;</span> AI has democratized code generation. Anyone can produce
          syntax. But <span className="text-foreground">generating code is not engineering.</span>
        </p>
        <p className="text-sm leading-relaxed text-smoke">
          <span className="text-terminal-amber">&gt;</span> This platform exists to separate the{" "}
          <span className="text-terminal-red">Prompt Kiddies</span> from the{" "}
          <span className="text-signal-orange">10x10 Architects</span>.
        </p>
      </div>

      <div className="border border-border p-4 bg-secondary/50 mb-8">
        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3">// THE MULTIPLIER</div>
        <div className="font-bold text-lg text-foreground tracking-wide">
          10x <span className="text-muted-foreground">BEFORE AI</span> × 10x{" "}
          <span className="text-muted-foreground">WITH AI</span> = <span className="text-signal-orange">100x</span>
        </div>
      </div>

      {commandHistory.length > 0 && (
        <div className="border border-border p-4 mb-4 bg-void/50 max-h-32 overflow-y-auto">
          {commandHistory.map((cmd, i) => (
            <div key={i} className="text-xs text-muted-foreground mb-1">
              <span className="text-signal-orange">$</span> {cmd}
            </div>
          ))}
        </div>
      )}

      {showPrompt ? (
        <form onSubmit={handleSubmit} className="border border-signal-orange/50 bg-void">
          <div className="flex items-center px-4 py-4">
            <span className="text-signal-orange mr-3 text-base">$</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="TYPE 'INITIALIZE' OR 'PROVE'"
              className="flex-1 bg-transparent text-foreground placeholder:text-smoke text-sm uppercase tracking-widest outline-none"
              autoFocus
            />
            <BlinkingCursor />
          </div>
        </form>
      ) : (
        <div className="border border-border px-4 py-4">
          <span className="text-muted-foreground text-sm uppercase tracking-widest">
            INITIALIZING<span className="animate-pulse">...</span>
          </span>
        </div>
      )}

      <div className="mt-8 text-xs text-muted-foreground uppercase tracking-widest">
        <span className="text-terminal-amber">&gt;</span> COMMANDS: INITIALIZE | PROVE | /HUNTER
      </div>
    </div>
  )
}
