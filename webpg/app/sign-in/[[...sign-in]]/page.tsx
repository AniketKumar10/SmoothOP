"use client"

import { SignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-sm normal-case",
          },
        }}
        redirectUrl="/dashboard"
        afterSignInUrl="/dashboard"
      />
    </div>
  )
}