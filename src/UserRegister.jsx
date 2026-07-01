import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Briefcase, Users, Building2 } from 'lucide-react';

const UserRegister = () => {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", password: "", role: "user"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post("https://proback-ops7.onrender.com/user/register", formData);
            alert("Registration successful! Please login.");
            navigate("/user-login");
        } catch (error) {
            setError(error.response?.data?.message || "Check your details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-1 sm:p-4 md:p-1 lg:p-1 bg-white font-sans">
            <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-lg sm:rounded-2xl overflow-hidden shadow-[0px_0px_1px_1px_rgba(26,10,46,0.2)] sm:shadow-[0px_0px_1px_1px_rgba(26,10,46,0.2)]">

                {/* ── LEFT: Form ── */}
                <div className="flex-1 bg-white p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl text-center sm:text-2xl md:text-3xl font-extrabold text-[#0a0a0a] mb-1">Candidate Sign Up</h2>
                        <p className="text-xs sm:text-sm text-gray-800 text-center mb-4 sm:mb-6 md:mb-7">Find your dream job today.</p>

                        {error && (
                            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-mono">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-1 sm:space-y-1">
                            {/* Name row */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex-1">
                                    <label className="block text-[9px] sm:text-[13px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">First Name</label>
                                    <input type="text" placeholder="Jane" required value={formData.firstName}
                                        className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-3 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[9px] sm:text-[13px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">Last Name</label>
                                    <input type="text" placeholder="Doe" required value={formData.lastName}
                                        className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-3 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[9px] sm:text-[13px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-3.5" />
                                    <input type="email" placeholder="name@example.com" required value={formData.email}
                                        className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[9px] sm:text-[13px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-3.5" />
                                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" required value={formData.password}
                                        className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-9 sm:pr-10 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                                        onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 -translate-y-1/2 right-3 text-[#9d75c7] hover:text-[#6B21A8]">
                                        {showPassword ? <EyeOff size={12} className="sm:w-3.5" /> : <Eye size={12} className="sm:w-3.5" />}
                                    </button>
                                </div>
                                <p className="mt-1 sm:mt-1.5 text-[8px] sm:text-[10px] font-mono text-dark">8+ characters, 1 number required</p>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-[#6B21A8] hover:bg-[#5b1890] text-white font-extrabold py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm tracking-wide transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(26,10,46,1)] disabled:opacity-50">
                                {loading ? 'Creating Profile...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="relative flex items-center gap-3 my-3 sm:my-4 md:my-5">
                            <div className="flex-1 border-t-2 border-dashed border-[#d8c7f0]"></div>
                            <span className="text-[7px] sm:text-[10px] font-mono text-[#9d75c7] uppercase tracking-widest whitespace-nowrap">Or sign up with</span>
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

                    <p className="mt-4 sm:mt-6 md:mt-8 text-[10px] sm:text-xs text-gray-900 text-center">
                        Already have an account?{' '}
                        <Link to="/user-login" className="text-[#6B21A8] hover:underline font-extrabold">Sign In</Link>
                    </p>

                    <p className="mt-2 sm:mt-6 md:mt-4 text-[10px] sm:text-xs text-gray-900 text-center">
                        Are you a recruiter?{' '}
                        <Link to="/admin-register" className="text-[#6B21A8] hover:underline font-extrabold">Sign Up Here</Link>
                    </p>
                </div>

                {/* ── RIGHT: Recruitment Panel ── */}
                <div className="hidden md:flex flex-1 bg-[#6B21A8] p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute w-40 lg:w-56 h-40 lg:h-56 rounded-full border-[20px] lg:border-[28px] border-white/10 -top-12 lg:-top-16 -right-12 lg:-right-16 pointer-events-none"></div>
                    <div className="absolute w-32 lg:w-44 h-32 lg:h-44 rounded-full border-[18px] lg:border-[24px] border-white/10 -bottom-8 lg:-bottom-12 -left-8 lg:-left-12 pointer-events-none"></div>

                    <div className="relative z-10">
                        <span className="inline-block bg-white/20 border border-white/30 rounded-full px-3 py-1 text-[9px] lg:text-[10px] font-mono text-white uppercase tracking-widest mb-4 lg:mb-6">
                            #1 Job Portal
                        </span>
                        <h3 className="text-lg lg:text-2xl font-extrabold text-white leading-snug mb-2 lg:mb-3">
                            Land your next <span className="text-[#d4b4f7]">dream role</span> faster
                        </h3>
                        <p className="text-xs lg:text-sm text-white/70 leading-relaxed mb-6 lg:mb-8">
                            Join thousands of candidates matched to top companies every week.
                        </p>

                        <div className="space-y-2 lg:space-y-3">
                            {[
                                { icon: <Briefcase size={14} className="lg:w-4.5" />, stat: '50,000+', label: 'Active job listings' },
                                { icon: <Users size={14} className="lg:w-4.5" />, stat: '120,000+', label: 'Hired candidates' },
                                { icon: <Building2 size={14} className="lg:w-4.5" />, stat: '3,500+', label: 'Partner companies' },
                            ].map(({ icon, stat, label }) => (
                                <div key={label} className="bg-white/10 border border-white/20 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-3 flex items-center gap-2 lg:gap-3">
                                    <div className="w-8 lg:w-9 h-8 lg:h-9 bg-white/20 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                        {icon}
                                    </div>
                                    <div>
                                        <p className="text-xs lg:text-sm font-extrabold text-white leading-none">{stat}</p>
                                        <p className="text-[9px] lg:text-[11px] text-white/60 mt-0.5">{label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-4 lg:mt-6">
                        <p className="text-[8px] lg:text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2 lg:mb-3">Trusted by teams at</p>
                        <div className="flex flex-wrap gap-1.5 lg:gap-2">
                            {['Google', 'Meta', 'Flutterwave', 'Andela', 'Paystack', 'Microsoft'].map(c => (
                                <span key={c} className="bg-white/15 border border-white/25 rounded px-1.5 lg:px-2 py-0.5 lg:py-1 text-[8px] lg:text-[10px] font-bold text-white/85 font-mono">
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserRegister;