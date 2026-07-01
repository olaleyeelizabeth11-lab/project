import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, Briefcase, Users, CheckCheck } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail]               = useState("");
    const [password, setPassword]         = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading]           = useState(false);
    const navigate                        = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("https://proback-ops7.onrender.com/user/login", { email, password });
            if (res.data.user.role !== "admin") {
                return alert("Access Denied: This portal is for Recruiters only!");
            }
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/admin-dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Invalid Admin Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-1 sm:p-2 md:p-4 lg:p-1 bg-[#f7f5ff] font-sans">
            <div className="w-full max-w-4xl flex flex-col md:flex-row  shadow-[0px_0px_1px_1px_rgba(26,10,46,0.8)] sm:shadow-[0px_0px_1px_1px_rgba(26,10,46,0.2)] rounded-lg sm:rounded-2xl overflow-hidden">

                {/* ── LEFT: Login Form ── */}
                <div className="flex-1 bg-white p-4 sm:p-6 md:p-8 lg:p-6 flex flex-col justify-between">
                    <div>
                        {/* Brand */}
                        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-6 md:mb-8">
                            <div className="w-7 sm:w-8 h-7 sm:h-8 bg-[#6B21A8] rounded-lg flex items-center justify-center">
                                <Building2 size={14} className="text-white sm:w-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-[#1a0a2e] tracking-tight">Recruiter Portal</span>
                        </div>

                        <h2 className="text-xl text-center sm:text-2xl md:text-3xl font-extrabold text-[#0a0a0a] mb-2">Admin Sign In</h2>
                        <p className="text-sm text-center sm:text-sm text-gray-900 mb-4 sm:mb-6 md:mb-8">Access your recruiter dashboard.</p>

                        <form onSubmit={handleLogin} className="space-y-2 sm:space-y-3 md:space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-[9px] sm:text-[13px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                                    Admin Email
                                </label>
                                <div className="relative">
                                    <Mail size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-4" />
                                    <input
                                        type="email"
                                        placeholder="admin@company.com"
                                        required
                                        className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[9px] sm:text-[13px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={20} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-4" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-9 sm:pr-10 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 -translate-y-1/2 right-3 text-[#9d75c7] hover:text-[#6B21A8]">
                                        {showPassword ? <EyeOff size={12} className="sm:w-4" /> : <Eye size={20} className="sm:w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-[#6B21A8] hover:bg-[#5b1890] text-white font-extrabold py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm tracking-wide transition-all cursor-pointer disabled:opacity-50">
                                {loading ? 'Signing In...' : 'Access Dashboard'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center gap-3 my-5 md:my-6">
                            <div className="flex-1 border-t-2 border-dashed border-[#d8c7f0]"></div>
                            <span className="text-[10px] font-mono text-[#9d75c7] uppercase tracking-widest whitespace-nowrap">Recruiter only</span>
                            <div className="flex-1 border-t-2 border-dashed border-[#d8c7f0]"></div>
                        </div>

                        {/* Security notice */}
                        <div className="bg-[#f8f5ff] border border-[#e2d4f5] rounded-xl p-3 md:p-4">
                            <p className="text-[10px] font-mono text-[#6B21A8] font-bold uppercase tracking-wider mb-1">
                                🔒 Restricted Access
                            </p>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                This portal is exclusively for verified recruiters and HR administrators.
                                Unauthorized access attempts are logged.
                            </p>
                        </div>
                    </div>

                    <p className="mt-6 md:mt-8 text-xs text-gray-500 text-center">
                        Are you a candidate?{' '}
                        <Link to="/user-login" className="text-[#6B21A8] hover:underline font-extrabold">
                            Sign in here
                        </Link>
                    </p>
                </div>

                {/* ── RIGHT: Recruiter Panel ──
                    Hidden on mobile, visible md+ ── */}
                <div className="hidden md:flex flex-1 bg-[#6B21A8] p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
                    {/* Decorative */}
                    <div className="absolute w-56 h-56 rounded-full border-[28px] border-white/10 -top-16 -right-16 pointer-events-none" />
                    <div className="absolute w-36 h-36 rotate-45 border-[18px] border-white/10 bottom-20 -left-10 pointer-events-none" />

                    <div className="relative z-10">
                        <span className="inline-block bg-white/20 border border-white/30 rounded-full px-3 py-1 text-[9px] lg:text-[10px] font-mono text-white uppercase tracking-widest mb-4 lg:mb-6">
                            Recruiter Hub
                        </span>
                        <h3 className="text-lg lg:text-2xl font-extrabold text-white leading-snug mb-2 lg:mb-3">
                            Find your next <span className="text-[#d4b4f7]">great hire</span> today
                        </h3>
                        <p className="text-xs lg:text-sm text-white/70 leading-relaxed mb-6 lg:mb-8">
                            Manage job listings, review applicants, and build your team — all in one place.
                        </p>

                        <div className="space-y-3 lg:space-y-4">
                            {[
                                { icon: <Briefcase size={14} className="lg:w-4" />, title: 'Post & manage jobs',     desc: 'Create listings and track applications in real time.' },
                                { icon: <Users size={14} className="lg:w-4" />,     title: 'Review all applicants',  desc: 'Filter, accept, or reject candidates instantly.' },
                                { icon: <CheckCheck size={14} className="lg:w-4" />, title: 'Track hiring pipeline', desc: 'See every stage from applied to hired at a glance.' },
                            ].map(({ icon, title, desc }) => (
                                <div key={title} className="flex items-start gap-2 lg:gap-3">
                                    <div className="w-8 lg:w-9 h-8 lg:h-9 bg-white/20 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                        {icon}
                                    </div>
                                    <div>
                                        <p className="text-xs lg:text-sm font-extrabold text-white leading-none mb-0.5 lg:mb-1">{title}</p>
                                        <p className="text-[9px] lg:text-[11px] text-white/60 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-3 gap-2 lg:gap-3 mt-6 lg:mt-8">
                        {[
                            { value: '3,500+', label: 'Companies' },
                            { value: '50K+',   label: 'Jobs Posted' },
                            { value: '120K+',  label: 'Hires Made' },
                        ].map(s => (
                            <div key={s.label} className="bg-white/10 border border-white/20 rounded-lg lg:rounded-xl p-2 lg:p-3 text-center">
                                <p className="text-xs lg:text-sm font-extrabold text-white">{s.value}</p>
                                <p className="text-[8px] lg:text-[9px] text-white/60 font-mono uppercase tracking-wider mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── MOBILE BOTTOM STRIP ──
                    Only visible on mobile, replaces the right panel ── */}
                <div className="md:hidden bg-[#6B21A8] px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden">
                    <div className="absolute w-24 sm:w-32 h-24 sm:h-32 rounded-full border-[12px] sm:border-[16px] border-white/10 -top-6 sm:-top-8 -right-6 sm:-right-8 pointer-events-none" />
                    <div className="relative z-10">
                        <p className="text-[8px] sm:text-[10px] font-mono text-white/60 uppercase tracking-widest mb-2 sm:mb-3">Why TalentHub?</p>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                            {[
                                { value: '3,500+', label: 'Companies' },
                                { value: '50K+',   label: 'Jobs' },
                                { value: '120K+',  label: 'Hires' },
                            ].map(s => (
                                <div key={s.label} className="bg-white/10 border border-white/20 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 text-center">
                                    <p className="text-xs sm:text-sm font-extrabold text-white">{s.value}</p>
                                    <p className="text-[8px] sm:text-[9px] text-white/60 font-mono uppercase tracking-wider mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {['Post jobs', 'Review applicants', 'Hire faster'].map(tag => (
                                <span key={tag} className="flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-white/80 bg-white/10 border border-white/20 rounded px-2 sm:px-2.5 py-0.5 sm:py-1">
                                    <CheckCheck size={8} className="sm:w-2.5" /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminLogin;