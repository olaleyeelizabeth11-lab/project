// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Briefcase, Users, Building2, ArrowRight, CheckCircle,
    Search, MapPin, Zap, Shield, TrendingUp, Star,
    ChevronRight, Menu, X, Globe, Clock, Award
} from 'lucide-react';

const useCounter = (end, duration = 2000, started = false) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!started) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, duration, started]);
    return count;
};

const FEATURES_CANDIDATE = [
    { icon: <Search size={20} />, title: 'Smart Job Matching', desc: 'AI-powered recommendations based on your skills, experience, and location preferences.' },
    { icon: <Zap size={20} />, title: 'One-Click Apply', desc: 'Upload your resume once and apply to multiple roles in seconds with your saved profile.' },
    { icon: <TrendingUp size={20} />, title: 'Track Applications', desc: 'Real-time status updates as your application moves through the hiring pipeline.' },
    { icon: <Shield size={20} />, title: 'Profile Visibility', desc: 'Let top companies discover you before you even apply. Get headhunted by recruiters.' },
];

const FEATURES_RECRUITER = [
    { icon: <Building2 size={20} />, title: 'Post Jobs Instantly', desc: 'Create detailed listings and reach thousands of qualified candidates within minutes.' },
    { icon: <Users size={20} />, title: 'Applicant Dashboard', desc: 'Review, filter, and manage all candidates across all your listings in one place.' },
    { icon: <CheckCircle size={20} />, title: 'Status Management', desc: 'Accept, reject, or mark candidates as under review with a single click.' },
    { icon: <Award size={20} />, title: 'Hire Faster', desc: 'Cut your average time-to-hire by 60% with our streamlined recruitment workflow.' },
];

const HOW_IT_WORKS_CANDIDATE = [
    { step: '01', title: 'Create Profile', desc: 'Sign up and build your professional profile with skills, experience, and resume.' },
    { step: '02', title: 'Browse & Apply', desc: 'Search thousands of roles filtered by location, type, and salary range.' },
    { step: '03', title: 'Get Hired', desc: 'Track your applications and get notified when recruiters respond.' },
];

const HOW_IT_WORKS_RECRUITER = [
    { step: '01', title: 'Create Account', desc: 'Register your recruiter account and set up your company profile.' },
    { step: '02', title: 'Post a Job', desc: 'Write your listing, set requirements, and publish to our candidate network.' },
    { step: '03', title: 'Hire Top Talent', desc: 'Review applications, update statuses, and build your dream team.' },
];

const TESTIMONIALS = [
    { name: 'Adeola Okafor', role: 'Software Engineer', company: 'Paystack', text: 'I landed my dream role within 2 weeks. The job matching is incredibly accurate and the application tracking kept me sane through the process.', initials: 'AO', color: 'bg-[#6B21A8]' },
    { name: 'Emeka Nwachukwu', role: 'Product Manager', company: 'Flutterwave', text: 'TalentHub made our hiring process 3× faster. The applicant dashboard gives us everything we need to make quick, confident decisions.', initials: 'EN', color: 'bg-emerald-600' },
    { name: 'Amina Bello', role: 'UX Designer', company: 'Andela', text: 'As a designer, I appreciated how polished the platform is. Found 3 great opportunities and got hired — all within a month.', initials: 'AB', color: 'bg-blue-600' },
    { name: 'Tunde Fashola', role: 'Head of Engineering', company: 'Konga', text: 'We\'ve hired 12 engineers through TalentHub this year alone. The quality of candidates is consistently high.', initials: 'TF', color: 'bg-orange-600' },
];

const COMPANIES = ['Paystack', 'Flutterwave', 'Andela', 'Konga', 'Interswitch', 'Cowrywise', 'PiggyVest', 'Mono'];

