"use client"

import { cn } from "@/lib/utils"

interface CodeEditorPanelProps {
  code: string
  onChange?: (code: string) => void
  language?: string
  readOnly?: boolean
  className?: string
}

function CodeEditorPanel({
  code,
  onChange,
  language = "typescript",
  readOnly = false,
  className,
}: CodeEditorPanelProps) {
  const lineCount = code.split("\n").length

  return (
    <div
      data-slot="code-editor-panel"
      className={cn("flex h-full flex-col", className)}
    >
      {/* Editor Header */}
      <div className="border-border bg-muted/30 flex h-8 shrink-0 items-center justify-between border-b px-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
            solution.{language === "typescript" ? "ts" : language}
          </span>
        </div>
        <LanguageSelector language={language} />
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-muted/20 border-border flex shrink-0 select-none flex-col border-r px-2 py-3 text-right font-mono text-xs">
          {Array.from({ length: lineCount }, (_, i) => (
            <span
              key={i + 1}
              className="text-muted-foreground/50 h-5 leading-5"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Code Area */}
        <textarea
          value={code}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          className={cn(
            "flex-1 resize-none bg-transparent p-3 font-mono text-xs leading-5 outline-none",
            "placeholder:text-muted-foreground/50",
            readOnly && "cursor-not-allowed opacity-60"
          )}
          placeholder="// Write your solution here..."
        />
      </div>

      {/* Editor Footer */}
      <div className="border-border bg-muted/30 flex h-7 shrink-0 items-center justify-between border-t px-3 text-[10px]">
        <div className="text-muted-foreground flex items-center gap-3">
          <span>Lines: {lineCount}</span>
          <span>Chars: {code.length}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-green-500" />
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  )
}

interface LanguageSelectorProps {
  language: string
  onChange?: (language: string) => void
}

const languages = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
]

function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  return (
    <select
      value={language}
      onChange={(e) => onChange?.(e.target.value)}
      className="bg-muted border-border text-foreground h-5 border px-1.5 text-[10px] uppercase outline-none"
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}

interface CodeEditorActionsProps {
  onRun?: () => void
  onSubmit?: () => void
  onReset?: () => void
  isRunning?: boolean
  isSubmitting?: boolean
  className?: string
}

function CodeEditorActions({
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
  className,
}: CodeEditorActionsProps) {
  return (
    <div
      data-slot="code-editor-actions"
      className={cn(
        "border-border bg-muted/30 flex h-12 shrink-0 items-center justify-between border-t px-3",
        className
      )}
    >
      <button
        onClick={onReset}
        className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider transition-colors"
      >
        [RESET]
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onRun}
          disabled={isRunning || isSubmitting}
          className={cn(
            "border-border hover:bg-muted flex h-8 items-center gap-2 border bg-transparent px-4 text-xs font-bold uppercase tracking-wider transition-colors",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          {isRunning ? (
            <>
              <span className="size-2 animate-spin border border-current border-t-transparent" />
              EXECUTING...
            </>
          ) : (
            "RUN TESTS"
          )}
        </button>

        <button
          onClick={onSubmit}
          disabled={isRunning || isSubmitting}
          className={cn(
            "flex h-8 items-center gap-2 border border-green-500 bg-green-500/10 px-4 text-xs font-bold uppercase tracking-wider text-green-500 transition-colors hover:bg-green-500/20",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          {isSubmitting ? (
            <>
              <span className="size-2 animate-spin border border-current border-t-transparent" />
              SUBMITTING...
            </>
          ) : (
            "SUBMIT"
          )}
        </button>
      </div>
    </div>
  )
}

export { CodeEditorPanel, CodeEditorActions, LanguageSelector }
