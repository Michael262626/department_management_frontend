"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, GitBranch } from "lucide-react"
import { useDepartmentStore } from "@/lib/department-store"
import type { Department } from "@/lib/types"

export function DepartmentHierarchy() {
  const { departments } = useDepartmentStore()

  // Find root departments (those without a parent)
  const rootDepartments = departments.filter((dept) => !dept.parentId)

  return (
    <Card className="gradient-card border-purple-800/50 shadow-lg">
      <CardHeader className="border-b border-purple-900/50 bg-purple-900/20 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <GitBranch className="mr-2 h-5 w-5 text-purple-400" />
          Organization Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rootDepartments.length > 0 ? (
          <div className="space-y-2 p-4 bg-gray-900/30 rounded-lg">
            {rootDepartments.map((dept) => (
              <DepartmentNode key={dept.id} department={dept} departments={departments} level={0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 bg-gray-900/30 rounded-lg">
            <GitBranch className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p className="text-lg">No departments found</p>
            <p className="text-sm mt-2">Create departments to visualize the hierarchy</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DepartmentNodeProps {
  department: Department
  departments: Department[]
  level: number
}

function DepartmentNode({ department, departments, level }: DepartmentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Find child departments
  const childDepartments = departments.filter((dept) => dept.parentId === department.id)
  const hasChildren = childDepartments.length > 0

  return (
    <div className="ml-4 department-node">
      <div
        className={`flex items-center py-3 px-2 rounded-md cursor-pointer ${hasChildren ? "hover:bg-purple-900/30" : ""}`}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-5 w-5 mr-2 text-purple-400" />
          ) : (
            <ChevronRight className="h-5 w-5 mr-2 text-purple-400" />
          )
        ) : (
          <div className="w-7" />
        )}
        <div className={`font-medium ${level === 0 ? "text-lg text-white" : "text-gray-300"}`}>{department.name}</div>
        {level === 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-purple-900/50 text-purple-300 rounded-full">Root</span>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="department-tree-line pl-4 ml-3">
          {childDepartments.map((childDept) => (
            <DepartmentNode key={childDept.id} department={childDept} departments={departments} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
