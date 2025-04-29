import { DepartmentForm } from "@/components/department-form"
import { PlusCircle } from "lucide-react"

export default function CreateDepartmentPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-transparent p-6 rounded-xl border border-purple-800/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-800/50 rounded-lg">
            <PlusCircle className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white">
              Create Department
            </h1>
            <p className="text-gray-400 mt-1">Add a new department to your organization structure</p>
          </div>
        </div>
      </div>

      <DepartmentForm />
    </div>
  )
}
