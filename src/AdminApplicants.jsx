import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Users, Briefcase, Building2, MapPin, Mail,
    Phone, CheckCircle, XCircle, Clock, X,
    Search, LayoutDashboard, PlusCircle, LogOut,
    ChevronDown, ChevronUp, FileText, Star,
    AlertTriangle, Menu
} from 'lucide-react';

const NAV = [
    { icon: <LayoutDashboard size={15} />, label: 'Dashboard', path: '/admin-dashboard' },
    { icon: <Briefcase size={15} />, label: 'Job Listings', path: '/admin-jobs' },
    { icon: <Users size={15} />, label: 'Applicants', path: '/admin-applicants' },
    { icon: <PlusCircle size={15} />, label: 'Post a Job', path: '/admin-post-job' },
];

const statusConfig = (s) => ({
    Pending: { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock size={11} />, dot: 'bg-yellow-400' },
    Accepted: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle size={11} />, dot: 'bg-emerald-400' },
    Rejected: { cls: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle size={11} />, dot: 'bg-red-400' },
}[s] || { cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: null, dot: 'bg-gray-400' });

export default function AdminApplicants() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedApp, setSelectedApp] = useState(null); // for modal
    const [updating, setUpdating] = useState(false);
    const [toast, setToast] = useState(null);
    const [expandedJobs, setExpandedJobs] = useState({}); // track which job groups are open
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [active, setActive] = useState('Applicants');

    const navigate = useNavigate();
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

    useEffect(() => {
        if (!user || user.role?.toLowerCase() !== 'admin') navigate('/admin-login');
    }, []);

    useEffect(() => {
        if (!user?.id) return;
        fetchApplications();
    }, [user?.id]);

    const fetchApplications = async () => {
        try {
            const res = await axios.get(`https://proback-ops7.onrender.com/applications/admin/${user.id}`);
            setApplications(res.data);
            // Auto-expand all job groups on load
            const groups = {};
            res.data.forEach(app => { groups[app.job?._id] = true; });
            setExpandedJobs(groups);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Group applications by job ──
    const groupByJob = (apps) => {
        const groups = {};
        apps.forEach(app => {
            const jobId = app.job?._id;
            if (!jobId) return;
            if (!groups[jobId]) {
                groups[jobId] = { job: app.job, applications: [] };
            }
            groups[jobId].applications.push(app);
        });
        return Object.values(groups);
    };

    // ── Filter applications ──
    const filteredApps = applications.filter(app => {
        const q = search.toLowerCase();
        const matchSearch =
            app.applicant?.firstName?.toLowerCase().includes(q) ||
            app.applicant?.lastName?.toLowerCase().includes(q) ||
            app.applicant?.email?.toLowerCase().includes(q) ||
            app.job?.title?.toLowerCase().includes(q) ||
            app.job?.company?.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const grouped = groupByJob(filteredApps);

    // ── Update status ──
    const handleStatusUpdate = async (appId, newStatus) => {
        setUpdating(true);
        try {
            await axios.put(`https://proback-ops7.onrender.com/applications/status/${appId}`, { status: newStatus });

            // Update local state
            setApplications(prev =>
                prev.map(a => a._id === appId ? { ...a, status: newStatus } : a)
            );
            if (selectedApp?._id === appId) {
                setSelectedApp(prev => ({ ...prev, status: newStatus }));
            }
            showToast('success', `Application ${newStatus.toLowerCase()} successfully!`);
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Error updating status.');
        } finally {
            setUpdating(false);
        }
    };

    const toggleJob = (jobId) => {
        setExpandedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
    };

    const handleLogout = () => { localStorage.removeItem('user'); navigate('/admin-login'); };

    // Counts
    const counts = {
        All: applications.length,
        Pending: applications.filter(a => a.status === 'Pending').length,
        Accepted: applications.filter(a => a.status === 'Accepted').length,
        Rejected: applications.filter(a => a.status === 'Rejected').length,
    };

    const Sidebar = () => (
        <aside className="w-56 bg-white border-r-2 border-[#1a0a2e] flex flex-col justify-between py-6 px-3 flex-shrink-0 h-full">
            <div>
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="w-8 h-8 bg-[#6B21A8] rounded-lg flex items-center justify-center border border-[#1a0a2e]">
                        <Building2 size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-extrabold text-[#1a0a2e] tracking-tight">Recruiter</span>
                </div>
                <nav className="space-y-1">
                    {NAV.map(item => {
                        const isActive = active === item.label;
                        return (
                            <button key={item.label}
                                onClick={() => { setActive(item.label); navigate(item.path); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-[#6B21A8] text-white' : 'text-[#4a4a6a] hover:bg-[#f0e8ff] hover:text-[#6B21A8]'
                                    }`}>
                                {item.icon}<span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
            <button onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all w-full">
                <LogOut size={14} /> Logout
            </button>
        </aside>
    );

    return (
        <div className="flex h-screen bg-[#f7f5ff] font-sans overflow-hidden">

            {/* Desktop sidebar */}
            <div className="hidden md:flex flex-col h-full"><Sidebar /></div>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-56 z-50"><Sidebar /></div>
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Header */}
                <header className="bg-white border-b-2 border-[#1a0a2e] px-4 md:px-6 py-3 flex items-center justify-between gap-3 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)}
                            className="md:hidden w-8 h-8 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl flex items-center justify-center">
                            <Menu size={14} className="text-[#6B21A8]" />
                        </button>
                        <div>
                            <h1 className="text-base font-extrabold text-[#0a0a0a]">Applicants</h1>
                            <p className="text-[10px] text-gray-400 font-mono">{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative hidden sm:block">
                            <Search size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search applicants, jobs..."
                                className="bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2 pl-8 pr-3 text-xs text-[#1a0a2e] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] w-48 transition-all" />
                        </div>
                        <div className="flex items-center gap-2 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl px-2 py-1.5">
                            <div className="w-6 h-6 bg-[#6B21A8] rounded-lg flex items-center justify-center text-white text-[9px] font-extrabold">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <span className="hidden sm:block text-xs font-extrabold text-[#1a0a2e]">{user?.firstName}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">

                    {/* Mobile search */}
                    <div className="sm:hidden mb-4 relative">
                        <Search size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search applicants, jobs..."
                            className="w-full bg-white border-2 border-[#e2d4f5] rounded-xl py-2.5 pl-8 pr-3 text-xs placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] transition-all" />
                    </div>

                    {/* Stat + filter strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                        {['All', 'Pending', 'Accepted', 'Rejected'].map(tab => {
                            const cfg = tab !== 'All' ? statusConfig(tab) : null;
                            return (
                                <button key={tab} onClick={() => setStatusFilter(tab)}
                                    className={`p-3 border-2 rounded-2xl text-left transition-all ${statusFilter === tab
                                            ? 'border-[#6B21A8] bg-[#6B21A8]'
                                            : 'border-[#e2d4f5] bg-white hover:border-[#6B21A8]'
                                        }`}>
                                    <p className={`text-xl font-extrabold ${statusFilter === tab ? 'text-white' : 'text-[#0a0a0a]'}`}>
                                        {counts[tab]}
                                    </p>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${statusFilter === tab ? 'text-white/80' : 'text-gray-500'}`}>
                                        {tab}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-8 h-8 border-2 border-[#6B21A8] border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-xs text-gray-400 font-mono">Loading applicants...</p>
                        </div>

                    ) : grouped.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-[#e2d4f5] rounded-2xl">
                            <div className="w-14 h-14 bg-[#f0e8ff] rounded-2xl flex items-center justify-center mb-4">
                                <Users size={24} className="text-[#c4a0e8]" />
                            </div>
                            <p className="text-sm font-extrabold text-[#1a0a2e] mb-1">
                                {search || statusFilter !== 'All' ? 'No results found' : 'No applications yet'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {search || statusFilter !== 'All' ? 'Try adjusting your search or filter' : 'Applications will appear here once candidates apply'}
                            </p>
                        </div>

                    ) : (
                        // ── Grouped by Job ──
                        <div className="space-y-4">
                            {grouped.map(group => {
                                const isExpanded = expandedJobs[group.job?._id];
                                const groupCounts = {
                                    Pending: group.applications.filter(a => a.status === 'Pending').length,
                                    Accepted: group.applications.filter(a => a.status === 'Accepted').length,
                                    Rejected: group.applications.filter(a => a.status === 'Rejected').length,
                                };

                                return (
                                    <div key={group.job?._id} className="bg-white border-2 border-[#1a0a2e] rounded-2xl overflow-hidden">

                                        {/* Job group header — clickable to expand/collapse */}
                                        <button
                                            onClick={() => toggleJob(group.job?._id)}
                                            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#fdfbff] transition-colors text-left">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 bg-[#f0e8ff] rounded-xl flex items-center justify-center text-[#6B21A8] border border-[#e2d4f5] flex-shrink-0">
                                                    <Briefcase size={15} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-extrabold text-[#0a0a0a] truncate">{group.job?.title}</p>
                                                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                        <Building2 size={9} />{group.job?.company}
                                                        <span className="mx-1">·</span>
                                                        <MapPin size={9} />{group.job?.location}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                                {/* Mini status counts */}
                                                <div className="hidden sm:flex items-center gap-2">
                                                    {[
                                                        { label: 'Pending', count: groupCounts.Pending, dot: 'bg-yellow-400' },
                                                        { label: 'Accepted', count: groupCounts.Accepted, dot: 'bg-emerald-400' },
                                                        { label: 'Rejected', count: groupCounts.Rejected, dot: 'bg-red-400' },
                                                    ].map(s => s.count > 0 && (
                                                        <span key={s.label} className="flex items-center gap-1 text-[9px] font-extrabold text-gray-500">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                                            {s.count}
                                                        </span>
                                                    ))}
                                                </div>

                                                <span className="text-[10px] font-extrabold text-[#6B21A8] bg-[#f0e8ff] border border-[#c4a0e8] px-2 py-0.5 rounded-lg">
                                                    {group.applications.length} applicant{group.applications.length !== 1 ? 's' : ''}
                                                </span>
                                                {isExpanded
                                                    ? <ChevronUp size={14} className="text-gray-400" />
                                                    : <ChevronDown size={14} className="text-gray-400" />}
                                            </div>
                                        </button>

                                        {/* Applicant rows */}
                                        {isExpanded && (
                                            <div className="border-t-2 border-[#f0e8ff] divide-y divide-[#f8f5ff]">
                                                {group.applications.map(app => {
                                                    const cfg = statusConfig(app.status);
                                                    return (
                                                        <button key={app._id}
                                                            onClick={() => setSelectedApp(app)}
                                                            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#f8f5ff] transition-colors text-left group">

                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                {/* Avatar */}
                                                                <div className="w-8 h-8 bg-[#6B21A8] rounded-xl flex items-center justify-center text-white text-[9px] font-extrabold flex-shrink-0 group-hover:scale-105 transition-transform">
                                                                    {app.applicant?.firstName?.[0]}{app.applicant?.lastName?.[0]}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs font-extrabold text-[#0a0a0a] group-hover:text-[#6B21A8] transition-colors">
                                                                        {app.applicant?.firstName} {app.applicant?.lastName}
                                                                    </p>
                                                                    <p className="text-[10px] text-gray-400 flex items-center gap-1 truncate">
                                                                        <Mail size={9} />{app.applicant?.email}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                                                {/* Applied date */}
                                                                <span className="hidden sm:block text-[9px] text-gray-400 font-mono">
                                                                    {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                                </span>

                                                                {/* Status badge */}
                                                                <span className={`flex items-center gap-1 text-[9px] font-extrabold px-2 py-1 rounded-lg border uppercase tracking-wider ${cfg.cls}`}>
                                                                    {cfg.icon}{app.status}
                                                                </span>

                                                                {/* Skills preview */}
                                                                {app.applicant?.skills?.length > 0 && (
                                                                    <span className="hidden md:flex items-center gap-1 text-[9px] text-[#6B21A8] bg-[#f0e8ff] border border-[#c4a0e8] px-2 py-0.5 rounded-lg font-bold">
                                                                        <Star size={8} />{app.applicant.skills.length} skills
                                                                    </span>
                                                                )}

                                                                <ChevronDown size={12} className="text-gray-300 group-hover:text-[#6B21A8] transition-colors rotate-[-90deg]" />
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* ══════════════════════════════════════
          APPLICANT DETAIL MODAL
      ══════════════════════════════════════ */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={e => e.target === e.currentTarget && setSelectedApp(null)}>
                    <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                        {/* Modal header */}
                        <div className="bg-[#6B21A8] px-6 py-5 relative overflow-hidden">
                            <div className="absolute w-32 h-32 rounded-full border-[20px] border-white/10 -top-10 -right-10 pointer-events-none" />
                            <button onClick={() => setSelectedApp(null)}
                                className="absolute top-4 right-4 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">
                                <X size={13} className="text-white" />
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white text-base font-extrabold border border-white/30 flex-shrink-0">
                                    {selectedApp.applicant?.firstName?.[0]}{selectedApp.applicant?.lastName?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-base font-extrabold text-white">
                                        {selectedApp.applicant?.firstName} {selectedApp.applicant?.lastName}
                                    </h2>
                                    <p className="text-[11px] text-white/70 mt-0.5">
                                        Applied for: {selectedApp.job?.title} — {selectedApp.job?.company}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">

                            {/* Current status */}
                            <div className="flex items-center justify-between p-3 bg-[#f8f5ff] border border-[#e2d4f5] rounded-xl">
                                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Current Status</span>
                                <span className={`flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-lg border uppercase tracking-wider ${statusConfig(selectedApp.status).cls}`}>
                                    {statusConfig(selectedApp.status).icon}
                                    {selectedApp.status}
                                </span>
                            </div>

                            {/* Contact info */}
                            <div>
                                <h4 className="text-[10px] font-extrabold text-[#1a0a2e] uppercase tracking-wider mb-2">Contact Info</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Mail size={12} className="text-[#9d75c7] flex-shrink-0" />
                                        {selectedApp.applicant?.email || 'Not provided'}
                                    </div>
                                    {selectedApp.applicant?.phone && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Phone size={12} className="text-[#9d75c7] flex-shrink-0" />
                                            {selectedApp.applicant.phone}
                                        </div>
                                    )}
                                    {selectedApp.applicant?.location && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <MapPin size={12} className="text-[#9d75c7] flex-shrink-0" />
                                            {selectedApp.applicant.location}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            {selectedApp.applicant?.bio && (
                                <div>
                                    <h4 className="text-[10px] font-extrabold text-[#1a0a2e] uppercase tracking-wider mb-2">About</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed bg-[#f8f5ff] border border-[#e2d4f5] rounded-xl p-3">
                                        {selectedApp.applicant.bio}
                                    </p>
                                </div>
                            )}

                            {/* Skills */}
                            {selectedApp.applicant?.skills?.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-extrabold text-[#1a0a2e] uppercase tracking-wider mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedApp.applicant.skills.map((skill, i) => (
                                            <span key={i} className="text-[10px] font-bold px-2.5 py-1 bg-[#f0e8ff] border border-[#c4a0e8] rounded-lg text-[#6B21A8]">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resume */}
                            {selectedApp.resumeLink && (
                                <div>
                                    <h4 className="text-[10px] font-extrabold text-[#1a0a2e] uppercase tracking-wider mb-2">Resume / CV</h4>
                                    <a href={selectedApp.resumeLink} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 p-3 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl hover:border-[#6B21A8] transition-all group">
                                        <div className="w-8 h-8 bg-[#6B21A8] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText size={14} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-extrabold text-[#6B21A8] group-hover:underline">View Resume</p>
                                            <p className="text-[10px] text-gray-400 truncate max-w-[280px]">{selectedApp.resumeLink}</p>
                                        </div>
                                    </a>
                                </div>
                            )}

                            {/* Applied date */}
                            <p className="text-[10px] text-gray-400 font-mono">
                                Applied on {new Date(selectedApp.createdAt).toLocaleDateString('en-GB', {
                                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </p>

                            {/* ── Status update buttons ── */}
                            <div className="border-t-2 border-[#f0e8ff] pt-5">
                                <p className="text-[10px] font-extrabold text-[#1a0a2e] uppercase tracking-wider mb-3">Update Status</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: 'Pending', icon: <Clock size={13} />, cls: 'border-yellow-200 text-yellow-700 hover:bg-yellow-50', activeCls: 'bg-yellow-500 text-white border-yellow-500' },
                                        { label: 'Accepted', icon: <CheckCircle size={13} />, cls: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50', activeCls: 'bg-emerald-500 text-white border-emerald-500' },
                                        { label: 'Rejected', icon: <XCircle size={13} />, cls: 'border-red-200 text-red-700 hover:bg-red-50', activeCls: 'bg-red-500 text-white border-red-500' },
                                    ].map(btn => {
                                        const isActive = selectedApp.status === btn.label;
                                        return (
                                            <button key={btn.label}
                                                disabled={updating || isActive}
                                                onClick={() => handleStatusUpdate(selectedApp._id, btn.label)}
                                                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-[10px] font-extrabold uppercase tracking-wider transition-all disabled:cursor-not-allowed ${isActive ? btn.activeCls : `bg-white ${btn.cls}`
                                                    }`}>
                                                {updating && isActive
                                                    ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    : btn.icon}
                                                {btn.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button onClick={() => setSelectedApp(null)}
                                className="w-full py-3 rounded-xl border-2 border-[#e2d4f5] text-xs font-extrabold text-gray-500 hover:border-[#6B21A8] hover:text-[#6B21A8] transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border-2 border-[#1a0a2e] rounded-2xl max-w-xs ${toast.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
                    }`}>
                    {toast.type === 'success'
                        ? <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                        : <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />}
                    <p className={`text-xs font-extrabold ${toast.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                        {toast.msg}
                    </p>
                    <button onClick={() => setToast(null)}>
                        <X size={12} className="text-gray-400 hover:text-gray-700" />
                    </button>
                </div>
            )}

        </div>
    );
}