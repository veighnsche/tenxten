"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type TestStatus = "pending" | "running" | "passed" | "failed"

interface TestCase {
  id: string
  name: string
  status: TestStatus
  input?: string
  expected?: string
  actual?: string
  executionTime?: number
  error?: string
}

interface TestPanelProps {
  testCases: TestCase[]
  output?: string
  className?: string
}

function TestPanel({ testCases, output = "", className }: TestPanelProps) {
  const passedCount = testCases.filter((t) => t.status === "passed").length
  const failedCount = testCases.filter((t) => t.status === "failed").length
  const totalCount = testCases.length

  return (
    <div
      data-slot="test-panel"
      className={cn("flex h-full flex-col", className)}
    >
      <Tabs defaultValue="tests" className="flex h-full flex-col">
        <TabsList variant="line" className="shrink-0 px-3">
          <TabsTrigger value="tests">
            Tests
            {totalCount > 0 && (
              <span className="text-muted-foreground ml-1.5">
                [{passedCount}/{totalCount}]
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="flex-1 overflow-auto">
          {testCases.length === 0 ? (
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              Run tests to see results
            </div>
          ) : (
            <div className="divide-border divide-y">
              {testCases.map((testCase) => (
                <TestCaseRow key={testCase.id} testCase={testCase} />
              ))}
            </div>
          )}

          {/* Summary Bar */}
          {testCases.length > 0 && (
            <div className="border-border bg-muted/30 flex h-8 items-center justify-between border-t px-3 text-[10px] uppercase tracking-wider">
              <div className="flex items-center gap-4">
                <span className="text-green-500">{passedCount} PASSED</span>
                <span className="text-red-500">{failedCount} FAILED</span>
              </div>
              <span className="text-muted-foreground">
                {passedCount === totalCount && totalCount > 0
                  ? "ALL TESTS PASSING"
                  : `${totalCount - passedCount} REMAINING`}
              </span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="output" className="flex-1 overflow-auto">
          <pre className="text-muted-foreground h-full whitespace-pre-wrap p-3 font-mono text-xs">
            {output || "> Waiting for execution..."}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TestCaseRowProps {
  testCase: TestCase
}

function TestCaseRow({ testCase }: TestCaseRowProps) {
  const [expanded, setExpanded] = React.useState(false)

  const statusConfig = {
    pending: { icon: "○", color: "text-muted-foreground" },
    running: { icon: "◐", color: "text-amber-500 animate-spin" },
    passed: { icon: "✓", color: "text-green-500" },
    failed: { icon: "✗", color: "text-red-500" },
  }

  const config = statusConfig[testCase.status]
  const showDetails = testCase.status === "failed" || testCase.status === "passed"

  return (
    <div className="text-xs">
      <button
        onClick={() => showDetails && setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center justify-between px-3 py-2 text-left transition-colors",
          showDetails && "hover:bg-muted cursor-pointer",
          !showDetails && "cursor-default"
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("font-mono", config.color)}>{config.icon}</span>
          <span>{testCase.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {testCase.executionTime !== undefined && (
            <span className="text-muted-foreground tabular-nums">
              {testCase.executionTime}ms
            </span>
          )}
          {showDetails && (
            <span className="text-muted-foreground">
              {expanded ? "▲" : "▼"}
            </span>
          )}
        </div>
      </button>

      {expanded && showDetails && (
        <div className="border-border bg-muted/20 space-y-2 border-t px-3 py-2">
          {testCase.input && (
            <div>
              <span className="text-muted-foreground text-[10px] uppercase">
                Input:
              </span>
              <pre className="bg-muted mt-1 overflow-x-auto p-2 text-xs">
                {testCase.input}
              </pre>
            </div>
          )}
          {testCase.expected && (
            <div>
              <span className="text-muted-foreground text-[10px] uppercase">
                Expected:
              </span>
              <pre className="mt-1 overflow-x-auto border border-green-500/30 bg-green-500/5 p-2 text-xs text-green-500">
                {testCase.expected}
              </pre>
            </div>
          )}
          {testCase.actual && testCase.status === "failed" && (
            <div>
              <span className="text-muted-foreground text-[10px] uppercase">
                Actual:
              </span>
              <pre className="mt-1 overflow-x-auto border border-red-500/30 bg-red-500/5 p-2 text-xs text-red-500">
                {testCase.actual}
              </pre>
            </div>
          )}
          {testCase.error && (
            <div>
              <span className="text-[10px] uppercase text-red-500">Error:</span>
              <pre className="mt-1 overflow-x-auto border border-red-500/30 bg-red-500/5 p-2 text-xs text-red-500">
                {testCase.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface TestProgressBarProps {
  passed: number
  failed: number
  total: number
  className?: string
}

function TestProgressBar({ passed, failed, total, className }: TestProgressBarProps) {
  const passedPercent = (passed / total) * 100
  const failedPercent = (failed / total) * 100

  return (
    <div
      data-slot="test-progress-bar"
      className={cn("bg-muted flex h-1 w-full overflow-hidden", className)}
    >
      <div
        className="bg-green-500 transition-all"
        style={{ width: `${passedPercent}%` }}
      />
      <div
        className="bg-red-500 transition-all"
        style={{ width: `${failedPercent}%` }}
      />
    </div>
  )
}

export { TestPanel, TestCaseRow, TestProgressBar }
export type { TestCase, TestStatus }
