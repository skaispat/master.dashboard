import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Home,
  Calendar,
  Menu,
  X,
  History,
  FileSpreadsheet,
  LogOut,
  User,
  Shield,
  Clock,
  FileText,
  Users // Add this import for User Management
} from "lucide-react";
import { AuthContext } from "../../../App";

function Sidebar({ userType, username, tabs = [] }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);

  const cn = (...classes) => classes.filter(Boolean).join(" ");

  // Check if user is admin (case-insensitive)
  const isAdmin = userType?.toLowerCase() === "admin";

  const availableRoutes = [
    { label: "Dashboard", icon: Home, href: "/retail", color: "text-sky-500" },
    {
      label: "Dealer Form",
      icon: ClipboardList,
      href: "/retail/dealer-form",
      color: "text-violet-500",
    },
    {
      label: "Tracker",
      icon: FileSpreadsheet,
      href: "/retail/tracker",
      color: "text-green-600",
    },
    {
      label: "History",
      icon: History,
      href: "/retail/history",
      color: "text-pink-700",
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/retail/reports",
      color: "text-orange-500",
    },
    {
      label: "Attendance",
      icon: Calendar,
      href: "/retail/attendance",
      color: "text-emerald-500",
    },
    {
      label: "Attendance History",
      icon: Clock,
      href: "/retail/attendance-history",
      color: "text-teal-500",
    },
    {
      label: "Daily Report",
      icon: FileText,
      href: "/retail/daily-report",
      color: "text-blue-500",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/retail/user-management",
      color: "text-indigo-500",
      adminOnly: true
    },
    {
      label: "Admin Logs",
      icon: Shield,
      href: "/retail/admin-logs",
      color: "text-red-500",
      adminOnly: true
    },
  ];

  // Filter routes based on the tabs prop
  const filteredRoutes =
    tabs.length > 0
      ? availableRoutes.filter((route) => tabs.includes(route.label))
      : availableRoutes;

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-gradient-to-b from-purple-50 via-blue-50 to-indigo-50 border-r border-slate-200/80 shadow-xl transition-all duration-300 ease-in-out flex flex-col",
          "lg:relative lg:translate-x-0 lg:shadow-lg",
          isCollapsed ? "translate-x-0 w-72" : "-translate-x-full w-72",
          "lg:w-64"
        )}
      >
        {/* Mobile Close Button */}
        <div className="flex justify-end p-2 lg:hidden flex-shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-3 space-y-2 overflow-y-auto">
          {filteredRoutes.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              No menu items available
            </div>
          ) : (
            filteredRoutes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsCollapsed(false);
                }}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  "hover:bg-white/60 hover:shadow-sm hover:scale-[1.02]",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white/60",
                  location.pathname === route.href
                    ? "bg-white shadow-md text-slate-900 border border-slate-200/50"
                    : "text-slate-600 hover:text-slate-900"
                )}
                title={route.label}
              >
                <route.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    route.color,
                    location.pathname === route.href && "drop-shadow-sm"
                  )}
                />
                <span className="truncate">{route.label}</span>

                {/* Show active indicator for all routes */}
                {location.pathname === route.href && (
                  <div className={cn(
                    "ml-auto w-2 h-2 rounded-full",
                    route.adminOnly ? "bg-red-500" : "bg-gradient-to-r from-purple-500 to-blue-500"
                  )} />
                )}
              </Link>
            ))
          )}
        </nav>

        {/* Footer with User Info and Logout */}
        <div className="mt-auto px-4 pb-6 pt-4 border-t border-slate-200/50">
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
                  {isAdmin ? "Admin" : (userType || "Member")}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-100/50 transition-all opacity-0 group-hover:opacity-100"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile toggle */}
      <button
        className="absolute top-4 left-4 z-[45] lg:hidden rounded-xl bg-white shadow-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-3"
        onClick={() => setIsCollapsed(true)}
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}

export default Sidebar;
