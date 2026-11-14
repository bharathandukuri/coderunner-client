"use client"

import { useState, useTransition, useEffect, useRef, useCallback } from "react"
import { executeCode } from "@/app/actions/submissions"
import { getLanguageById } from "@/app/actions/languages"
import type {
  Language,
  LanguageDetail,
  SubmissionResult,
} from "@/types/coderunner"
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
  const languages = initialLanguages
  const defaultLanguage = initialLanguages[0] || {
    id: 5,
    name: "Python (3.8.10)",
  }

  const [selectedLanguageId, setSelectedLanguageId] = useState<number>(
    defaultLanguage.id
  )

  // Maintain separate code per language so user work is preserved when switching
  const [codeMap, setCodeMap] = useState<Record<number, string>>(() => ({
    ...LANGUAGE_TEMPLATES,
    [defaultLanguage.id]: LANGUAGE_TEMPLATES[defaultLanguage.id] || "",
  }))

  // Language details cache fetched from the backend API (source_file, compile_cmd, run_cmd)
  const [languageDetails, setLanguageDetails] = useState<
    Record<number, LanguageDetail>
  >({})

  const [stdin, setStdin] = useState<string>("")
  const [activeTab, setActiveTab] = useState<ConsoleTab>("output")
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Direct ref getter to access live Monaco code upon execution
  const getEditorCodeRef = useRef<() => string>(() => "")

  // Current code for the selected language
  const currentCode =
    codeMap[selectedLanguageId] ??
    (LANGUAGE_TEMPLATES[selectedLanguageId] || "")

  // Sync with API: fetch authoritative language metadata when selected language changes
  useEffect(() => {
    if (!selectedLanguageId) return

    if (languageDetails[selectedLanguageId]) return

    let isMounted = true
    getLanguageById(selectedLanguageId).then((res) => {
      if (isMounted && res.success && res.data) {
        setLanguageDetails((prev) => ({
          ...prev,
          [selectedLanguageId]: res.data,
        }))
      }
    })

    return () => {
      isMounted = false
    }
  }, [selectedLanguageId, languageDetails])

  const handleLanguageChange = (newId: number) => {
    // 1. Save live code of the current language before switching
    const latestCode = getEditorCodeRef.current() || currentCode
    setCodeMap((prev) => ({
      ...prev,
      [selectedLanguageId]: latestCode,
      [newId]: prev[newId] ?? (LANGUAGE_TEMPLATES[newId] || ""),
    }))

    // 2. Switch to new language
    setSelectedLanguageId(newId)
    setResult(null)
    setError(null)
  }

  const handleCodeChange = (newCode: string) => {
    setCodeMap((prev) => ({
      ...prev,
      [selectedLanguageId]: newCode,
    }))
  }

  const handleResetCode = () => {
    const template = LANGUAGE_TEMPLATES[selectedLanguageId] || ""
    setCodeMap((prev) => ({
      ...prev,
      [selectedLanguageId]: template,
    }))
    setResult(null)
    setError(null)
  }

  const handleRun = useCallback(() => {
    const liveCode = getEditorCodeRef.current() || currentCode
    if (isPending || !liveCode.trim()) return

    setError(null)
    setActiveTab("output")

    startTransition(async () => {
      const res = await executeCode({
        language_id: selectedLanguageId,
        source_code: liveCode,
        stdin,
      })

      if (res.success) {
        setResult(res.data)
      } else {
        setError(res.error)
      }
    })
  }, [selectedLanguageId, currentCode, stdin, isPending])

  const handleClearConsole = () => {
    setResult(null)
    setError(null)
  }

  // Get active language details from API
  const activeDetail = languageDetails[selectedLanguageId]
  const currentFileName =
    activeDetail?.source_file || getLanguageFileName(selectedLanguageId)
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
        isRunDisabled={!currentCode.trim()}
      />

      <main className="flex min-h-0 w-full flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize="60%" minSize="25%" maxSize="80%">
            <RunnerEditor
              fileName={currentFileName}
              language={monacoLanguage}
              code={currentCode}
              onChange={handleCodeChange}
              onRun={handleRun}
              onGetCodeRef={(getter) => {
                getEditorCodeRef.current = getter
              }}
              compileCmd={activeDetail?.compile_cmd}
              runCmd={activeDetail?.run_cmd}
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
