"use client"

import { useState, useEffect, ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ListOrdered, PlusCircle, GitBranchPlus, LogOut, Menu, X, Settings, User } from "lucide-react"
import { useDispatch } from "react-redux"
import { clearAuthState } from "@/store/authSlice"

export function DashboardSidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch();
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false); // New state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    setLoggingOut(true); // Prevent redirect loop
    localStorage.removeItem("isAuthenticated");
    dispatch(clearAuthState());
    router.replace("/login"); // use replace instead of push to avoid going back
  };


  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Departments",
      href: "/dashboard/departments",
      icon: <ListOrdered className="h-5 w-5" />,
    },
    // {
    //   name: "Create Department",
    //   href: "/dashboard/create",
    //   icon: <PlusCircle className="h-5 w-5" />,
    // },
    // {
    //   name: "Hierarchy",
    //   href: "/dashboard/hierarchy",
    //   icon: <GitBranchPlus className="h-5 w-5" />,
    // },
  ]

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="border-purple-700 bg-gray-900/80 backdrop-blur-sm"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-black border-r border-purple-800/50 shadow-xl overflow-y-auto">
            <div className="p-6">
              <SidebarContent
                navItems={navItems}
                pathname={pathname}
                handleLogout={handleLogout}
                closeMobileMenu={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-black border-r border-purple-800/50 z-30">
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="p-6">
            <SidebarContent navItems={navItems} pathname={pathname} handleLogout={handleLogout} />
          </div>
        </div>
      </div>
    </>
  )
}
interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

interface SidebarContentProps {
  navItems: NavItem[];
  pathname: string;
  handleLogout: () => void;
  closeMobileMenu?: () => void;
}
function SidebarContent({ navItems, pathname, handleLogout, closeMobileMenu = () => {} }:SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-purple-600/30 blur-md"></div>
          <div className="relative bg-gradient-to-r from-purple-600 to-purple-800 p-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white p-1"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
        </div>
        <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white">
          DeptManager
        </span>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1 mb-6">
        <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider px-4 mb-2">Main Navigation</p>
        {navItems.map((item:any) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-purple-900/50 text-white border-l-4 border-purple-500"
                  : "text-gray-400 hover:bg-purple-900/30 hover:text-white"
              }`}
            >
              <span className={`${isActive ? "text-purple-400" : "text-gray-500"} mr-3`}>{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Settings Section */}
      <div className="space-y-1 mb-6">
        <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider px-4 mb-2">Settings</p>
        <Link
          href="#"
          className="flex items-center px-4 py-3 rounded-lg transition-all text-gray-400 hover:bg-purple-900/30 hover:text-white"
        >
          <span className="text-gray-500 mr-3">
            <Settings className="h-5 w-5" />
          </span>
          Settings
        </Link>
        <Link
          href="#"
          className="flex items-center px-4 py-3 rounded-lg transition-all text-gray-400 hover:bg-purple-900/30 hover:text-white"
        >
          <span className="text-gray-500 mr-3">
            <User className="h-5 w-5" />
          </span>
          Profile
        </Link>
      </div>

      {/* Account Section */}
      <div className="mt-auto pt-4 border-t border-purple-900/50">
        <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider px-4 mb-2">Account</p>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-purple-900/30"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
