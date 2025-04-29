import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen gradient-bg">
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-purple-600/30 blur-xl animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-purple-800 p-1 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white p-3"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
            </div>
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-white">
                Department Management System
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                Efficiently manage your organization's departments, hierarchies, and personnel with our modern,
                intuitive interface.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button className="gradient-button text-white px-8 py-6 rounded-xl text-lg font-medium transition-all hover:shadow-lg hover:shadow-purple-500/20">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-purple-700 hover:bg-purple-900/20 px-8 py-6 rounded-xl text-lg font-medium"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-purple-900/50 py-6">
        <div className="container flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-gray-500">© 2025 Department Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
