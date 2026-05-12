"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const UserLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  // Check authentication on component mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username')

    if (!storedUsername) {
      // Redirect to login if no username found
      navigate('/checklist/login')
      return
    }

    setUsername(storedUsername)
    setIsAdmin(storedUsername.toLowerCase() === 'admin')
  }, [navigate])

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('username')
    navigate('/checklist/login')
  }

  const routes = isAdmin
    ? [
      { href: "/admin/dashboard", label: "Dashboard", icon: "home" },
      { href: "/admin/assign-task", label: "Assign Task", icon: "check-square" },
      { href: "/admin/tasks", label: "All Tasks", icon: "clipboard-list" },
    ]
    : [
      { href: "/user/dashboard", label: "Dashboard", icon: "home" },
      { href: "/user/tasks", label: "My Tasks", icon: "clipboard-list" },
      { href: "/user/completed-tasks", label: "Completed Tasks", icon: "check-square" },
      { href: "/user/profile", label: "Profile", icon: "user" },
    ]

  const getIcon = (iconName) => {
    switch (iconName) {
      case "home":
        return <i className="fas fa-home w-4 h-4"></i>
      case "clipboard-list":
        return <i className="fas fa-clipboard-list w-4 h-4"></i>
      case "check-square":
        return <i className="fas fa-check-square w-4 h-4"></i>
      case "user":
        return <i className="fas fa-user w-4 h-4"></i>
      case "cog":
        return <i className="fas fa-cog w-4 h-4"></i>
      default:
        return <i className="fas fa-circle w-4 h-4"></i>
    }
  }

  return (
    <div className="flex w-full h-full overflow-hidden bg-background">
      {/* Sidebar for desktop (Hiding internal one to use Unified feel if possible, but keeping it for now as per "don't change logic") */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-green-200 bg-white md:flex md:flex-col">
        {/* ... Sidebar content ... */}
        <div className="flex h-14 items-center border-b border-green-200 px-4 bg-gradient-to-r from-green-50 to-teal-50">
          <Link
            to={isAdmin ? "/checklist/dashboard/admin" : "/checklist/dashboard/user"}
            className="flex items-center gap-2 font-semibold text-green-700"
          >
            <i className="fas fa-clipboard-list h-5 w-5 text-green-600"></i>
            <span className="text-xs uppercase font-black tracking-widest">Checklist</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  to={route.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === route.href
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-green-50"
                    }`}
                >
                  {getIcon(route.icon)}
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-muted/10">
        {/* Mobile menu button (Visible when sidebar is hidden) */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-border">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <i className="fas fa-bars h-6 w-6"></i>
          </button>
          <span className="ml-4 font-black text-primary text-xs uppercase tracking-widest whitespace-nowrap">Checklist</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default UserLayout
