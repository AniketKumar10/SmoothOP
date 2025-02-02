import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold">
              SmoothOp
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">
          © {new Date().getFullYear()} SmoothOp. All rights reserved.
        </div>
      </div>
    </footer>
  )
}