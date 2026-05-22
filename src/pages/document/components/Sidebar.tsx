import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  X,
  LayoutDashboard,
  FileText,
  RefreshCw,
  Settings as SettingsIcon,
  CreditCard
} from "lucide-react";
import useAuthStore from "../store/authStore";

interface SidebarProps {
  onClose?: () => void;
}

interface MenuItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  subItems?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout, currentUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Menu Configuration
  const allMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      path: "/documents/app",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Subscriptions",
      path: "/documents/app/subscription/all",
      icon: <CreditCard size={18} />,
    },
    {
      label: "Documents",
      path: "/documents/app/document",
      icon: <FileText size={18} />,
    },
    {
      label: "Renewals",
      path: "/documents/app/renewal",
      icon: <RefreshCw size={18} />,
    },
    // {
    //   label: "Settings",
    //   path: "/documents/app/settings",
    //   icon: <SettingsIcon size={18} />,
    // }
  ];

  const menuItems = allMenuItems.filter(item => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return currentUser.permissions?.includes(item.label);
  });

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActiveLink = item.path && (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)));

    return (
      <div key={item.path || item.label} className="mb-1">
        <button
          onClick={() => handleNavigation(item.path!)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActiveLink
            ? "bg-red-600 text-white shadow-sm font-bold"
            : "text-gray-600 hover:text-red-600 hover:bg-red-50 font-bold"
            }`}
        >
          {item.icon}
          <span className="text-sm whitespace-nowrap uppercase tracking-wider">{item.label}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-800 border-r border-gray-100 font-sans">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="flex justify-end p-2 lg:hidden flex-shrink-0">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
        {menuItems.map(item => renderMenuItem(item))}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-all group">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/20">
              <span className="text-sm font-black">{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate w-24">
                {currentUser?.name || "User"}
              </p>
              <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">
                {currentUser?.role === "admin" ? "Admin" : "Member"}
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
  );
};

export default Sidebar;
