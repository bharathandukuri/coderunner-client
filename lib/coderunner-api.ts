import axios from "axios"

const baseURL = process.env.CODERUNNER_API_URL
const authToken = process.env.CODERUNNER_AUTH_TOKEN

const coderunnerApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    ...(authToken ? { "X-Auth-Token": authToken } : {}),
  },
  timeout: 30000,
})

coderunnerApi.interceptors.request.use((config) => {
  if (!config.baseURL) {
    throw new Error(
      "CODERUNNER_API_URL is missing. Please set CODERUNNER_API_URL in your environment variables."
    )
  }
  return config
})

export default coderunnerApi
