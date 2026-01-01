"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface ChallengeHeaderProps {
  children: React.ReactNode
  className?: string
}

function ChallengeHeader({ children, className }: ChallengeHeaderProps) {
  return (
    <header
      data-slot="challenge-header"
      className={cn(
        "border-border bg-background flex h-12 shrink-0 items-center justify-between border-b px-4",
        className
      )}
    >
      {children}
    </header>
  )
}

interface ChallengeHeaderGroupProps {
  children: React.ReactNode
  className?: string
}

function ChallengeHeaderGroup({ children, className }: ChallengeHeaderGroupProps) {
  return (
    <div
      data-slot="challenge-header-group"
      className={cn("flex items-center gap-4", className)}
    >
      {children}
    </div>
  )
}

const trackBadgeVariants = cva(
  "inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-bold uppercase tracking-wider",
  {
    variants: {
      track: {
        native: "border-green-500 bg-green-500/10 text-green-500",
        augmented: "border-amber-500 bg-amber-500/10 text-amber-500",
      },
    },
    defaultVariants: {
      track: "native",
    },
  }
)

interface TrackBadgeProps extends VariantProps<typeof trackBadgeVariants> {
  className?: string
}

function TrackBadge({ track, className }: TrackBadgeProps) {
  return (
    <span
      data-slot="track-badge"
      className={cn(trackBadgeVariants({ track }), className)}
    >
      {track === "native" ? (
        <>
          <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
          10x.NATIVE
        </>
      ) : (
        <>
          <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
          10x.AUGMENTED
        </>
      )}
    </span>
  )
}

interface ChallengeTimerProps {
  timeRemaining: number // seconds
  totalTime: number // seconds
  className?: string
}

function ChallengeTimer({ timeRemaining, totalTime, className }: ChallengeTimerProps) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const percentage = (timeRemaining / totalTime) * 100
  
  const isWarning = percentage <= 25
  const isCritical = percentage <= 10

  return (
    <div
      data-slot="challenge-timer"
      className={cn("flex items-center gap-3 font-mono", className)}
    >
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
          Time Remaining
        </span>
        <span
          className={cn(
            "text-lg font-bold tabular-nums",
            isCritical && "text-red-500 animate-pulse",
            isWarning && !isCritical && "text-amber-500"
          )}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
      <div className="bg-muted h-8 w-1 overflow-hidden">
        <div
          className={cn(
            "w-full transition-all duration-1000",
            isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-green-500"
          )}
          style={{ height: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface ChallengeStatusProps {
  status: "ready" | "running" | "submitting" | "completed" | "failed"
  className?: string
}

function ChallengeStatus({ status, className }: ChallengeStatusProps) {
  const statusConfig = {
    ready: { label: "READY", color: "text-muted-foreground" },
    running: { label: "PROVING", color: "text-green-500" },
    submitting: { label: "VERIFYING", color: "text-amber-500" },
    completed: { label: "PASSED", color: "text-green-500" },
    failed: { label: "FAILED", color: "text-red-500" },
  }

  const config = statusConfig[status]

  return (
    <div
      data-slot="challenge-status"
      className={cn("flex items-center gap-2 text-xs", className)}
    >
      <span className="text-muted-foreground uppercase tracking-wider">Status:</span>
      <span className={cn("font-bold uppercase", config.color)}>
        {status === "running" && (
          <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-green-500" />
        )}
        {config.label}
      </span>
    </div>
  )
}

export {
  ChallengeHeader,
  ChallengeHeaderGroup,
  TrackBadge,
  ChallengeTimer,
  ChallengeStatus,
  trackBadgeVariants,
}
