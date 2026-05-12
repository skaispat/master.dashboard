import { useState, useEffect } from "react"
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
        return <Navigate to="/login" replace />;
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
            {/* --- Auth Route --- */}
            <Route path="/login" element={<LoginPageMain />} />

            {/* --- Protected Routes --- */}
            <Route path="/" element={<RootProtectedRoute><MainLayout /></RootProtectedRoute>}>
                {/* --- Main Landing Page --- */}
                <Route index element={<Home />} />

                {/* --- Checklist Module --- */}
                <Route path="checklist">
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

                {/* --- Document Module --- */}
                <Route path="documents">
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

export default App
