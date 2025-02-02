import "./globals.css"

import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SmoothOp",
  description: "Simplify and automate your job application process",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}

