import { DepartmentHierarchy } from "@/components/department-hierarchy"
import { GitBranchPlus } from "lucide-react"

export default function HierarchyPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-transparent p-6 rounded-xl border border-purple-800/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-800/50 rounded-lg">
            <GitBranchPlus className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white">
              Department Hierarchy
            </h1>
            <p className="text-gray-400 mt-1">Visualize the organizational structure of your departments</p>
          </div>
        </div>
      </div>

      <DepartmentHierarchy />
    </div>
  )
}
