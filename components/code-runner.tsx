"use client"

import { useState, useTransition } from "react"
import { executeCode } from "@/app/actions/submissions"
import type { Language, SubmissionResult } from "@/types/coderunner"
import { LANGUAGE_TEMPLATES } from "@/lib/templates"
import {
  getMonacoLanguage,
  getLanguageFileName,
} from "@/lib/monaco-completions"

import { RunnerHeader } from "@/components/runner/runner-header"
import { RunnerEditor } from "@/components/runner/runner-editor"
import {
  RunnerConsole,
  type ConsoleTab,
} from "@/components/runner/runner-console"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface CodeRunnerProps {
  initialLanguages: Language[]
}

export default function CodeRunner({ initialLanguages }: CodeRunnerProps) {
  const [languages] = useState<Language[]>(initialLanguages)
  const defaultLanguage = initialLanguages[0] || {
    id: 5,
    name: "Python (3.8.10)",
  }

  const [selectedLanguageId, setSelectedLanguageId] = useState<number>(
    defaultLanguage.id
  )
  const [sourceCode, setSourceCode] = useState<string>(
    LANGUAGE_TEMPLATES[defaultLanguage.id] || ""
  )
  const [stdin, setStdin] = useState<string>("")
  const [activeTab, setActiveTab] = useState<ConsoleTab>("output")
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLanguageChange = (newId: number) => {
    setSelectedLanguageId(newId)
    setSourceCode(LANGUAGE_TEMPLATES[newId] || "")
    setResult(null)
    setError(null)
  }

  const handleResetCode = () => {
    setSourceCode(LANGUAGE_TEMPLATES[selectedLanguageId] || "")
    setResult(null)
    setError(null)
  }

  const handleRun = () => {
    if (isPending || !sourceCode.trim()) return
    setError(null)
    setActiveTab("output")

    startTransition(async () => {
      const res = await executeCode({
        language_id: selectedLanguageId,
        source_code: sourceCode,
        stdin,
      })

      if (res.success) {
        setResult(res.data)
      } else {
        setError(res.error)
      }
    })
  }

  const handleClearConsole = () => {
    setResult(null)
    setError(null)
  }

  const currentFileName = getLanguageFileName(selectedLanguageId)
  const monacoLanguage = getMonacoLanguage(selectedLanguageId)

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground select-none">
      <RunnerHeader
        languages={languages}
        selectedLanguageId={selectedLanguageId}
        onLanguageChange={handleLanguageChange}
        onResetCode={handleResetCode}
        onRun={handleRun}
        isPending={isPending}
        isRunDisabled={!sourceCode.trim()}
      />

      <main className="flex min-h-0 w-full flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize="60%" minSize="25%" maxSize="80%">
            <RunnerEditor
              fileName={currentFileName}
              language={monacoLanguage}
              code={sourceCode}
              onChange={setSourceCode}
              onRun={handleRun}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize="40%" minSize="20%" maxSize="75%">
            <RunnerConsole
              activeTab={activeTab}
              onTabChange={setActiveTab}
              stdin={stdin}
              onStdinChange={setStdin}
              result={result}
              error={error}
              isPending={isPending}
              onClear={handleClearConsole}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
