"use server"

import coderunnerApi from "@/lib/coderunner-api"
import type {
  SubmissionRequest,
  SubmissionResult,
  ActionResponse,
} from "@/types/coderunner"
import axios from "axios"

/**
 * Execute code synchronously using wait=true.
 * Waits for execution to finish and returns the stdout, stderr, status, and metrics.
 */
export async function executeCode(
  payload: SubmissionRequest
): Promise<ActionResponse<SubmissionResult>> {
  try {
    const response = await coderunnerApi.post<SubmissionResult>(
      "/submissions",
      {
        language_id: payload.language_id,
        source_code: payload.source_code,
        stdin: payload.stdin || "",
        compiler_options: payload.compiler_options,
        command_line_arguments: payload.command_line_arguments,
      },
      {
        params: { wait: "true" },
      }
    )

    return { success: true, data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Code execution failed"
      return { success: false, error: message }
    }
    return {
      success: false,
      error: "An unexpected error occurred during execution",
    }
  }
}

/**
 * Get the status or result of a submission by its token
 */
export async function getSubmission(
  token: string
): Promise<ActionResponse<SubmissionResult>> {
  try {
    const response = await coderunnerApi.get<SubmissionResult>(
      `/submissions/${token}`
    )
    return { success: true, data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          `Failed to fetch submission ${token}`,
      }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}
