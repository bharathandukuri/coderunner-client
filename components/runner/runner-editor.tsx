"use client"

import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import type { OnMount } from "@monaco-editor/react"
import { registerCustomCompletions } from "@/lib/monaco-completions"
import { FileCode, Loader2 } from "lucide-react"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-card/40 text-muted-foreground">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  ),
})

interface RunnerEditorProps {
  fileName: string
  language: string
  code: string
  onChange: (value: string) => void
  onRun: () => void
}

export function RunnerEditor({
  fileName,
  language,
  code,
  onChange,
  onRun,
}: RunnerEditorProps) {
  const { resolvedTheme } = useTheme()
  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "light"

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    registerCustomCompletions(monaco)

    // Ctrl+Enter / Cmd+Enter execution shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun()
    })

    editor.focus()
  }

  return (
    <section
      aria-label="Code Editor"
      className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden"
    >
      {/* Editor Tab Bar - Clean and without "autocomplete" word */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/50 bg-muted/30 px-4">
        <Badge
          variant="secondary"
          className="gap-1.5 font-mono text-xs font-normal"
        >
          <FileCode className="size-3.5 text-primary" />
          <span>{fileName}</span>
        </Badge>

        <Badge
          variant="outline"
          className="font-mono text-[10px] text-muted-foreground uppercase"
        >
          {language}
        </Badge>
      </div>

      {/* Monaco Editor Workspace */}
      <div className="relative h-full min-h-0 w-full flex-1">
        <MonacoEditor
          height="100%"
          width="100%"
          language={language}
          theme={monacoTheme}
          value={code}
          onChange={(value) => onChange(value || "")}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            lineHeight: 22,
            fontFamily: "var(--font-mono), monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </section>
  )
}
