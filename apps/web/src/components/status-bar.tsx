"use client"

import { useState, useEffect } from "react"

export function StatusBar() {
  const [mounted, setMounted] = useState(false)
  const [uptime, setUptime] = useState(0)
  const [latency, setLatency] = useState(12)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1)
      setLatency(Math.floor(Math.random() * 20) + 5)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed top-0 left-0 right-0 border-b border-border bg-card/80 backdrop-blur-sm z-50">
      <div className="flex items-center justify-between px-6 py-2 text-xs uppercase tracking-widest">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-signal-orange rounded-full animate-pulse" />
            <span className="text-signal-orange">NET_UPLINK</span>
          </div>
          <div className="text-muted-foreground">
            UPTIME: <span className="text-foreground">{formatUptime(uptime)}</span>
          </div>
          <div className="text-muted-foreground">
            LATENCY: <span className="text-signal-orange">{latency}ms</span>
          </div>
        </div>
        <div className="text-muted-foreground">
          CERTIFIED: <span className="text-signal-orange">1,337</span>
        </div>
      </div>
    </div>
  )
}