const JOB_CATEGORIES = [
    { icon: '💻', label: 'Engineering', count: '2,840' },
    { icon: '🎨', label: 'Design', count: '1,230' },
    { icon: '📊', label: 'Product', count: '980' },
    { icon: '📣', label: 'Marketing', count: '1,450' },
    { icon: '💰', label: 'Finance', count: '760' },
    { icon: '🤝', label: 'Sales', count: '1,100' },
    { icon: '⚙️', label: 'Operations', count: '640' },
    { icon: '🔒', label: 'Cybersecurity', count: '420' },
];

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('candidate');
    const [statsStarted, setStatsStarted] = useState(false);
    const statsRef = useRef(null);
    const navigate = useNavigate();

    const jobsCount = useCounter(50000, 2000, statsStarted);
    const companiesCount = useCounter(3500, 2000, statsStarted);
    const hiredCount = useCounter(120000, 2500, statsStarted);
    const successRate = useCounter(94, 1500, statsStarted);

    // Trigger counter when stats section scrolls into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
            { threshold: 0.3 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-[#1a0a2e]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#6B21A8] rounded-lg flex items-center justify-center border border-[#1a0a2e]">
                            <Briefcase size={15} className="text-white" />
                        </div>
                        <span className="text-base font-extrabold text-[#1a0a2e] tracking-tight">TalentHub</span>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {[
                            { label: 'Features', href: '#features' },
                            { label: 'How it works', href: '#how-it-works' },
                            { label: 'Companies', href: '#companies' },
                            { label: 'Testimonials', href: '#testimonials' },
                        ].map(item => (
                            <a key={item.label} href={item.href}
                                className="text-xs font-bold text-[#4a4a6a] hover:text-[#6B21A8] transition-colors uppercase tracking-wider">
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/user-login"
                            className="px-4 py-2 text-xs font-extrabold text-[#6B21A8] border-2 border-[#e2d4f5] rounded-xl hover:border-[#6B21A8] transition-all">
                            Sign In
                        </Link>
                        <Link to="/user-register"
                            className="px-4 py-2 text-xs font-extrabold text-white bg-[#6B21A8] border-2 border-[#6B21A8] rounded-xl hover:bg-[#5b1890] transition-all">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-8 h-8 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl flex items-center justify-center">
                        {mobileMenuOpen ? <X size={14} className="text-[#6B21A8]" /> : <Menu size={14} className="text-[#6B21A8]" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t-2 border-[#f0e8ff] px-4 py-4 space-y-3">
                        {['Features', 'How it works', 'Companies', 'Testimonials'].map(item => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-xs font-bold text-[#4a4a6a] py-2 uppercase tracking-wider">
                                {item}
                            </a>
                        ))}
                        <div className="flex gap-2 pt-2">
                            <Link to="/user-login" className="flex-1 text-center py-2.5 text-xs font-extrabold text-[#6B21A8] border-2 border-[#e2d4f5] rounded-xl">
                                Sign In
                            </Link>
                            <Link to="/user-register" className="flex-1 text-center py-2.5 text-xs font-extrabold text-white bg-[#6B21A8] rounded-xl">
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
            <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#f0e8ff] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f8f5ff] rounded-full translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#f0e8ff] border border-[#c4a0e8] rounded-full px-4 py-1.5 mb-6">
                            <span className="w-1.5 h-1.5 bg-[#6B21A8] rounded-full animate-pulse" />
                            <span className="text-[11px] font-extrabold text-[#6B21A8] uppercase tracking-widest">
                                50,000+ Active Job Listings
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-[#0a0a0a] leading-tight mb-6">
                            Find Your Next
                            <span className="relative inline-block mx-3">
                                <span className="text-[#6B21A8]">Dream Role</span>
                                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6">
                                    <path d="M0 5 Q50 0 100 5 Q150 0 200 5" stroke="#c4a0e8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                            <br />or Hire Top Talent
                        </h1>

                        <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
                            TalentHub connects ambitious candidates with Nigeria's fastest-growing companies.
                            Whether you're searching for your next opportunity or building your dream team — we've got you covered.
                        </p>

                        {/* Dual CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
                            <Link to="/user-register"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#6B21A8] hover:bg-[#5b1890] text-white font-extrabold px-8 py-4 rounded-2xl border-2 border-[#1a0a2e] text-sm transition-all hover:-translate-y-0.5">
                                <Briefcase size={16} /> Find a Job
                                <ArrowRight size={14} />
                            </Link>
                            <Link to="/admin-register"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-[#f8f5ff] text-[#6B21A8] font-extrabold px-8 py-4 rounded-2xl border-2 border-[#6B21A8] text-sm transition-all hover:-translate-y-0.5">
                                <Building2 size={16} /> Post a Job
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Quick search bar */}
                        <div className="max-w-2xl mx-auto bg-white border-2 border-[#1a0a2e] rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                                <input placeholder="Job title, skill, or keyword..."
                                    className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 pl-9 pr-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] transition-all" />
                            </div>
                            <div className="relative sm:w-44">
                                <MapPin size={14} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                                <input placeholder="Location..."
                                    className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 pl-9 pr-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] transition-all" />
                            </div>
                            <button onClick={() => navigate('/user-register')}
                                className="bg-[#6B21A8] hover:bg-[#5b1890] text-white font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all border border-[#1a0a2e]">
                                Search
                            </button>
                        </div>

                        <p className="text-[11px] text-gray-400 mt-3 font-mono">
                            Popular: <span className="text-[#6B21A8] font-bold cursor-pointer hover:underline">Frontend Developer</span> · <span className="text-[#6B21A8] font-bold cursor-pointer hover:underline">Product Manager</span> · <span className="text-[#6B21A8] font-bold cursor-pointer hover:underline">UI/UX Designer</span> · <span className="text-[#6B21A8] font-bold cursor-pointer hover:underline">Data Analyst</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          COMPANY LOGOS STRIP
      ══════════════════════════════════════ */}
            <section id="companies" className="py-10 bg-[#f8f5ff] border-y-2 border-[#e2d4f5]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <p className="text-center text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-6">
                        Trusted by teams at
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                        {COMPANIES.map(c => (
                            <div key={c}
                                className="px-4 py-2 bg-white border-2 border-[#e2d4f5] rounded-xl text-xs font-extrabold text-[#4a4a6a] hover:border-[#6B21A8] hover:text-[#6B21A8] transition-all cursor-default">
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
            <section ref={statsRef} className="py-16 bg-[#6B21A8] relative overflow-hidden">
                <div className="absolute w-96 h-96 rounded-full border-[40px] border-white/5 -top-24 -right-24 pointer-events-none" />
                <div className="absolute w-64 h-64 rounded-full border-[30px] border-white/5 -bottom-16 -left-16 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { value: jobsCount, suffix: '+', label: 'Active Jobs', sub: 'Updated daily' },
                            { value: companiesCount, suffix: '+', label: 'Partner Companies', sub: 'Across all industries' },
                            { value: hiredCount, suffix: '+', label: 'Candidates Hired', sub: 'And counting' },
                            { value: successRate, suffix: '%', label: 'Success Rate', sub: 'Placement within 30 days' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                                    {stat.value.toLocaleString()}{stat.suffix}
                                </p>
                                <p className="text-sm font-extrabold text-white/80 mb-0.5">{stat.label}</p>
                                <p className="text-[10px] text-white/50 font-mono">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          JOB CATEGORIES
      ══════════════════════════════════════ */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a0a0a] mb-2">Browse by Category</h2>
                        <p className="text-sm text-gray-500">Explore opportunities across every industry</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {JOB_CATEGORIES.map(cat => (
                            <button key={cat.label}
                                onClick={() => navigate('/user-register')}
                                className="p-4 bg-white border-2 border-[#e2d4f5] rounded-2xl hover:border-[#6B21A8] hover:bg-[#fdfbff] transition-all group text-left">
                                <span className="text-2xl mb-2 block">{cat.icon}</span>
                                <p className="text-xs font-extrabold text-[#0a0a0a] group-hover:text-[#6B21A8] transition-colors">{cat.label}</p>
                                <p className="text-[10px] text-gray-700 font-mono mt-0.5">{cat.count} jobs</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
            <section id="features" className="py-16 bg-[#f8f5ff]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a0a0a] mb-2">
                            Everything you need to{' '}
                            <span className="text-[#6B21A8]">succeed</span>
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">Powerful tools for both candidates and recruiters</p>

                        {/* Tab switcher */}
                        <div className="inline-flex bg-white border-2 border-[#1a0a2e] rounded-2xl p-1 gap-1">
                            {['candidate', 'recruiter'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${activeTab === tab
                                            ? 'bg-[#6B21A8] text-white'
                                            : 'text-[#4a4a6a] hover:text-[#6B21A8]'
                                        }`}>
                                    {tab === 'candidate' ? ' Candidates' : ' Recruiters'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(activeTab === 'candidate' ? FEATURES_CANDIDATE : FEATURES_RECRUITER).map((f, i) => (
                            <div key={i}
                                className="bg-white border-2 border-[#e2d4f5] rounded-2xl p-5 hover:border-[#6B21A8] transition-all group">
                                <div className="w-10 h-10 bg-[#f0e8ff] rounded-xl flex items-center justify-center text-[#6B21A8] mb-4 border border-[#e2d4f5] group-hover:bg-[#6B21A8] group-hover:text-white group-hover:border-[#6B21A8] transition-all">
                                    {f.icon}
                                </div>
                                <h3 className="text-sm font-extrabold text-[#0a0a0a] mb-2 group-hover:text-[#6B21A8] transition-colors">
                                    {f.title}
                                </h3>
                                <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
            <section id="how-it-works" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a0a0a] mb-2">How TalentHub Works</h2>
                        <p className="text-sm text-gray-500 mb-6">Get started in minutes — no complicated setup</p>

                        {/* Tab switcher */}
                        <div className="inline-flex bg-[#f8f5ff] border-2 border-[#1a0a2e] rounded-2xl p-1 gap-1">
                            {['candidate', 'recruiter'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${activeTab === tab
                                            ? 'bg-[#6B21A8] text-white'
                                            : 'text-[#4a4a6a] hover:text-[#6B21A8]'
                                        }`}>
                                    {tab === 'candidate' ? ' Candidates' : ' Recruiters'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-[#e2d4f5] z-0" />

                        {(activeTab === 'candidate' ? HOW_IT_WORKS_CANDIDATE : HOW_IT_WORKS_RECRUITER).map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#6B21A8] rounded-2xl flex items-center justify-center border-2 border-[#1a0a2e] mb-5 relative">
                                    <span className="text-xl font-extrabold text-white">{step.step}</span>
                                    {i < 2 && (
                                        <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-[#e2d4f5] rounded-full items-center justify-center z-20">
                                            <ChevronRight size={12} className="text-[#6B21A8]" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-sm font-extrabold text-[#0a0a0a] mb-2">{step.title}</h3>
                                <p className="text-[11px] text-gray-500 leading-relaxed max-w-xs">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to={activeTab === 'candidate' ? '/user-register' : '/admin-register'}
                            className="inline-flex items-center gap-2 bg-[#6B21A8] hover:bg-[#5b1890] text-white font-extrabold px-8 py-3.5 rounded-2xl border-2 border-[#1a0a2e] text-sm transition-all">
                            {activeTab === 'candidate' ? 'Start Job Hunting' : 'Start Hiring'}
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
            <section id="testimonials" className="py-16 bg-[#f8f5ff]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a0a0a] mb-2">
                            Loved by candidates <span className="text-[#6B21A8]">&</span> recruiters
                        </h2>
                        <p className="text-sm text-gray-500">Real stories from real people</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="bg-white border-2 border-[#e2d4f5] rounded-2xl p-6 hover:border-[#6B21A8] transition-all">
                                {/* Stars */}
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${t.color} rounded-xl flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0`}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <p className="text-xs font-extrabold text-[#0a0a0a]">{t.name}</p>
                                        <p className="text-[10px] text-gray-400">{t.role} · {t.company}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
            <section className="py-20 bg-[#6B21A8] relative overflow-hidden">
                <div className="absolute w-80 h-80 rounded-full border-[40px] border-white/10 -top-20 -right-20 pointer-events-none" />
                <div className="absolute w-56 h-56 rotate-45 border-[30px] border-white/10 -bottom-16 -left-16 pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                    <span className="inline-block bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-[10px] font-extrabold text-white uppercase tracking-widest mb-6">
                        Join 120,000+ professionals
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                        Your next chapter<br />starts here
                    </h2>
                    <p className="text-sm text-white/70 leading-relaxed mb-10 max-w-xl mx-auto">
                        Whether you're taking the next step in your career or building a world-class team —
                        TalentHub is the platform that makes it happen.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/user-register"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-[#f8f5ff] text-[#6B21A8] font-extrabold px-8 py-4 rounded-2xl border-2 border-white text-sm transition-all hover:-translate-y-0.5">
                            <Briefcase size={16} /> I'm Looking for a Job
                        </Link>
                        <Link to="/admin-register"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-extrabold px-8 py-4 rounded-2xl border-2 border-white/50 text-sm transition-all hover:-translate-y-0.5">
                            <Building2 size={16} /> I'm Hiring Talent
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
            <footer className="bg-[#0a0a0a] text-white py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-[#6B21A8] rounded-lg flex items-center justify-center">
                                    <Briefcase size={14} className="text-white" />
                                </div>
                                <span className="text-sm font-extrabold tracking-tight">TalentHub</span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                                Connecting ambitious candidates with Nigeria's fastest-growing companies.
                            </p>
                            <div className="flex items-center gap-2">
                                <Globe size={12} className="text-gray-500" />
                                <span className="text-[10px] text-gray-500 font-mono">Lagos, Nigeria</span>
                            </div>
                        </div>

                        {/* For Candidates */}
                        <div>
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-4">Candidates</h4>
                            <div className="space-y-2.5">
                                {['Browse Jobs', 'Create Profile', 'My Applications', 'Career Tips'].map(item => (
                                    <Link key={item} to="/user-register"
                                        className="block text-[11px] text-gray-500 hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* For Recruiters */}
                        <div>
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-4">Recruiters</h4>
                            <div className="space-y-2.5">
                                {['Post a Job', 'Manage Listings', 'View Applicants', 'Recruiter Login'].map(item => (
                                    <Link key={item} to="/admin-register"
                                        className="block text-[11px] text-gray-500 hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-4">Company</h4>
                            <div className="space-y-2.5">
                                {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'].map(item => (
                                    <a key={item} href="#"
                                        className="block text-[11px] text-gray-500 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-[10px] text-gray-600 font-mono">
                            © 2026 TalentHub. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link to="/user-login"
                                className="text-[10px] text-gray-500 hover:text-white transition-colors font-mono">
                                Candidate Login
                            </Link>
                            <Link to="/admin-login"
                                className="text-[10px] text-gray-500 hover:text-white transition-colors font-mono">
                                Recruiter Login
                            </Link>
                            <Link to="/user-register"
                                className="text-[10px] font-extrabold text-white bg-[#6B21A8] px-3 py-1.5 rounded-lg">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}