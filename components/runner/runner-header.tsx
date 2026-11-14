"use client"

import { useTheme } from "next-themes"
import type { Language } from "@/types/coderunner"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Play, Loader2, Code2, RotateCcw, Sun, Moon } from "lucide-react"

interface RunnerHeaderProps {
  languages: Language[]
  selectedLanguageId: number
  onLanguageChange: (id: number) => void
  onResetCode: () => void
  onRun: () => void
  isPending: boolean
  isRunDisabled: boolean
}

export function RunnerHeader({
  languages,
  selectedLanguageId,
  onLanguageChange,
  onResetCode,
  onRun,
  isPending,
  isRunDisabled,
}: RunnerHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()

  const selectItems = languages.map((lang) => ({
    value: lang.id.toString(),
    label: lang.name,
  }))

  return (
    <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur-md">
      {/* Brand & Language Selection */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 className="size-5" />
          </div>
          <span className="text-base font-bold tracking-tight">CodeRunner</span>
        </div>

        <Separator orientation="vertical" className="h-5" />

        <div className="flex items-center gap-2">
          <Select
            items={selectItems}
            value={selectedLanguageId.toString()}
            onValueChange={(val) => {
              if (val) onLanguageChange(Number(val))
            }}
          >
            <SelectTrigger className="h-8 w-52 text-xs font-medium">
              <SelectValue placeholder="Select Language">
                {(val) =>
                  languages.find((l) => l.id.toString() === val)?.name ||
                  "Select Language"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id.toString()}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={onResetCode}
            title="Reset to template"
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          title="Toggle theme (Ctrl+Shift+D)"
          className="size-8"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <Button
          onClick={onRun}
          disabled={isPending || isRunDisabled}
          size="sm"
          className="h-8 gap-1.5 px-3.5 text-xs font-semibold shadow-xs"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Play className="size-3.5 fill-current" />
              <span>Run</span>
              <kbd className="hidden items-center rounded bg-primary-foreground/20 px-1 font-mono text-[9px] text-primary-foreground md:inline-flex">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </Button>
      </div>
    </header>
  )
}
