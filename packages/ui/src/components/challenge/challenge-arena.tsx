"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChallengeArenaProps {
  children: React.ReactNode
  className?: string
}

function ChallengeArena({ children, className }: ChallengeArenaProps) {
  return (
    <div
      data-slot="challenge-arena"
      className={cn(
        "bg-background text-foreground flex h-screen w-full flex-col font-mono",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ChallengeMainProps {
  children: React.ReactNode
  className?: string
}

function ChallengeMain({ children, className }: ChallengeMainProps) {
  return (
    <div
      data-slot="challenge-main"
      className={cn("flex flex-1 overflow-hidden", className)}
    >
      {children}
    </div>
  )
}

interface ChallengePanelProps {
  children: React.ReactNode
  className?: string
  defaultSize?: number
}

function ChallengePanel({ children, className, defaultSize = 50 }: ChallengePanelProps) {
  return (
    <div
      data-slot="challenge-panel"
      className={cn(
        "border-border flex flex-col overflow-hidden border-r last:border-r-0",
        className
      )}
      style={{ flex: `${defaultSize} 1 0%` }}
    >
      {children}
    </div>
  )
}

interface ChallengePanelHeaderProps {
  children: React.ReactNode
  className?: string
}

function ChallengePanelHeader({ children, className }: ChallengePanelHeaderProps) {
  return (
    <div
      data-slot="challenge-panel-header"
      className={cn(
        "border-border bg-muted/50 flex h-9 shrink-0 items-center gap-2 border-b px-3 text-xs",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ChallengePanelContentProps {
  children: React.ReactNode
  className?: string
}

function ChallengePanelContent({ children, className }: ChallengePanelContentProps) {
  return (
    <div
      data-slot="challenge-panel-content"
      className={cn("flex-1 overflow-auto", className)}
    >
      {children}
    </div>
  )
}

export {
  ChallengeArena,
  ChallengeMain,
  ChallengePanel,
  ChallengePanelHeader,
  ChallengePanelContent,
}
