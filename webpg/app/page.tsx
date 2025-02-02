import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to SmoothOp</h1>
      <p className="text-xl mb-8">Simplify and automate your job application process</p>
      <div className="flex space-x-4">
        <Link href="/sign-up">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/sign-in">
          <Button variant="outline">Log In</Button>
        </Link>
      </div>
    </div>
  )
}