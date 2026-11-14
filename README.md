# CodeRunner Client

A simple, fast online compiler and playground interface that consumes the [CodeRunner API](https://github.com/bharathandukuri/coderunner).

---

## Features

- **Monaco Code Editor**: Powered by the same editor engine as VS Code, with syntax highlighting, language templates, and autocomplete.
- **Multiple Engines**: Run C, C++, Java, Python, JavaScript, TypeScript, SQLite, PostgreSQL, and MySQL.
- **Resizable Layout**: Drag to resize the editor and output console panels.
- **Interactive Console**: View `stdout`, `stderr`, compilation errors, execution time, memory usage, and exit codes.
- **Custom Input (`stdin`)**: Easily supply standard input to programs.
- **Secure Server Actions**: Backend authentication tokens remain strictly on the server.
- **Dark & Light Mode**: Built-in theme switcher that synchronizes with Monaco.

---

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A running instance of the [CodeRunner](https://github.com/bharathandukuri/coderunner) backend service.

### 2. Installation

```bash
git clone https://github.com/bharathandukuri/coderunner-client.git
cd coderunner-client
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Configure your backend URL and auth token in `.env`:

```env
CODERUNNER_API_URL=http://localhost:3000
CODERUNNER_AUTH_TOKEN=your-secret-token-here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`Ctrl + Enter`** (or `Cmd + Enter`) | Run code |
| **`Ctrl + Shift + D`** (or `Alt + T`) | Toggle dark / light theme |

---

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production bundle
- `npm run start`: Start production server
- `npm run lint`: Run ESLint checks
- `npm run typecheck`: Run TypeScript type-checker
