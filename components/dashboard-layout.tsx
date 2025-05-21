"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Calendar,
  ChevronDown,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  User,
  Search,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { toast } from "./ui/use-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "organizer" | "attendee"
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Redirect if not authenticated or wrong role
    if (!isLoading && isMounted) {
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive",
        })
        router.push("/login")
      } else if (user?.role !== role) {
        toast({
          title: "Access denied",
          description: `This page is only accessible to ${role}s`,
          variant: "destructive",
        })
        if (user?.role === "organizer") {
          router.push("/dashboard/organizer")
        } else {
          router.push("/dashboard/attendee")
        }
      }
    }
  }, [isAuthenticated, isLoading, isMounted, router, role, user?.role])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Organizer navigation items
  const organizerNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/organizer",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Create Event",
      href: "/dashboard/organizer/events/create",
      icon: <PlusCircle className="mr-2 h-4 w-4" />,
    },
    {
      title: "Activity Logs",
      href: "/dashboard/organizer/logs",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/organizer/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  // Attendee navigation items
  const attendeeNavItems = [
    {
      title: "My Events",
      href: "/dashboard/attendee",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      title: "Browse Events",
      href: "/events",
      icon: <Search className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/attendee/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  const navItems = role === "organizer" ? organizerNavItems : attendeeNavItems

  if (isLoading || !isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              <span>EventHub</span>
            </Link>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-1">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user?.name || "User"}</p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                    {user?.role || "User"}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-auto h-8 w-8 p-0">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-purple-600" />
            <span>EventHub</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <span>EventHub</span>
                </div>
                <nav className="flex-1 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        pathname === item.href
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto space-y-2">
                  <div className="pt-4 border-t">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-1">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">{user?.name || "User"}</p>
                        <p className="text-xs font-medium text-gray-500 capitalize">{user?.role || "User"}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:pl-64 flex flex-col flex-1">
        <div className="mt-16 md:mt-0 py-6 px-4 sm:px-6 md:px-8 flex-1">{children}</div>
      </main>
    </div>
  )
}
