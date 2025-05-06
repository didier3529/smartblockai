import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { RootProvider } from "@/lib/providers/root-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartBlockAI - AI-Powered Blockchain Analytics",
  description: "Real-time blockchain analytics and insights powered by artificial intelligence",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}