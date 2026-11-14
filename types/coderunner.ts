export interface Language {
  id: number
  name: string
  is_archived?: boolean
}

export interface LanguageDetail extends Language {
  source_file: string
  compile_cmd: string | null
  run_cmd: string
}

export interface SubmissionStatus {
  id: number
  description: string
}

export interface SubmissionRequest {
  language_id: number
  source_code: string
  stdin?: string
  compiler_options?: string
  command_line_arguments?: string
}

export interface SubmissionResult {
  token: string
  type: string
  source_code: string
  language_id: number
  stdin: string
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  message: string | null
  status: SubmissionStatus
  created_at: string
  finished_at: string | null
  time: string | null
  wall_time: string | null
  memory: number | null
  exit_code: number | null
  exit_signal: number | null
}

export type ActionResponse<T> =
  { success: true; data: T } | { success: false; error: string }
