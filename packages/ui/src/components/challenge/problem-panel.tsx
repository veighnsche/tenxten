"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ProblemPanelProps {
  title: string
  difficulty: "easy" | "medium" | "hard" | "extreme"
  domain: string
  description: React.ReactNode
  examples?: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints?: string[]
  hints?: string[]
  className?: string
}

const difficultyConfig = {
  easy: { label: "EASY", color: "text-signal-orange border-signal-orange" },
  medium: { label: "MEDIUM", color: "text-amber-500 border-amber-500" },
  hard: { label: "HARD", color: "text-red-500 border-red-500" },
  extreme: { label: "EXTREME", color: "text-purple-500 border-purple-500" },
}

function ProblemPanel({
  title,
  difficulty,
  domain,
  description,
  examples = [],
  constraints = [],
  hints = [],
  className,
}: ProblemPanelProps) {
  const diffConfig = difficultyConfig[difficulty]

  return (
    <div
      data-slot="problem-panel"
      className={cn("flex h-full flex-col", className)}
    >
      <Tabs defaultValue="description" className="flex h-full flex-col">
        <TabsList variant="line" className="shrink-0 px-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          {hints.length > 0 && <TabsTrigger value="hints">Hints</TabsTrigger>}
        </TabsList>

        <TabsContent value="description" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {/* Problem Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                  {domain}
                </span>
                <span className="text-muted-foreground">•</span>
                <span
                  className={cn(
                    "border px-1.5 py-0.5 text-[10px] font-bold uppercase",
                    diffConfig.color
                  )}
                >
                  {diffConfig.label}
                </span>
              </div>
              <h1 className="text-lg font-bold">{title}</h1>
            </div>

            {/* Problem Description */}
            <div className="text-muted-foreground prose prose-invert prose-sm max-w-none text-sm">
              {description}
            </div>

            {/* Constraints */}
            {constraints.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Constraints
                </h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  {constraints.map((constraint, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-signal-orange">›</span>
                      <code className="bg-muted px-1 py-0.5 text-xs">
                        {constraint}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="examples" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {examples.map((example, i) => (
              <div key={i} className="border-border space-y-2 border p-3">
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Example {i + 1}
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase">
                      Input:
                    </span>
                    <pre className="bg-muted mt-1 overflow-x-auto p-2 text-xs">
                      {example.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase">
                      Output:
                    </span>
                    <pre className="bg-muted mt-1 overflow-x-auto p-2 text-xs">
                      {example.output}
                    </pre>
                  </div>
                  {example.explanation && (
                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase">
                        Explanation:
                      </span>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {example.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {hints.length > 0 && (
          <TabsContent value="hints" className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              {hints.map((hint, i) => (
                <HintReveal key={i} index={i + 1} hint={hint} />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

interface HintRevealProps {
  index: number
  hint: string
}

function HintReveal({ index, hint }: HintRevealProps) {
  const [revealed, setRevealed] = React.useState(false)

  return (
    <div className="border-border border">
      <button
        onClick={() => setRevealed(!revealed)}
        className="hover:bg-muted flex w-full items-center justify-between p-3 text-left transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-wider">
          Hint {index}
        </span>
        <span className="text-muted-foreground text-xs">
          {revealed ? "[HIDE]" : "[REVEAL]"}
        </span>
      </button>
      {revealed && (
        <div className="text-muted-foreground border-t border-border p-3 text-sm">
          {hint}
        </div>
      )}
    </div>
  )
}

export { ProblemPanel, HintReveal }
