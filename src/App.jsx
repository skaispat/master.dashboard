import { useState, useEffect, createContext } from "react"
import DashboardRetail from "./pages/retail/pages/Dashboard";
import DealerFormRetail from "./pages/retail/pages/DealerForm";
import HistoryRetail from "./pages/retail/pages/History";
import TrackerRetail from "./pages/retail/pages/Tracker";
import ReportsRetail from "./pages/retail/pages/Reports";

import AttendanceRetail from "./pages/retail/pages/Attendents";
import SidebarRetail from "./pages/retail/components/Sidebaar";
import DailyReportRetail from "./pages/retail/pages/Dailyreport";
import AdminLogsRetail from "./pages/retail/pages/AdminLogs";
import UserManagementRetail from "./pages/retail/pages/UserManagement";
import supabaseRetail from "./pages/retail/SupaabseClient";
import AttendanceHistoryPageRetail from "./pages/retail/pages/AttendanceHistoryPage";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { supabase } from "./pages/document/lib/supabase"
import { AuthProvider, useAuth } from "./Auth/AuthContext"
import LoginPageMain from "./Auth/LoginPage"

// --- Landing Page ---
import Home from "./pages/Home"

// --- Checklist Module Imports ---
import AdminDashboard from "./pages/checklist/pages/admin/Dashboard"
import AdminAssignTask from "./pages/checklist/pages/admin/AssignTask"
import AdminApproval from "./pages/checklist/pages/admin/AdminApproval"
import License from "./pages/checklist/pages/License"
import TrainingVideo from "./pages/checklist/pages/TrainingVideo"
import SettingsChecklist from "./pages/checklist/pages/admin/Settings"
import Profile from "./pages/checklist/pages/admin/Profile"
import DelegatedTask from "./pages/checklist/pages/user/DelegatedTask"
import UserDashboard from "./pages/checklist/pages/user/Dashboard"
import UserTasks from "./pages/checklist/pages/user/Tasks"
import CalendarPage from "./pages/checklist/pages/CalendarPage"
import MillGatePass from "./pages/checklist/pages/MillGatePass"

import HouseKeepingData from "./pages/checklist/components/data/HouseKeepingData"
import StoreData from "./pages/checklist/components/data/StoreData"
import AccountData from "./pages/checklist/components/data/AccountData"
import AdminData from "./pages/checklist/components/data/AdminData"
import SecurityData from "./pages/checklist/components/data/SecurityData"
import SlagCrusherData from "./pages/checklist/components/data/SlagCrusherData"
import HRData from "./pages/checklist/components/data/HRData"
import MGMTData from "./pages/checklist/components/data/MGMTData"
import HealthAndSafetyData from "./pages/checklist/components/data/HealthAndSafetyData"

// --- Document Module Imports ---
import Layout from "./pages/document/components/Layout"
import DashboardDocument from "./pages/document/pages/Dashboard"
import ProtectedRouteDocument from "./pages/document/components/ProtectedRoute"
import SettingsDocument from "./pages/document/pages/Settings"
import RenewalsManager from "./pages/document/pages/renewals/RenewalsManager"
import DocumentsManager from "./pages/document/pages/document/DocumentsManager"
import DocumentRenewal from "./pages/document/pages/document/Renewal"
import AllSubscriptions from "./pages/document/pages/subscription/AllSubscriptions"
import SubscriptionApproval from "./pages/document/pages/subscription/Approval"
import SubscriptionPayment from "./pages/document/pages/subscription/Payment"

// ==========================================
// GLOBAL AUTH PROTECTION
// ==========================================

const RootProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">SKA Master Dashboard</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ==========================================
// CHECKLIST AUTH COMPONENTS (Legacy/Module specific checks)
// ==========================================

const ChecklistDashboardRedirect = () => {
  const role = sessionStorage.getItem("role")
  const targetPath = role === 'admin' ? '/checklist/dashboard/admin' : '/checklist/dashboard/user'
  return <Navigate to={targetPath} replace />
}

