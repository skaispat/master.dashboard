"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CheckSquare, ClipboardList, Menu, Database, KeyRound, Video, Settings, ListTodo, FileCheck, Calendar, User, Share2, DoorOpen } from 'lucide-react'
import Sidebar from "./Sidebar"
import { DATA_DEPARTMENTS } from "../../constants/departments"

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [username, setUsername] = useState("")
  const [userRole, setUserRole] = useState("")

  // Check authentication on component mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username')
    const storedRole = sessionStorage.getItem('role')

    if (!storedUsername) {
      // Redirect to login if not authenticated
      navigate("/checklist/login")
      return
    }

    setUsername(storedUsername)
    setUserRole(storedRole || "user")
  }, [navigate])

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('department')
    navigate("/checklist/login")
  }

  // Filter dataCategories based on user role
  const dataCategories = DATA_DEPARTMENTS



  // Update the routes array based on user role
  const dashboardPath = userRole === 'admin' ? '/checklist/dashboard/admin' : '/checklist/dashboard/user'

  const routes = [
    {
      href: dashboardPath,
      label: "Dashboard",
      icon: Database,
      active: location.pathname === dashboardPath,
      showFor: ["admin", "user"],
      permission: "dashboard"
    },
    {
      href: "/checklist/dashboard/user/tasks",
      label: "My Tasks",
      icon: ListTodo,
      active: location.pathname === "/checklist/dashboard/user/tasks",
      showFor: ["user"],
      permission: "tasks"
    },
    {
      href: "/checklist/dashboard/assign-task",
      label: "Assign Task",
      icon: CheckSquare,
      active: location.pathname === "/checklist/dashboard/assign-task",
      showFor: ["admin", "user"],
      permission: "assign_task"
    },
    {
      href: "/checklist/dashboard/admin/approval",
      label: "Admin Approval",
      icon: FileCheck,
      active: location.pathname === "/checklist/dashboard/admin/approval",
      showFor: ["admin"],
      permission: "admin_approval"
    },
    {
      href: "/checklist/dashboard/delegated-tasks",
      label: "Delegated Tasks",
      icon: Share2,
      active: location.pathname === "/checklist/dashboard/delegated-tasks",
      showFor: ["admin", "user"],
      permission: "delegated_tasks"
    },
    {
      href: "/checklist/dashboard/mill-gate-pass",
      label: "Mill Gate Pass",
      icon: DoorOpen,
      active: location.pathname === "/checklist/dashboard/mill-gate-pass",
      showFor: ["admin", "user"],
      permission: "mill_gate_pass"
    },
    {
      href: "#",
      label: "Department",
      icon: Database,
      active: location.pathname.includes("/checklist/dashboard/data"),
      showFor: ["admin", "user"],
      permission: "data_pages",
      submenu: true
    },
    // {
    //   href: "/checklist/dashboard/calendar",
    //   label: "Calendar",
    //   icon: Calendar,
    //   active: location.pathname === "/checklist/dashboard/calendar",
    //   showFor: ["admin", "user"],
    //   permission: "dashboard"
    // },
    {
      href: "/checklist/dashboard/profile",
      label: "My Profile",
      icon: User,
      active: location.pathname === "/checklist/dashboard/profile",
      showFor: ["admin", "user"],
      permission: "profile"
    },
    {
      href: "/checklist/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: location.pathname === "/checklist/dashboard/settings",
      showFor: ["admin", "user"],
      permission: "settings"
    },
    {
      href: "/checklist/dashboard/license",
      label: "License",
      icon: KeyRound,
      active: location.pathname === "/checklist/dashboard/license",
      showFor: ["admin", "user"],
      permission: "license"
    },
    {
      href: "/checklist/dashboard/traning-video",
      label: "Training Video",
      icon: Video,
      active: location.pathname === "/checklist/dashboard/traning-video",
      showFor: ["admin", "user"],
      permission: "training"
    },
  ]

  const getAccessibleDepartments = () => {
    const userRole = sessionStorage.getItem('role') || 'user'
    return dataCategories.filter(cat =>
      !cat.showFor || cat.showFor.includes(userRole)
    )
  }

  // Filter routes based on user role and permissions
  const getAccessibleRoutes = () => {
    const userRole = sessionStorage.getItem('role') || 'user'
    const userAccessStr = sessionStorage.getItem('user_access') || ''

    // Parse permissions
    const userAccess = userAccessStr.split(',').map(p => p.trim())
    const isAdmin = userRole === 'admin'

    return routes.filter(route => {
      // 1. First Check Role Restriction
      if (route.showFor && !route.showFor.includes(userRole)) {
        return false
      }

      // 2. Strict Access Control (Applied to Admin and User)
      // Check if user has explicit 'all' permission
      if (userAccess.includes('all')) return true

      // If a route has a 'permission' key, user MUST have that specific string in their access list
      if (route.permission) {
        if (userAccess.includes(route.permission)) return true
        return false // If they have permission defined but user doesn't have it, hide it
      }

      // Allow routes with no defined permission (General pages like Profile/Logout etc if not marked)
      return true
    })
  }



  // Get accessible routes and departments
  const accessibleRoutes = getAccessibleRoutes()
  const accessibleDepartments = getAccessibleDepartments()

  return (
    <div className="flex w-full h-full overflow-hidden bg-background">
      {/* Sidebar Component */}
      <Sidebar
        routes={accessibleRoutes}
        departments={accessibleDepartments}
        username={username}
        userRole={userRole}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-muted/10">
        {/* Mobile menu button (Visible when sidebar is hidden) */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-border">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-4 font-black text-primary text-xs uppercase tracking-widest whitespace-nowrap">Checklist</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
