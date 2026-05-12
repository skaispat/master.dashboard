"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { ClipboardList, LogOut, ChevronDown, ChevronRight, Menu } from 'lucide-react'

export default function Sidebar({
    routes,
    departments,
    username,
    userRole,
    onLogout,
    isMobileMenuOpen,
    setIsMobileMenuOpen
}) {
    const location = useLocation()
    const [isDataSubmenuOpen, setIsDataSubmenuOpen] = useState(false)

    // Check if the current path is a data category page
    const isDataPage = location.pathname.includes("/checklist/dashboard/data/")

    // If it's a data page, expand the submenu by default
    useEffect(() => {
        if (isDataPage && !isDataSubmenuOpen) {
            setIsDataSubmenuOpen(true)
        }
    }, [isDataPage, isDataSubmenuOpen])

    // Get user department for filtering
    const [userDept, setUserDept] = useState("")

    useEffect(() => {
        const storedDept = sessionStorage.getItem('department')
        if (storedDept) {
            setUserDept(storedDept)
        }
    }, [])

    const visibleDepartments = userRole === 'admin'
        ? departments
        : departments.filter(d => {
            const accessStr = sessionStorage.getItem('user_access') || ''
            const permissions = accessStr.split(',').map(p => p.trim())

            // 1. Check for explicit department access (new multi-dept system)
            if (permissions.includes(`dept:${d.id}`)) return true

            // 2. Check for primary department access (default/fallback)
            if (!userDept) return false
            const normalizedUserDept = userDept.toLowerCase().trim()
            const normalizedCatName = d.name.toLowerCase().trim()

            // Flexible matching for cases like "Accounts" matching "Account"
            return normalizedUserDept.includes(normalizedCatName) ||
                normalizedCatName.includes(normalizedUserDept)
        })

    const DesktopSidebar = () => {
        const dashboardPath = userRole === 'admin' ? '/checklist/dashboard/admin' : '/checklist/dashboard/user'

        return (
            <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-white md:flex md:flex-col shadow-sm h-full">
                <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
                    <ul className="space-y-1.5">
                        {routes.map((route) => (
                            <li key={route.label}>
                                {route.submenu ? (
                                    <div>
                                        <button
                                            onClick={() => setIsDataSubmenuOpen(!isDataSubmenuOpen)}
                                            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 ${route.active
                                                ? "bg-red-600 text-white shadow-md"
                                                : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <route.icon className={`h-5 w-5 ${route.active ? "text-white" : "text-gray-500 group-hover:text-red-600"}`} />
                                                {route.label}
                                            </div>
                                            {isDataSubmenuOpen ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
                                        </button>
                                        {isDataSubmenuOpen && (
                                            <ul className="mt-2 ml-4 space-y-1.5 pl-4 border-l-2 border-red-50">
                                                {visibleDepartments.map((category) => (
                                                    <li key={category.id}>
                                                        <Link
                                                            to={category.link || `/dashboard/data/${category.id}`}
                                                            className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${location.pathname === (category.link || `/dashboard/data/${category.id}`)
                                                                ? "text-red-700 bg-red-50"
                                                                : "text-gray-500 hover:text-red-600 hover:bg-red-50/50"
                                                                }`}
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        to={route.href}
                                        className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${route.active
                                            ? "bg-red-600 text-white shadow-md shadow-red-900/10"
                                            : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                                            }`}
                                    >
                                        <route.icon className={`h-5 w-5 ${route.active ? "text-white" : "text-gray-500"}`} />
                                        {route.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Minimal User Profile */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/20">
                                <span className="text-sm font-black">{username ? username.charAt(0).toUpperCase() : 'U'}</span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 truncate w-24">
                                    {username || "User"}
                                </p>
                                <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">
                                    {userRole === "admin" ? "Admin" : "Member"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-100/50 transition-all opacity-0 group-hover:opacity-100"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </aside>
        )
    }

    const MobileSidebar = () => {
        const dashboardPath = userRole === 'admin' ? '/checklist/dashboard/admin' : '/checklist/dashboard/user'

        return (
            isMobileMenuOpen && (
                <div className="fixed inset-0 z-[500] md:hidden">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl border-r border-gray-100 pt-20">
                        <nav className="flex-1 overflow-y-auto px-4 py-6">
                            <ul className="space-y-1.5">
                                {routes.map((route) => (
                                    <li key={route.label}>
                                        {route.submenu ? (
                                            <div>
                                                <button
                                                    onClick={() => setIsDataSubmenuOpen(!isDataSubmenuOpen)}
                                                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${route.active
                                                        ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                                                        : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <route.icon className={`h-5 w-5 ${route.active ? "text-white" : ""}`} />
                                                        {route.label}
                                                    </div>
                                                    {isDataSubmenuOpen ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
                                                </button>
                                                {isDataSubmenuOpen && (
                                                    <ul className="mt-2 ml-4 space-y-1.5 border-l-2 border-red-50 pl-4">
                                                        {visibleDepartments.map((category) => (
                                                            <li key={category.id}>
                                                                 <Link
                                                                    to={category.link || `/dashboard/data/${category.id}`}
                                                                    className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${location.pathname === (category.link || `/dashboard/data/${category.id}`)
                                                                        ? "text-red-600 bg-red-50"
                                                                        : "text-gray-500 hover:text-red-600 hover:bg-red-50/50"
                                                                        }`}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                >
                                                                    {category.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                to={route.href}
                                                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${route.active
                                                    ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                                                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                                                    }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <route.icon className={`h-5 w-5 ${route.active ? "text-white" : ""}`} />
                                                {route.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                                        {username ? username.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{username || "User"}</p>
                                        <p className="text-[10px] text-red-600 font-black uppercase tracking-wider">{userRole}</p>
                                    </div>
                                </div>
                                <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        )
    }

    return (
        <>
            <DesktopSidebar />
            <MobileSidebar />
        </>
    )
}