// We still keep the detailed permission checks for Checklist
const ChecklistProtectedRoute = ({ children, allowedRoles = [], requiredPermission = null }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const username = sessionStorage.getItem("username")

  useEffect(() => {
    const checkAccess = async () => {
      if (!username) {
        setLoading(false)
        return
      }

      try {
        const { data: user, error } = await supabase
          .from('users')
          .select('role, user_access, status')
          .eq('username', username)
          .single()

        if (error || !user) {
          console.error("Error verifying user:", error)
          setLoading(false)
          return
        }

        if (user.status === 'inactive') {
          sessionStorage.clear()
          window.location.href = '/login' // Force full reload to auth
          return
        }

        const accessRights = user.user_access || (user.role === 'admin' ? 'all' : '')
        sessionStorage.setItem('role', user.role)
        sessionStorage.setItem('user_access', accessRights)

        let authorized = true
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          authorized = false
        }

        if (requiredPermission && user.role !== 'admin') {
          const permissions = accessRights ? accessRights.split(',') : []
          if (!permissions.includes(requiredPermission)) {
            authorized = false
          }
        }

        setIsAuthorized(authorized)
      } catch (err) {
        console.error("Auth check failed:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [username, navigate, allowedRoles, requiredPermission])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Verifying Module Access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    const role = sessionStorage.getItem('role')
    const dashboardPath = role === 'admin' ? '/checklist/dashboard/admin' : '/checklist/dashboard/user'

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600 font-bold p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <h2 className="text-xl mb-2 font-black uppercase">Access Denied</h2>
          <p className="text-sm text-gray-500 font-normal">
            You do not have permission to view the <span className="font-semibold text-gray-700">{requiredPermission || 'requested'}</span> page.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-red-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return children
}

import MainLayout from "./components/MainLayout"

// ==========================================
// MAIN APP COMPONENT
// ==========================================

function AppRoutes() {
  return (
    <Routes>
      {/* --- Public Landing Page --- */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        {/* --- Protected Checklist Module --- */}
        <Route path="checklist" element={<RootProtectedRoute><Outlet /></RootProtectedRoute>}>
          <Route index element={<ChecklistDashboardRedirect />} />
          <Route path="dashboard" element={<ChecklistDashboardRedirect />} />

          <Route path="dashboard/admin" element={
            <ChecklistProtectedRoute requiredPermission="dashboard" allowedRoles={['admin']}>
              <AdminDashboard />
            </ChecklistProtectedRoute>
          } />

          <Route path="dashboard/user" element={
            <ChecklistProtectedRoute requiredPermission="dashboard">
              <UserDashboard />
            </ChecklistProtectedRoute>
          } />

          <Route path="dashboard/user/tasks" element={
            <ChecklistProtectedRoute requiredPermission="dashboard">
              <UserTasks />
            </ChecklistProtectedRoute>
          } />

          {/* Checklist Data Routes */}
          <Route path="dashboard/data/housekeeping" element={<ChecklistProtectedRoute requiredPermission="dashboard"><HouseKeepingData /></ChecklistProtectedRoute>} />
          <Route path="dashboard/data/store" element={<ChecklistProtectedRoute requiredPermission="dashboard"><StoreData /></ChecklistProtectedRoute>} />
          <Route path="dashboard/data/account" element={<ChecklistProtectedRoute requiredPermission="dashboard"><AccountData /></ChecklistProtectedRoute>} />
          <Route path="dashboard/data/admin" element={<ChecklistProtectedRoute requiredPermission="dashboard"><AdminData /></ChecklistProtectedRoute>} />
          <Route path="dashboard/data/security" element={<ChecklistProtectedRoute requiredPermission="dashboard"><SecurityData /></ChecklistProtectedRoute>} />
          <Route path="dashboard/data/slag-crusher" element={<ChecklistProtectedRoute requiredPermission="dashboard"><SlagCrusherData /></ChecklistProtectedRoute>} />
          <Route path="dashboard/data/hr" element={<ChecklistProtectedRoute requiredPermission="dashboard"><HRData /></ChecklistProtectedRoute>} />
          <Route path="dashboard/data/mgmt" element={<ChecklistProtectedRoute requiredPermission="dashboard"><MGMTData /></ChecklistProtectedRoute>} />
          <Route path="dashboard/data/health-and-safety" element={<ChecklistProtectedRoute requiredPermission="dashboard"><HealthAndSafetyData /></ChecklistProtectedRoute>} />

          {/* Checklist Admin Routes */}
          <Route path="dashboard/assign-task" element={<ChecklistProtectedRoute requiredPermission="assign_task"><AdminAssignTask /></ChecklistProtectedRoute>} />
          <Route path="dashboard/admin/approval" element={<ChecklistProtectedRoute requiredPermission="assign_task" allowedRoles={['admin']}><AdminApproval /></ChecklistProtectedRoute>} />
          <Route path="dashboard/license" element={<ChecklistProtectedRoute requiredPermission="license"><License /></ChecklistProtectedRoute>} />
          <Route path="dashboard/traning-video" element={<ChecklistProtectedRoute requiredPermission="training"><TrainingVideo /></ChecklistProtectedRoute>} />
          <Route path="dashboard/profile" element={<ChecklistProtectedRoute requiredPermission="profile"><Profile /></ChecklistProtectedRoute>} />
          <Route path="dashboard/delegated-tasks" element={<ChecklistProtectedRoute requiredPermission="delegated_tasks"><DelegatedTask /></ChecklistProtectedRoute>} />
          <Route path="dashboard/settings" element={<ChecklistProtectedRoute requiredPermission="settings"><SettingsChecklist /></ChecklistProtectedRoute>} />
          <Route path="dashboard/calendar" element={<ChecklistProtectedRoute requiredPermission="dashboard"><CalendarPage /></ChecklistProtectedRoute>} />
          <Route path="dashboard/mill-gate-pass" element={<ChecklistProtectedRoute requiredPermission="dashboard"><MillGatePass /></ChecklistProtectedRoute>} />
        </Route>

        {/* --- Protected Document Module --- */}
        <Route path="documents" element={<RootProtectedRoute><Outlet /></RootProtectedRoute>}>
          <Route index element={<Navigate to="app" replace />} />

          <Route path="app" element={
            <ProtectedRouteDocument>
              <Layout />
            </ProtectedRouteDocument>
          }>
            <Route index element={<DashboardDocument />} />
            <Route path="document">
              <Route index element={<DocumentsManager />} />
              <Route path="renewal" element={<DocumentRenewal />} />
            </Route>
            <Route path="renewal" element={<RenewalsManager />} />
            <Route path="subscription">
              <Route index element={<Navigate to="all" replace />} />
              <Route path="all" element={<AllSubscriptions />} />
              <Route path="approval" element={<SubscriptionApproval />} />
              <Route path="payment" element={<SubscriptionPayment />} />
            </Route>
            <Route path="settings" element={<SettingsDocument />} />
          </Route>
        </Route>

        {/* Redirect old module login pages to main home if already logged in */}
        <Route path="checklist/login" element={<Navigate to="/" replace />} />
        <Route path="documents/login" element={<Navigate to="/" replace />} />

        {/* --- Protected Retail Module --- */}
        <Route path="retail/*" element={<RetailApp />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

// ==========================================
// RETAIL APP COMPONENT
// ==========================================
export const AuthContext = createContext(null);

const RetailApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const isAdminUser = (role) => role?.toLowerCase() === "admin";

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("currentUser");

    if (auth === "true" && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setCurrentUser(parsedUser);
      setUserType(parsedUser.role);
      setTabs(parsedUser.tabs || []);
    }
  }, []);

  const logUserActivity = async (username, action) => {
    try {
      const now = new Date();
      const loginDate = now.toISOString().split('T')[0];
      const loginTime = now.toTimeString().split(' ')[0];

      if (action === 'login') {
        const { error } = await supabaseRetail.from('user_logs').insert([{
          user_name: username, login_date: loginDate, login_time: loginTime,
          logout_time: null, access_requested: false, request_time: null, created_at: now.toISOString()
        }]);
        if (error) console.error("Error logging login activity:", error);
      } else if (action === 'logout') {
        const { error } = await supabaseRetail.from('user_logs').update({ logout_time: loginTime })
          .eq('user_name', username).eq('login_date', loginDate).is('logout_time', null)
          .order('login_time', { ascending: false }).limit(1);
        if (error) console.error("Error logging logout activity:", error);
      }
    } catch (error) {
      console.error("Error in logUserActivity:", error);
    }
  };

  const displayWelcomePopup = (username) => {
    setShowWelcomePopup(true);
    setTimeout(() => setShowWelcomePopup(false), 2000);
  };

  const login = async (username, password) => {
    try {
      const { data, error } = await supabaseRetail.from('users').select('*')
        .eq('username', username).eq('password', password).single();

      if (error) {
        if (error.code === 'PGRST116') {
          displayNotification("Invalid username or password", "error");
          return { success: false, accessDenied: false };
        }
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (data) {
        const userIsAdmin = isAdminUser(data.role);
        const userInfo = {
          username: data.username, role: data.role || "user", position: data.position || "",
          salesPersonName: data.full_name || "Unknown Sales Person", loginTime: new Date().toISOString(),
          tabs: (data.retail_access === "all" || userIsAdmin)
            ? ["Dashboard", "Dealer Form", "Tracker", "History", "Reports", "Attendance", "Attendance History", "Daily Report", "User Management", "Admin Logs"]
            : (data.retail_access || "").split(",").map((t) => t.trim()).filter(Boolean),
        };

        setIsAuthenticated(true);
        setCurrentUser(userInfo);
        setUserType(userInfo.role);
        setTabs(userInfo.tabs);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(userInfo));
        localStorage.setItem("userType", userInfo.role);

        logUserActivity(username, 'login').catch(err => console.error(err));
        displayWelcomePopup(username);
        displayNotification(`Welcome, ${username}!`, "success");
        return { success: true, accessDenied: false };
      } else {
        displayNotification("Invalid username or password", "error");
        return { success: false, accessDenied: false };
      }
    } catch (error) {
      console.error("Login error:", error);
      displayNotification("An error occurred during login", "error");
      return { success: false, accessDenied: false };
    }
  };

  const logout = () => {
    if (currentUser) {
      logUserActivity(currentUser.username, 'logout').catch(err => console.error(err));
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserType(null);
    setTabs([]);
    displayNotification("Logged out successfully", "success");
  };

  const displayNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const isAdmin = () => isAdminUser(userType);

  const ProtectedRouteRetail = ({ children, adminOnly = false }) => {
    if (!isAuthenticated) return <Navigate to="/retail/login" />;
    if (adminOnly && !isAdmin()) {
      displayNotification("You don't have permission to access this page", "error");
      return <Navigate to="/retail" />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, currentUser, userType, isAdmin, showNotification: displayNotification, tabs }}>
      <div className="flex flex-1 h-full w-full bg-gray-50 text-gray-900 relative">
        {showWelcomePopup && currentUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full transform animate-in zoom-in-95 scale-100 opacity-100">
              <div className="text-center">
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to</h2>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Retail Enquiry Management System</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                  <p className="text-lg font-medium text-gray-700">Hello, <span className="font-bold text-blue-600">{currentUser.salesPersonName}</span>!</p>
                  <p className="text-sm text-gray-500 mt-1">Role: <span className="font-medium capitalize">{currentUser.position}</span></p>
                </div>
                <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <SidebarRetail logout={logout} userType={userType} username={currentUser?.username} tabs={tabs} />
        )}

        <div className="flex flex-col flex-1 overflow-hidden w-full">
          {notification && (
            <div className={`p-4 text-sm ${notification.type === "error" ? "bg-red-100 text-red-700" : notification.type === "success" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
              {notification.message}
            </div>
          )}

          <div className="sm:mt-0 mt-12 flex-1 min-h-0 overflow-y-auto px-2 sm:px-6 py-4 flex flex-col justify-between">
            <div className="mb-5">
              <Routes>
                <Route path="login" element={!isAuthenticated ? <LoginPageMain isRetail={true} /> : <Navigate to="/retail" />} />
                <Route path="/" element={<ProtectedRouteRetail><DashboardRetail /></ProtectedRouteRetail>} />
                <Route path="dealer-form" element={<ProtectedRouteRetail><DealerFormRetail /></ProtectedRouteRetail>} />
                <Route path="tracker" element={<ProtectedRouteRetail><TrackerRetail /></ProtectedRouteRetail>} />
                <Route path="history" element={<ProtectedRouteRetail><HistoryRetail /></ProtectedRouteRetail>} />
                <Route path="reports" element={<ProtectedRouteRetail><ReportsRetail /></ProtectedRouteRetail>} />
                <Route path="attendance" element={<ProtectedRouteRetail><AttendanceRetail /></ProtectedRouteRetail>} />
                <Route path="attendance-history" element={<ProtectedRouteRetail><AttendanceHistoryPageRetail /></ProtectedRouteRetail>} />
                <Route path="daily-report" element={<ProtectedRouteRetail><DailyReportRetail /></ProtectedRouteRetail>} />
                <Route path="user-management" element={<ProtectedRouteRetail adminOnly={true}><UserManagementRetail /></ProtectedRouteRetail>} />
                <Route path="admin-logs" element={<ProtectedRouteRetail adminOnly={true}><AdminLogsRetail /></ProtectedRouteRetail>} />
                <Route path="*" element={<Navigate to="/retail" />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
