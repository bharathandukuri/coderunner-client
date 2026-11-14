import type { Metadata } from "next"
import { Geist_Mono, DM_Sans } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "CodeRunner — Online Code & Query Playground",
  description:
    "High-performance, secure code and database execution engine for C, C++, Java, Python, TypeScript, and SQL.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable
      )}
    >
      <body className="h-screen w-screen overflow-hidden bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
