// src/pages/AdminRegister.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, Building2,
  Briefcase, Users, CheckCheck, User
} from 'lucide-react';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", role: "admin"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const navigate                        = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post("https://proback-ops7.onrender.com/user/register", formData);
      navigate("/admin-login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 bg-white font-sans">
      <div className="w-full max-w-4xl flex flex-col md:flex-row border-2 border-[#1a0a2e] rounded-lg sm:rounded-2xl overflow-hidden">

        {/* ── LEFT: Form ── */}
        <div className="flex-1 bg-white p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Brand */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 md:mb-8">
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-[#6B21A8] rounded-lg flex items-center justify-center border border-[#1a0a2e]">
                <Building2 size={14} className="text-white sm:w-4" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-[#1a0a2e] tracking-tight">Recruiter Portal</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0a0a0a] mb-1">Create Recruiter Account</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 md:mb-8">Start posting jobs and finding top talent.</p>

            {error && (
              <div className="mb-4 sm:mb-5 p-2 sm:p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">

              {/* Name row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <label className="block text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-3.5" />
                    <input
                      type="text" placeholder="Jane" required
                      className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <User size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-3.5" />
                    <input
                      type="text" placeholder="Doe" required
                      className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-3.5" />
                  <input
                    type="email" placeholder="recruiter@company.com" required
                    className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] sm:w-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" required
                    className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-lg sm:rounded-xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-9 sm:pr-10 text-xs sm:text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-[#9d75c7] hover:text-[#6B21A8]">
                    {showPassword ? <EyeOff size={12} className="sm:w-3.5" /> : <Eye size={12} className="sm:w-3.5" />}
                  </button>
                </div>
                <p className="mt-1 sm:mt-1.5 text-[8px] sm:text-[10px] font-mono text-[#7a5fa8]">
                  8+ characters, 1 number required
                </p>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full bg-[#6B21A8] hover:bg-[#5b1890] text-white font-extrabold py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm tracking-wide transition-all border border-[#1a0a2e] disabled:opacity-50 mt-1.5 sm:mt-2">
                {loading ? 'Creating Account...' : 'Create Recruiter Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-3 my-3 sm:my-4 md:my-6">
              <div className="flex-1 border-t-2 border-dashed border-[#d8c7f0]"></div>
              <span className="text-[7px] sm:text-[10px] font-mono text-[#9d75c7] uppercase tracking-widest">Recruiter only</span>
              <div className="flex-1 border-t-2 border-dashed border-[#d8c7f0]"></div>
            </div>

            {/* Security notice */}
            <div className="bg-[#f8f5ff] border border-[#e2d4f5] rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <p className="text-[8px] sm:text-[10px] font-mono text-[#6B21A8] font-bold uppercase tracking-wider mb-1">
                🔒 Admin Access Only
              </p>
              <p className="text-[9px] sm:text-[11px] text-gray-500 leading-relaxed">
                Recruiter accounts have full access to post jobs and manage applicants.
                Only register if you are an authorized hiring manager.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 md:mt-8 space-y-1.5 sm:space-y-2 text-center">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Already have a recruiter account?{' '}
              <Link to="/admin-login" className="text-[#6B21A8] hover:underline font-extrabold">
                Sign In
              </Link>
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">
              Are you a candidate?{' '}
              <Link to="/user-register" className="text-[#6B21A8] hover:underline font-extrabold">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT: Recruiter Panel ── */}
        <div className="hidden md:flex flex-1 bg-[#6B21A8] p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute w-56 h-56 rounded-full border-[28px] border-white/10 -top-16 -right-16 pointer-events-none" />
          <div className="absolute w-36 h-36 rotate-45 border-[18px] border-white/10 bottom-20 -left-10 pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block bg-white/20 border border-white/30 rounded-full px-3 py-1 text-[9px] lg:text-[10px] font-mono text-white uppercase tracking-widest mb-4 lg:mb-6">
              Hire smarter
            </span>
            <h3 className="text-lg lg:text-2xl font-extrabold text-white leading-snug mb-2 lg:mb-3">
              Build your <span className="text-[#d4b4f7]">dream team</span> with ease
            </h3>
            <p className="text-xs lg:text-sm text-white/70 leading-relaxed mb-6 lg:mb-8">
              Post jobs, review applicants, and manage your entire hiring pipeline — all from one dashboard.
            </p>

            {/* Feature list */}
            <div className="space-y-3 lg:space-y-4">
              {[
                { icon: <Briefcase size={14} className="lg:w-4" />, title: 'Post unlimited jobs',     desc: 'Create detailed listings and reach thousands of candidates instantly.' },
                { icon: <Users size={14} className="lg:w-4" />,     title: 'Smart applicant tracking', desc: 'Review, filter, and update applicant statuses in one click.' },
                { icon: <CheckCheck size={14} className="lg:w-4" />, title: 'Fast hiring pipeline',   desc: 'Move candidates from applied to hired without leaving your dashboard.' },
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

          {/* Bottom stat strip */}
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

      </div>
    </div>
  );
};

export default AdminRegister;