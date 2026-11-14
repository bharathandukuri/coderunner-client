"use client"

import { useState } from "react"
import type { SubmissionResult } from "@/types/coderunner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Terminal,
  Copy,
  Check,
  Trash2,
  Loader2,
} from "lucide-react"

export type ConsoleTab = "output" | "stdin"

interface RunnerConsoleProps {
  activeTab: ConsoleTab
  onTabChange: (tab: ConsoleTab) => void
  stdin: string
  onStdinChange: (val: string) => void
  result: SubmissionResult | null
  error: string | null
  isPending: boolean
  onClear: () => void
}

export function RunnerConsole({
  activeTab,
  onTabChange,
  stdin,
  onStdinChange,
  result,
  error,
  isPending,
  onClear,
}: RunnerConsoleProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const textToCopy =
      result?.stdout || result?.compile_output || result?.stderr || error || ""
    if (!textToCopy) return
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusBadgeVariant = (statusId: number) => {
    switch (statusId) {
      case 3:
      case 5:
        return "outline" as const
      case 4:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        return "destructive" as const
      default:
        return "secondary" as const
    }
  }

  const statusBadgeClass = (statusId: number) => {
    switch (statusId) {
      case 3:
        return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
      case 5:
        return "text-amber-500 border-amber-500/30 bg-amber-500/10"
      default:
        return ""
    }
  }

  const statusIcon = (statusId: number) => {
    switch (statusId) {
      case 3:
        return <CheckCircle2 className="size-3.5 text-emerald-500" />
      case 5:
        return <AlertTriangle className="size-3.5 text-amber-500" />
      default:
        return <XCircle className="size-3.5" />
    }
  }

  return (
    <section
      aria-label="Console and Input"
      className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-card/20"
    >
      <Tabs
        value={activeTab}
        onValueChange={(val) => onTabChange(val as ConsoleTab)}
        className="flex min-h-0 w-full flex-1 flex-col"
      >
        {/* Tab Switcher & Quick Actions */}
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/50 bg-muted/30 px-3">
          <TabsList variant="default" className="h-7 p-0.5">
            <TabsTrigger value="output" className="px-2.5 py-1 text-xs">
              Console Output
            </TabsTrigger>
            <TabsTrigger value="stdin" className="gap-1 px-2.5 py-1 text-xs">
              Input (stdin)
              {stdin.trim().length > 0 && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-1">
            {activeTab === "output" && (result || error) && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  title="Copy output"
                  className="size-7 text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  title="Clear console"
                  className="size-7 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tab 1: Custom Input (stdin) */}
        <TabsContent
          value="stdin"
          className="m-0 flex min-h-0 flex-1 flex-col p-3 data-[state=inactive]:hidden"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              Standard Input (stdin)
            </span>
            <Badge variant="outline" className="font-mono text-[10px]">
              {stdin.length} chars
            </Badge>
          </div>
          <Textarea
            value={stdin}
            onChange={(e) => onStdinChange(e.target.value)}
            placeholder="Enter input for your program..."
            className="w-full flex-1 resize-none rounded-xl border-border/60 bg-background p-3 font-mono text-xs leading-relaxed focus-visible:ring-1"
          />
        </TabsContent>

        {/* Tab 2: Console Output */}
        <TabsContent
          value="output"
          className="m-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
        >
          {/* Status & Execution Metrics Header */}
          {result && (
            <div className="flex shrink-0 items-center justify-between border-b border-border/40 bg-muted/15 px-3.5 py-2 font-mono text-xs">
              <Badge
                variant={statusBadgeVariant(result.status.id)}
                className={`gap-1.5 text-xs font-semibold ${statusBadgeClass(
                  result.status.id
                )}`}
              >
                {statusIcon(result.status.id)}
                <span>{result.status.description}</span>
              </Badge>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                {result.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {result.time}s
                  </span>
                )}
                {result.memory != null && (
                  <span className="flex items-center gap-1">
                    <HardDrive className="size-3" />
                    {result.memory} KB
                  </span>
                )}
                {result.exit_code != null && (
                  <span>exit: {result.exit_code}</span>
                )}
              </div>
            </div>
          )}

          {/* Console Output Body */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {/* Loading */}
            {isPending && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="size-7 animate-spin text-primary" />
                <p className="text-sm font-medium tracking-wide">
                  Executing...
                </p>
              </div>
            )}

            {/* Error Message */}
            {!isPending && error && (
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
                {error}
              </div>
            )}

            {/* Empty State */}
            {!isPending && !result && !error && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <Terminal className="size-8 stroke-[1.5] text-muted-foreground/40" />
                <p className="text-xs">Console is empty</p>
              </div>
            )}

            {/* Execution Results */}
            {!isPending && result && (
              <div className="space-y-4">
                {/* stdout */}
                {result.stdout && (
                  <div>
                    <div className="mb-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Standard Output
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-border/30 bg-muted/30 p-3 font-mono text-xs text-foreground select-text">
                      {result.stdout}
                    </pre>
                  </div>
                )}

                {/* compile_output */}
                {result.compile_output && (
                  <div>
                    <div className="mb-1.5 text-[10px] font-bold tracking-wider text-rose-400 uppercase">
                      Compilation Output
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-rose-500/20 bg-rose-950/20 p-3 font-mono text-xs text-rose-400 select-text">
                      {result.compile_output}
                    </pre>
                  </div>
                )}

                {/* stderr */}
                {result.stderr && (
                  <div>
                    <div className="mb-1.5 text-[10px] font-bold tracking-wider text-rose-400 uppercase">
                      Standard Error
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-rose-500/20 bg-rose-950/20 p-3 font-mono text-xs text-rose-400 select-text">
                      {result.stderr}
                    </pre>
                  </div>
                )}

                {/* message */}
                {result.message && (
                  <div>
                    <div className="mb-1.5 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                      System Message
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 font-mono text-xs text-amber-400 select-text">
                      {result.message}
                    </pre>
                  </div>
                )}

                {/* Empty Output */}
                {!result.stdout &&
                  !result.stderr &&
                  !result.compile_output &&
                  !result.message && (
                    <div className="text-xs text-muted-foreground italic">
                      Program finished with exit code {result.exit_code ?? 0}{" "}
                      (no output).
                    </div>
                  )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
