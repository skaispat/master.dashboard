import React, { useState, useEffect } from 'react'
import { KeyRound } from 'lucide-react'
import AdminLayout from "../components/layout/AdminLayout";

const License = () => {
    const [userRole, setUserRole] = useState("")
    const [username, setUsername] = useState("")

    // Get user info from sessionStorage
    useEffect(() => {
        const storedRole = sessionStorage.getItem('role') || 'user'
        const storedUsername = sessionStorage.getItem('username') || 'User'
        setUserRole(storedRole)
        setUsername(storedUsername)
    }, [])

    return (
        <AdminLayout>
            <div className="min-h-screen bg-muted/30 p-6 sm:p-10">
                <div className="max-w-4xl mx-auto space-y-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/20 rotate-3 transition-transform hover:rotate-0 duration-300">
                                <KeyRound className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 uppercase">
                                    License <span className="text-red-600">Agreement</span>
                                </h1>
                                <p className="text-gray-500 mt-1 font-medium tracking-tight">
                                    Software license terms and conditions for industrial use
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* License Content */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:bg-red-100 transition-colors duration-700"></div>
                        
                        <div className="p-8 sm:p-12 space-y-12 relative z-10">
                            {/* Copyright Notice */}
                            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-900 to-red-950 p-10 border border-white/10 shadow-2xl">
                                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-red-600/10 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-red-600/10 blur-3xl"></div>

                                <div className="relative text-center space-y-6">
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black tracking-[0.2em] text-white/90 uppercase">
                                        Exclusive Software Rights
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic">
                                        © BOTIVATE SERVICES LLP
                                    </div>
                                    <p className="text-white/70 leading-relaxed max-w-2xl mx-auto text-sm font-medium">
                                        This software is developed exclusively by Botivate Services LLP for its enterprise clients.
                                        Unauthorized use, distribution, or copying of this software is strictly prohibited and
                                        governed by international intellectual property laws.
                                    </p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="flex flex-col items-center justify-center space-y-8">
                                <div className="text-center space-y-3">
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest">Connect with Support</h4>
                                    <p className="text-sm text-gray-500 font-medium">
                                        Need technical assistance or license verification? Our team is here to help.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
                                    <a
                                        href="mailto:info@botivate.in"
                                        className="flex items-center justify-center gap-4 px-8 py-4 rounded-2xl bg-white border border-gray-100 text-gray-900 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all duration-300 group shadow-sm hover:shadow-md"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                            <span className="text-xl">📧</span>
                                        </div>
                                        <span className="font-bold tracking-tight uppercase text-xs">info@botivate.in</span>
                                    </a>
                                    <a
                                        href="https://www.botivate.in"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-4 px-8 py-4 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-all duration-300 group shadow-lg shadow-red-900/20"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                            <span className="text-xl">🌐</span>
                                        </div>
                                        <span className="font-bold tracking-tight uppercase text-xs">www.botivate.in</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default License
