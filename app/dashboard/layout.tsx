import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
        <main className="flex-1 gradient-bg">
          <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
