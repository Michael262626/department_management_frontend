// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DepartmentList } from "@/components/department-list"
// import { DepartmentForm } from "@/components/department-form"
// import { DepartmentHierarchy } from "@/components/department-hierarchy"
// import { Button } from "@/components/ui/button"
// import { LogOut, LayoutDashboard, Users, GitBranchPlus } from 'lucide-react'

// export function DepartmentDashboard() {
//   const router = useRouter()
//   const [isClient, setIsClient] = useState(false)

//   useEffect(() => {
//     setIsClient(true)
//     const isAuthenticated = localStorage.getItem("isAuthenticated")
//     if (!isAuthenticated) {
//       router.push("/login")
//     }
//   }, [router])

//   const handleLogout = () => {
//     localStorage.removeItem("isAuthenticated")
//     router.push("/")
//   }

//   if (!isClient) {
//     return null // Prevent hydration errors
//   }

//   return (
//     <div className="min-h-screen relative">
//       <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>
//       <div className="container mx-auto py-6 px-4 relative z-10">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
//             Department Management
//           </h1>
//           <Button 
//             variant="outline" 
//             onClick={handleLogout}
//             className="border-purple-700 hover:bg-purple-900/30 hover:border-purple-500 transition-all"
//           >
//             <LogOut className="mr-2 h-4 w-4 text-purple-400" /> Logout
//           </Button>
//         </div>

//         <Tabs defaultValue="list" className="w-full">
//           <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/40 p-1 border border-purple-900/50">
//             <TabsTrigger 
//               value="list" 
//               className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-purple-600 data-[state=active]:text-white"
//             >
//               <LayoutDashboard className="mr-2 h-4 w-4" />
//               Department List
//             </TabsTrigger>
//             <TabsTrigger 
//               value="create"
//               className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-purple-600 data-[state=active]:text-white"
//             >
//               <Users className="mr-2 h-4 w-4" />
//               Create/Edit Department
//             </TabsTrigger>
//             <TabsTrigger 
//               value="hierarchy"
//               className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-purple-600 data-[state=active]:text-white"
//             >
//               <GitBranchPlus className="mr-2 h-4 w-4" />
//               Department Hierarchy
//             </TabsTrigger>
//           </TabsList>
//           <TabsContent value="list">
//             <DepartmentList />
//           </TabsContent>
//           <TabsContent value="create">
//             <DepartmentForm />
//           </TabsContent>
//           <TabsContent value="hierarchy">
//             <DepartmentHierarchy />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }
