"use client"

import { useEffect, useState } from "react"
import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDepartmentStore } from "@/lib/department-store"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Layers, Users, GitBranch, Activity, LayoutDashboard } from "lucide-react"

export function DepartmentOverview() {
  const { departments } = useDepartmentStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Count departments by parent
  const departmentsByParent = departments.reduce(
    (acc, dept) => {
      const parentName = dept.parentId
        ? departments.find((d) => d.id === dept.parentId)?.name || "Unknown"
        : "Root Level"

      if (!acc[parentName]) {
        acc[parentName] = 0
      }
      acc[parentName]++
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(departmentsByParent).map(([name, value]) => ({
    name,
    value,
  }))

  // Calculate department statistics
  const totalDepartments = departments.length
  const rootDepartments = departments.filter((d) => !d.parentId).length
  const maxDepth = calculateMaxDepth(departments)

  // For pie chart
  const COLORS = ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-transparent p-6 rounded-xl border border-purple-800/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-800/50 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-purple-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-1">Welcome to your department management dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4 px-1">Key Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Departments"
            value={totalDepartments}
            icon={<Layers className="h-5 w-5 text-purple-400" />}
          />
          <StatCard
            title="Root Departments"
            value={rootDepartments}
            icon={<GitBranch className="h-5 w-5 text-purple-400" />}
          />
          <StatCard
            title="Max Hierarchy Depth"
            value={maxDepth}
            icon={<Activity className="h-5 w-5 text-purple-400" />}
          />
          <StatCard title="Team Members" value="15" icon={<Users className="h-5 w-5 text-purple-400" />} />
        </div>
      </section>

      {/* Charts Section */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4 px-1">Department Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="gradient-card border-purple-800/50 shadow-lg">
            <CardHeader className="border-b border-purple-900/50 bg-purple-900/20">
              <CardTitle className="text-lg font-medium">Department Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#a78bfa" />
                      <YAxis stroke="#a78bfa" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e1b4b",
                          borderColor: "#7c3aed",
                          borderRadius: "8px",
                          color: "#e9d5ff",
                        }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No department data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-purple-800/50 shadow-lg">
            <CardHeader className="border-b border-purple-900/50 bg-purple-900/20">
              <CardTitle className="text-lg font-medium">Department Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e1b4b",
                          borderColor: "#7c3aed",
                          borderRadius: "8px",
                          color: "#e9d5ff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No department data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4 px-1">Recent Activity</h2>
        <Card className="gradient-card border-purple-800/50 shadow-lg">
          <CardHeader className="border-b border-purple-900/50 bg-purple-900/20">
            <CardTitle className="text-lg font-medium">Latest Department Changes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {departments.length > 0 ? (
                departments.slice(0, 5).map((dept, index) => (
                  <div
                    key={dept.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-purple-900/20 border border-purple-900/30"
                  >
                    <div className="bg-purple-800/30 p-2 rounded-full">
                      <Layers className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{dept.name}</p>
                      <p className="text-gray-400 text-sm">
                        {dept.parentId
                          ? `Added to ${departments.find((d) => d.id === dept.parentId)?.name || "Unknown"}`
                          : "Root department"}
                      </p>
                    </div>
                    <div className="text-gray-500 text-sm">{index === 0 ? "Just now" : `${index + 1}d ago`}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">No department activity to display</div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
}

function StatCard({ title, value, icon }:StatCardProps) {
  return (
    <Card className="gradient-card border-purple-800/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-900/50 rounded-full">{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to calculate max depth of department hierarchy
function calculateMaxDepth(departments:any) {
  const getDepth = (departmentId:any, visited = new Set()) => {
    if (visited.has(departmentId)) return 0 // Prevent circular references
    visited.add(departmentId)

    const children = departments.filter((d:any) => d.parentId === departmentId)
    if (children.length === 0) return 1

    return 1 + Math.max(...children.map((child:any) => getDepth(child.id, new Set(visited))))
  }

  const rootDepartments = departments.filter((d:any) => !d.parentId)
  if (rootDepartments.length === 0) return 0

  return Math.max(...rootDepartments.map((d:any) => getDepth(d.id)))
}
