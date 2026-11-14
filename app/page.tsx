import { getLanguages } from "@/app/actions/languages"
import CodeRunner from "@/components/code-runner"

export default async function Page() {
  const result = await getLanguages()
  const languages = result.success ? result.data : []

  return <CodeRunner initialLanguages={languages} />
}
