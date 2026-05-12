import React, { useState, useEffect } from 'react'
import { X, Play, Users, User, Video, ScrollText } from 'lucide-react'
import AdminLayout from "../components/layout/AdminLayout";

const HelpVideo = () => {
    const [userRole, setUserRole] = useState("")
    const [username, setUsername] = useState("")
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)

    // Get user info from sessionStorage
    useEffect(() => {
        const storedRole = sessionStorage.getItem('role') || 'user'
        const storedUsername = sessionStorage.getItem('username') || 'User'
        setUserRole(storedRole)
        setUsername(storedUsername)
    }, [])

    // Function to convert YouTube URL to embed URL
    const getYouTubeEmbedUrl = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11
            ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`
            : url;
    };

    // Different video URLs for admin and user
    const videoUrls = {
        admin: "https://youtu.be/v2yqJc1CKBA?si=J_r0PAIlGOqkHsz3", // Admin video
        user: "https://youtu.be/UL-EZE3c_pA"   // User video
    };

    const currentVideoUrl = videoUrls[userRole] || videoUrls.user;
    const embedUrl = getYouTubeEmbedUrl(currentVideoUrl);

    const handleVideoToggle = () => {
        setIsVideoPlaying(!isVideoPlaying)
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-muted/30 p-6 sm:p-10">
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/20 rotate-3">
                                <Video className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 uppercase">
                                    Tutorial <span className="text-red-600">Video</span>
                                </h1>
                                <p className="text-gray-500 mt-1 font-medium tracking-tight">
                                    Master the system with our step-by-step video guidance
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-3 shadow-sm group hover:border-red-100 transition-all">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${userRole === "admin" ? "bg-red-50 text-red-600 group-hover:bg-red-100" : "bg-blue-50 text-blue-600"}`}>
                                {userRole === "admin" ? (
                                    <Users className="h-5 w-5" />
                                ) : (
                                    <User className="h-5 w-5" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest leading-tight">
                                    {username}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${userRole === "admin" ? "text-red-600" : "text-blue-600"}`}>
                                    {userRole} Mode
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                        {/* Video Section */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                    {userRole === "admin" ? "Admin Excellence Walkthrough" : "Operator Success Guide"}
                                </h2>
                            </div>

                            <div className="relative group bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-video ring-1 ring-gray-100">
                                {!isVideoPlaying ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-transparent opacity-60"></div>
                                        <div className="relative z-10 text-center">
                                            <button
                                                onClick={handleVideoToggle}
                                                className="bg-white text-red-600 rounded-3xl p-8 transition-all duration-500 transform group-hover:scale-110 shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] active:scale-95"
                                            >
                                                <Play className="h-12 w-12 fill-red-600 ml-1.5" />
                                            </button>
                                            <p className="text-white font-black uppercase tracking-[0.3em] mt-8 text-xs drop-shadow-md">Initialize Training</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative h-full w-full">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={embedUrl}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            className="h-full w-full"
                                        ></iframe>
                                        <button
                                            onClick={handleVideoToggle}
                                            className="absolute top-6 right-6 bg-black/40 hover:bg-red-600 text-white rounded-2xl p-3 transition-all backdrop-blur-md border border-white/10"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Learning Path */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 h-full shadow-xl relative overflow-hidden group hover:border-red-100 transition-all">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-red-800"></div>
                                
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                    <ScrollText className="h-5 w-5 text-red-600" />
                                    Training Path
                                </h3>

                                <div className="space-y-6">
                                    {(userRole === "admin" ? [
                                        "User & Access Management",
                                        "Task Creation Workflow",
                                        "Real-time Performance Audit",
                                        "Strategic Reporting Tools",
                                        "Global System Settings"
                                    ] : [
                                        "Interface Navigation",
                                        "Batch Task Processing",
                                        "Interactive Checklists",
                                        "Status Updates Logic",
                                        "Delegation Management"
                                    ]).map((text, i) => (
                                        <div key={i} className="flex items-start gap-4 group/item">
                                            <div className="mt-1 h-5 w-5 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover/item:bg-red-600 group-hover/item:text-white transition-all duration-300">
                                                0{i + 1}
                                            </div>
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider group-hover/item:text-gray-900 transition-colors">{text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-6 rounded-3xl bg-gray-50 border border-gray-100 relative group-hover:bg-red-50/50 transition-colors">
                                    <div className="flex flex-col gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                            <Users className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mb-1">
                                                Support Active
                                            </p>
                                            <p className="text-xs font-bold text-gray-600 leading-relaxed">
                                                Need personalized training? Our team is available for live sessions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default HelpVideo
