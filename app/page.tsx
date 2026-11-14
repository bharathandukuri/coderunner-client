import { getLanguages } from "@/app/actions/languages"
import CodeRunner from "@/components/code-runner"

export const dynamic = "force-dynamic"

export default async function Page() {
  const result = await getLanguages()
  const languages = result.success ? result.data : []

  return <CodeRunner initialLanguages={languages} />
}
