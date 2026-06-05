import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Star, Trophy, Zap } from 'lucide-react';

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("https://proback-ops7.onrender.com/user/login", { email, password });
            if (res.data.user.role !== "user") {
                return alert("This login is for Candidates only!");
            }
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/user-dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 bg-white font-sans">
            <div className="w-full max-w-4xl flex flex-col md:flex-row border-2 border-[#1a0a2e] rounded-lg sm:rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(26,10,46,0.8)] sm:shadow-[2px_2px_0px_0px_rgba(26,10,46,1)]">

                {/* ── LEFT: Login Form ── */}
                <div className="flex-1 bg-white p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0a0a0a] mb-1">Welcome Back</h2>
                        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 md:mb-8">Sign in to continue your job search.</p>

                        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4 md:space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-3.5" />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-1.5">
                                    <label className="block text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold">
                                        Password
                                    </label>
                                    <Link to="/forgot-password" className="text-[8px] sm:text-[10px] font-mono text-[#6B21A8] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-3.5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-9 sm:pr-10 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 -translate-y-1/2 right-3 text-[#9d75c7] hover:text-[#6B21A8]"
                                    >
                                        {showPassword ? <EyeOff size={12} className="sm:w-3.5" /> : <Eye size={12} className="sm:w-3.5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#6B21A8] hover:bg-[#5b1890] text-white font-extrabold py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-[2px_2px_0px_0px_rgba(26,10,46,0.8)] sm:shadow-[3px_3px_0px_0px_rgba(26,10,46,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(26,10,46,1)] disabled:opacity-50"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="relative flex items-center gap-3 my-3 sm:my-4 md:my-5">
                            <div className="flex-1 border-t-2 border-dashed border-[#d8c7f0]"></div>
                            <span className="text-[7px] sm:text-[10px] font-mono text-[#9d75c7] uppercase tracking-widest whitespace-nowrap">Or continue with</span>
                            <div className="flex-1 border-t-2 border-dashed border-[#d8c7f0]"></div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {['Google', 'Github', 'LinkedIn'].map(p => (
                                <button key={p} className="bg-white border-2 border-[#d8c7f0] rounded-lg sm:rounded-xl py-1.5 sm:py-2 font-mono font-bold text-[9px] sm:text-xs text-[#1a0a2e] hover:border-[#6B21A8] transition-colors shadow-[1px_1px_0px_rgba(107,33,168,.1)] sm:shadow-[2px_2px_0px_rgba(107,33,168,.15)]">
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="mt-4 sm:mt-6 md:mt-8 text-[10px] sm:text-xs text-gray-500 text-center">
                        Don't have an account?{' '}
                        <Link to="/user-register" className="text-[#6B21A8] hover:underline font-extrabold">
                            Sign Up
                        </Link>
                    </p>
                </div>

                {/* ── RIGHT: Welcome Back Panel ── */}
                <div className="hidden md:flex flex-1 bg-[#6B21A8] p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
                    {/* Decorative shapes — different from signup: diamond + ring */}
                    <div className="absolute w-48 lg:w-64 h-48 lg:h-64 rounded-full border-[24px] lg:border-[32px] border-white/10 -bottom-16 lg:-bottom-20 -right-16 lg:-right-20 pointer-events-none"></div>
                    <div className="absolute w-24 lg:w-32 h-24 lg:h-32 rotate-45 border-[16px] lg:border-[20px] border-white/10 top-6 lg:top-10 -right-8 lg:-right-10 pointer-events-none"></div>
                    <div className="absolute w-16 lg:w-20 h-16 lg:h-20 rotate-45 border-[11px] lg:border-[14px] border-white/10 top-24 lg:top-32 right-12 lg:right-16 pointer-events-none"></div>

                    <div className="relative z-10">
                        <span className="inline-block bg-white/20 border border-white/30 rounded-full px-3 py-1 text-[9px] lg:text-[10px] font-mono text-white uppercase tracking-widest mb-4 lg:mb-6">
                            Your Career Hub
                        </span>

                        <h3 className="text-lg lg:text-2xl font-extrabold text-white leading-snug mb-2 lg:mb-3">
                            Your next opportunity <span className="text-[#d4b4f7]">is waiting</span> for you
                        </h3>
                        <p className="text-xs lg:text-sm text-white/70 leading-relaxed mb-6 lg:mb-8">
                            Hundreds of new roles are posted daily. Pick up where you left off.
                        </p>

                        {/* Feature highlights — different from signup stats */}
                        <div className="space-y-3 lg:space-y-4">
                            {[
                                {
                                    icon: <Zap size={14} className="lg:w-4.5" />,
                                    title: 'Instant job alerts',
                                    desc: 'Get notified the moment a role matches your profile.'
                                },
                                {
                                    icon: <Star size={14} className="lg:w-4.5" />,
                                    title: 'AI-matched listings',
                                    desc: 'Smart recommendations based on your skills and history.'
                                },
                                {
                                    icon: <Trophy size={14} className="lg:w-4.5" />,
                                    title: 'Track applications',
                                    desc: 'See every application status in one clean dashboard.'
                                },
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

                    {/* Testimonial at the bottom */}
                    <div className="relative z-10 mt-4 lg:mt-6 bg-white/10 border border-white/20 rounded-lg lg:rounded-xl p-2.5 lg:p-4">
                        <p className="text-[9px] lg:text-xs text-white/80 leading-relaxed italic mb-2 lg:mb-3">
                            "I landed a senior role at Paystack within 2 weeks of signing up. The job matching is incredibly accurate."
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-6 lg:w-7 h-6 lg:h-7 rounded-full bg-[#d4b4f7] flex items-center justify-center text-[#6B21A8] font-extrabold text-[8px] lg:text-[10px]">
                                AO
                            </div>
                            <div>
                                <p className="text-[9px] lg:text-[11px] font-bold text-white">Adeola Okafor</p>
                                <p className="text-[8px] lg:text-[10px] text-white/50">Software Engineer, Lagos</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserLogin;