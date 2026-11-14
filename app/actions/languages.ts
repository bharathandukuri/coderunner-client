"use server"

import coderunnerApi from "@/lib/coderunner-api"
import type {
  Language,
  LanguageDetail,
  ActionResponse,
} from "@/types/coderunner"
import axios from "axios"

/**
 * Fetch all active languages
 */
export async function getLanguages(): Promise<ActionResponse<Language[]>> {
  try {
    const response = await coderunnerApi.get<Language[]>("/languages")
    return { success: true, data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch languages",
      }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Fetch all languages including archived
 */
export async function getAllLanguages(): Promise<ActionResponse<Language[]>> {
  try {
    const response = await coderunnerApi.get<Language[]>("/languages/all")
    return { success: true, data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch all languages",
      }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Fetch details for a specific language by ID
 */
export async function getLanguageById(
  id: number
): Promise<ActionResponse<LanguageDetail>> {
  try {
    const response = await coderunnerApi.get<LanguageDetail>(`/languages/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          `Failed to fetch language ${id}`,
      }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}
