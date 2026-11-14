import type { Monaco } from "@monaco-editor/react"
import type { editor, Position } from "monaco-editor"

let isRegistered = false

export function getMonacoLanguage(languageId: number): string {
  switch (languageId) {
    case 1:
      return "c"
    case 2:
      return "cpp"
    case 3:
      return "java"
    case 4:
      return "javascript"
    case 5:
      return "python"
    case 6:
      return "typescript"
    case 7:
      return "sql"
    case 8:
      return "pgsql"
    case 9:
      return "mysql"
    case 10:
      return "javascript"
    default:
      return "plaintext"
  }
}

export function getLanguageFileName(languageId: number): string {
  switch (languageId) {
    case 1:
      return "main.c"
    case 2:
      return "main.cpp"
    case 3:
      return "Main.java"
    case 4:
      return "index.js"
    case 5:
      return "main.py"
    case 6:
      return "index.ts"
    case 7:
      return "query.sql"
    case 8:
      return "postgres.sql"
    case 9:
      return "mysql.sql"
    case 10:
      return "script.js"
    default:
      return "file.txt"
  }
}

export function registerCustomCompletions(monaco: Monaco) {
  if (isRegistered) return
  isRegistered = true

  const CompletionItemKind = monaco.languages.CompletionItemKind
  const InsertTextRule =
    monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet

  // 1. Python Completions
  monaco.languages.registerCompletionItemProvider("python", {
    provideCompletionItems: (model: editor.ITextModel, position: Position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions = [
        {
          label: "print",
          kind: CompletionItemKind.Function,
          insertText: "print(${1:value})",
          insertTextRules: InsertTextRule,
          detail: "print(*values) -> None",
        },
        {
          label: "len",
          kind: CompletionItemKind.Function,
          insertText: "len(${1:obj})",
          insertTextRules: InsertTextRule,
          detail: "len(obj) -> int",
        },
        {
          label: "range",
          kind: CompletionItemKind.Function,
          insertText: "range(${1:stop})",
          insertTextRules: InsertTextRule,
          detail: "range(stop) or range(start, stop[, step])",
        },
        {
          label: "enumerate",
          kind: CompletionItemKind.Function,
          insertText: "enumerate(${1:iterable})",
          insertTextRules: InsertTextRule,
          detail: "enumerate(iterable, start=0)",
        },
        {
          label: "zip",
          kind: CompletionItemKind.Function,
          insertText: "zip(${1:iter1}, ${2:iter2})",
          insertTextRules: InsertTextRule,
          detail: "zip(*iterables)",
        },
        {
          label: "sum",
          kind: CompletionItemKind.Function,
          insertText: "sum(${1:iterable})",
          insertTextRules: InsertTextRule,
          detail: "sum(iterable, start=0)",
        },
        {
          label: "min",
          kind: CompletionItemKind.Function,
          insertText: "min(${1:iterable})",
          insertTextRules: InsertTextRule,
          detail: "min(iterable) or min(arg1, arg2, ...)",
        },
        {
          label: "max",
          kind: CompletionItemKind.Function,
          insertText: "max(${1:iterable})",
          insertTextRules: InsertTextRule,
          detail: "max(iterable) or max(arg1, arg2, ...)",
        },
        {
          label: "sorted",
          kind: CompletionItemKind.Function,
          insertText: "sorted(${1:iterable})",
          insertTextRules: InsertTextRule,
          detail: "sorted(iterable, key=None, reverse=False)",
        },
        {
          label: "map",
          kind: CompletionItemKind.Function,
          insertText: "map(${1:function}, ${2:iterable})",
          insertTextRules: InsertTextRule,
          detail: "map(func, *iterables)",
        },
        {
          label: "filter",
          kind: CompletionItemKind.Function,
          insertText: "filter(${1:function}, ${2:iterable})",
          insertTextRules: InsertTextRule,
          detail: "filter(func, iterable)",
        },
        {
          label: "input",
          kind: CompletionItemKind.Function,
          insertText: "input(${1:prompt})",
          insertTextRules: InsertTextRule,
          detail: "input(prompt) -> str",
        },
        {
          label: "isinstance",
          kind: CompletionItemKind.Function,
          insertText: "isinstance(${1:obj}, ${2:class_or_tuple})",
          insertTextRules: InsertTextRule,
          detail: "isinstance(object, classinfo) -> bool",
        },
        {
          label: "abs",
          kind: CompletionItemKind.Function,
          insertText: "abs(${1:x})",
          insertTextRules: InsertTextRule,
          detail: "abs(number) -> number",
        },
        {
          label: "round",
          kind: CompletionItemKind.Function,
          insertText: "round(${1:number}, ${2:ndigits})",
          insertTextRules: InsertTextRule,
          detail: "round(number, ndigits) -> float",
        },

        {
          label: "def function",
          kind: CompletionItemKind.Snippet,
          insertText: "def ${1:func_name}(${2:args}):\n\t${3:pass}",
          insertTextRules: InsertTextRule,
          detail: "Define a function",
        },
        {
          label: "for in loop",
          kind: CompletionItemKind.Snippet,
          insertText: "for ${1:item} in ${2:items}:\n\t${3:pass}",
          insertTextRules: InsertTextRule,
          detail: "For loop",
        },
        {
          label: "for range loop",
          kind: CompletionItemKind.Snippet,
          insertText: "for ${1:i} in range(${2:n}):\n\t${3:pass}",
          insertTextRules: InsertTextRule,
          detail: "For range loop",
        },
        {
          label: "if __name__ == '__main__'",
          kind: CompletionItemKind.Snippet,
          insertText: 'if __name__ == "__main__":\n\t${1:main()}',
          insertTextRules: InsertTextRule,
          detail: "Main entry point guard",
        },
        {
          label: "try except",
          kind: CompletionItemKind.Snippet,
          insertText:
            "try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${4:pass}",
          insertTextRules: InsertTextRule,
          detail: "Try/Except block",
        },
        {
          label: "class definition",
          kind: CompletionItemKind.Snippet,
          insertText:
            "class ${1:ClassName}:\n\tdef __init__(self, ${2:args}):\n\t\t${3:pass}",
          insertTextRules: InsertTextRule,
          detail: "Class definition",
        },
        {
          label: "list comprehension",
          kind: CompletionItemKind.Snippet,
          insertText: "[${1:x} for ${2:x} in ${3:iterable}]",
          insertTextRules: InsertTextRule,
          detail: "List comprehension",
        },
      ].map((item) => ({ ...item, range }))

      return { suggestions }
    },
  })

  // 2. C++ Completions
  monaco.languages.registerCompletionItemProvider("cpp", {
    provideCompletionItems: (model: editor.ITextModel, position: Position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions = [
        {
          label: "std::cout",
          kind: CompletionItemKind.Snippet,
          insertText: 'std::cout << ${1:"Hello"} << std::endl;',
          insertTextRules: InsertTextRule,
          detail: "Print to stdout",
        },
        {
          label: "std::cin",
          kind: CompletionItemKind.Snippet,
          insertText: "std::cin >> ${1:var};",
          insertTextRules: InsertTextRule,
          detail: "Read from stdin",
        },
        {
          label: "std::vector",
          kind: CompletionItemKind.Class,
          insertText: "std::vector<${1:int}> ${2:vec};",
          insertTextRules: InsertTextRule,
          detail: "Dynamic array container",
        },
        {
          label: "std::string",
          kind: CompletionItemKind.Class,
          insertText: "std::string ${1:str};",
          insertTextRules: InsertTextRule,
          detail: "Standard string",
        },
        {
          label: "std::map",
          kind: CompletionItemKind.Class,
          insertText: "std::map<${1:key_t}, ${2:val_t}> ${3:map};",
          insertTextRules: InsertTextRule,
          detail: "Ordered associative container",
        },
        {
          label: "std::unordered_map",
          kind: CompletionItemKind.Class,
          insertText: "std::unordered_map<${1:key_t}, ${2:val_t}> ${3:map};",
          insertTextRules: InsertTextRule,
          detail: "Hash map",
        },
        {
          label: "std::pair",
          kind: CompletionItemKind.Struct,
          insertText: "std::pair<${1:t1}, ${2:t2}> ${3:p};",
          insertTextRules: InsertTextRule,
          detail: "Pair of values",
        },
        {
          label: "std::sort",
          kind: CompletionItemKind.Function,
          insertText: "std::sort(${1:vec}.begin(), ${1:vec}.end());",
          insertTextRules: InsertTextRule,
          detail: "Sort range",
        },
        {
          label: "for loop",
          kind: CompletionItemKind.Snippet,
          insertText:
            "for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i}) {\n\t${3}\n}",
          insertTextRules: InsertTextRule,
          detail: "Standard index loop",
        },
        {
          label: "range-based for loop",
          kind: CompletionItemKind.Snippet,
          insertText:
            "for (const auto& ${1:item} : ${2:collection}) {\n\t${3}\n}",
          insertTextRules: InsertTextRule,
          detail: "Range-based for loop",
        },
        {
          label: "main function",
          kind: CompletionItemKind.Snippet,
          insertText: "int main() {\n\t${1}\n\treturn 0;\n}",
          insertTextRules: InsertTextRule,
          detail: "C++ main entry function",
        },
      ].map((item) => ({ ...item, range }))

      return { suggestions }
    },
  })

  // 3. C Completions
  monaco.languages.registerCompletionItemProvider("c", {
    provideCompletionItems: (model: editor.ITextModel, position: Position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions = [
        {
          label: "printf",
          kind: CompletionItemKind.Function,
          insertText: 'printf("${1:%s}\\n", ${2});',
          insertTextRules: InsertTextRule,
          detail: "Formatted print",
        },
        {
          label: "scanf",
          kind: CompletionItemKind.Function,
          insertText: 'scanf("${1:%d}", &${2});',
          insertTextRules: InsertTextRule,
          detail: "Formatted input",
        },
        {
          label: "malloc",
          kind: CompletionItemKind.Function,
          insertText: "(${1:type}*)malloc(sizeof(${1:type}) * ${2:count});",
          insertTextRules: InsertTextRule,
          detail: "Allocate dynamic memory",
        },
        {
          label: "free",
          kind: CompletionItemKind.Function,
          insertText: "free(${1:ptr});",
          insertTextRules: InsertTextRule,
          detail: "Deallocate dynamic memory",
        },
        {
          label: "main function",
          kind: CompletionItemKind.Snippet,
          insertText:
            "int main(int argc, char *argv[]) {\n\t${1}\n\treturn 0;\n}",
          insertTextRules: InsertTextRule,
          detail: "C main entry function",
        },
        {
          label: "for loop",
          kind: CompletionItemKind.Snippet,
          insertText:
            "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}",
          insertTextRules: InsertTextRule,
          detail: "For loop",
        },
      ].map((item) => ({ ...item, range }))

      return { suggestions }
    },
  })

  // 4. Java Completions
  monaco.languages.registerCompletionItemProvider("java", {
    provideCompletionItems: (model: editor.ITextModel, position: Position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions = [
        {
          label: "sout",
          kind: CompletionItemKind.Snippet,
          insertText: "System.out.println(${1});",
          insertTextRules: InsertTextRule,
          detail: "System.out.println()",
        },
        {
          label: "psvm",
          kind: CompletionItemKind.Snippet,
          insertText: "public static void main(String[] args) {\n\t${1}\n}",
          insertTextRules: InsertTextRule,
          detail: "main method",
        },
        {
          label: "Scanner",
          kind: CompletionItemKind.Snippet,
          insertText: "Scanner ${1:scanner} = new Scanner(System.in);",
          insertTextRules: InsertTextRule,
          detail: "Read from stdin",
        },
        {
          label: "ArrayList",
          kind: CompletionItemKind.Class,
          insertText: "List<${1:Integer}> ${2:list} = new ArrayList<>();",
          insertTextRules: InsertTextRule,
          detail: "ArrayList instance",
        },
        {
          label: "HashMap",
          kind: CompletionItemKind.Class,
          insertText:
            "Map<${1:String}, ${2:Integer}> ${3:map} = new HashMap<>();",
          insertTextRules: InsertTextRule,
          detail: "HashMap instance",
        },
        {
          label: "for loop",
          kind: CompletionItemKind.Snippet,
          insertText:
            "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}",
          insertTextRules: InsertTextRule,
          detail: "For loop",
        },
        {
          label: "foreach loop",
          kind: CompletionItemKind.Snippet,
          insertText:
            "for (${1:String} ${2:item} : ${3:collection}) {\n\t${4}\n}",
          insertTextRules: InsertTextRule,
          detail: "For-each loop",
        },
      ].map((item) => ({ ...item, range }))

      return { suggestions }
    },
  })

  // 5. SQL / PostgreSQL / MySQL Completions
  const sqlProvider = {
    provideCompletionItems: (model: editor.ITextModel, position: Position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions = [
        {
          label: "SELECT * FROM",
          kind: CompletionItemKind.Snippet,
          insertText: "SELECT * FROM ${1:table_name};",
          insertTextRules: InsertTextRule,
          detail: "Select all query",
        },
        {
          label: "INSERT INTO",
          kind: CompletionItemKind.Snippet,
          insertText:
            "INSERT INTO ${1:table_name} (${2:columns})\nVALUES (${3:values});",
          insertTextRules: InsertTextRule,
          detail: "Insert query",
        },
        {
          label: "UPDATE SET",
          kind: CompletionItemKind.Snippet,
          insertText:
            "UPDATE ${1:table_name}\nSET ${2:column} = ${3:value}\nWHERE ${4:condition};",
          insertTextRules: InsertTextRule,
          detail: "Update query",
        },
        {
          label: "DELETE FROM",
          kind: CompletionItemKind.Snippet,
          insertText: "DELETE FROM ${1:table_name}\nWHERE ${2:condition};",
          insertTextRules: InsertTextRule,
          detail: "Delete query",
        },
        {
          label: "CREATE TABLE",
          kind: CompletionItemKind.Snippet,
          insertText:
            "CREATE TABLE ${1:table_name} (\n\tid SERIAL PRIMARY KEY,\n\t${2:name} VARCHAR(100)\n);",
          insertTextRules: InsertTextRule,
          detail: "Create table statement",
        },
        {
          label: "INNER JOIN",
          kind: CompletionItemKind.Snippet,
          insertText:
            "INNER JOIN ${1:table2} ON ${2:table1.id} = ${3:table2.ref_id}",
          insertTextRules: InsertTextRule,
          detail: "Join clause",
        },
        {
          label: "WHERE",
          kind: CompletionItemKind.Keyword,
          insertText: "WHERE ",
          detail: "Filter clause",
        },
        {
          label: "GROUP BY",
          kind: CompletionItemKind.Keyword,
          insertText: "GROUP BY ",
          detail: "Group clause",
        },
        {
          label: "ORDER BY",
          kind: CompletionItemKind.Keyword,
          insertText: "ORDER BY ",
          detail: "Order clause",
        },
      ].map((item) => ({ ...item, range }))

      return { suggestions }
    },
  }

  monaco.languages.registerCompletionItemProvider("sql", sqlProvider)
  monaco.languages.registerCompletionItemProvider("pgsql", sqlProvider)
  monaco.languages.registerCompletionItemProvider("mysql", sqlProvider)
}
