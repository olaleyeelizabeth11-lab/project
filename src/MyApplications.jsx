import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Briefcase, MapPin, Calendar, ArrowLeft,
    Clock, CheckCheck, XCircle, Search, Filter, X
} from 'lucide-react';

const MyApplications = () => {
    const [myApps, setMyApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

    useEffect(() => {
        if (!user || user.role !== 'user') { navigate('/user-login'); return; }
        const userId = user?.id || user?._id;
        if (!userId) return;

        axios.get(`https://proback-ops7.onrender.com/applications/user/${userId}`)
            .then(res => {
                setMyApps(res.data?.applications || res.data || []);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const STATUS_TABS = ['All', 'Pending', 'Accepted', 'Rejected'];

    const filtered = myApps.filter(app => {
        const matchStatus = filter === 'All' || app.status === filter;
        const q = search.toLowerCase();
        const matchSearch =
            app.job?.title?.toLowerCase().includes(q) ||
            app.job?.company?.toLowerCase().includes(q) ||
            app.job?.location?.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    const statusConfig = (s) => ({
        Pending: { label: 'Pending', icon: <Clock size={11} />, cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        Accepted: { label: 'Accepted', icon: <CheckCheck size={11} />, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        Rejected: { label: 'Rejected', icon: <XCircle size={11} />, cls: 'bg-red-50 text-red-700 border-red-200' },
    }[s] || { label: s, icon: null, cls: 'bg-gray-100 text-gray-600 border-gray-200' });

    const counts = {
        All: myApps.length,
        Pending: myApps.filter(a => a.status === 'Pending').length,
        Accepted: myApps.filter(a => a.status === 'Accepted').length,
        Rejected: myApps.filter(a => a.status === 'Rejected').length,
    };

    return (
        <div className="min-h-screen bg-[#f7f5ff] font-sans">

            {/* ── Top bar ── */}
            <header className="bg-white border-b-2 border-[#1a0a2e] px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/user-dashboard')}
                        className="w-8 h-8 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl flex items-center justify-center hover:border-[#6B21A8] transition-all">
                        <ArrowLeft size={14} className="text-[#6B21A8]" />
                    </button>
                    <div>
                        <h1 className="text-base font-extrabold text-[#0a0a0a]">My Applications</h1>
                        <p className="text-[10px] text-gray-400 font-mono">{myApps.length} total application{myApps.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-2 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl px-3 py-1.5">
                    <div className="w-6 h-6 bg-[#6B21A8] rounded-lg flex items-center justify-center text-white text-[9px] font-extrabold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span className="hidden sm:block text-xs font-extrabold text-[#1a0a2e]">{user?.firstName}</span>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">

                {/* ── Stat strip ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {STATUS_TABS.map(tab => {
                        const cfg = tab === 'All'
                            ? { cls: 'bg-[#f0e8ff] text-[#6B21A8] border-[#c4a0e8]' }
                            : statusConfig(tab);
                        return (
                            <button key={tab} onClick={() => setFilter(tab)}
                                className={`p-3 border-2 rounded-2xl text-left transition-all ${filter === tab
                                        ? 'border-[#6B21A8] bg-[#6B21A8] text-white'
                                        : 'border-[#e2d4f5] bg-white hover:border-[#6B21A8]'
                                    }`}>
                                <p className={`text-xl font-extrabold ${filter === tab ? 'text-white' : 'text-[#0a0a0a]'}`}>
                                    {counts[tab]}
                                </p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${filter === tab ? 'text-white/80' : 'text-gray-500'}`}>
                                    {tab}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* ── Search + filter bar ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by job title, company, location..."
                            className="w-full bg-white border-2 border-[#e2d4f5] rounded-xl py-2.5 pl-9 pr-4 text-xs text-[#1a0a2e] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute top-1/2 -translate-y-1/2 right-3">
                                <X size={12} className="text-gray-400 hover:text-gray-700" />
                            </button>
                        )}
                    </div>

                    {/* Status filter pills — visible on mobile too */}
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        {STATUS_TABS.map(tab => (
                            <button key={tab} onClick={() => setFilter(tab)}
                                className={`px-3 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border-2 transition-all whitespace-nowrap ${filter === tab
                                        ? 'bg-[#6B21A8] text-white border-[#6B21A8]'
                                        : 'bg-white text-[#6B21A8] border-[#e2d4f5] hover:border-[#6B21A8]'
                                    }`}>
                                {tab} ({counts[tab]})
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#6B21A8] border-t-transparent rounded-full animate-spin mb-3" />
                        <p className="text-xs text-gray-400 font-mono">Loading your applications...</p>
                    </div>

                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-[#e2d4f5] rounded-2xl">
                        <div className="w-14 h-14 bg-[#f0e8ff] rounded-2xl flex items-center justify-center mb-4">
                            <Briefcase size={24} className="text-[#c4a0e8]" />
                        </div>
                        <p className="text-sm font-extrabold text-[#1a0a2e] mb-1">
                            {search || filter !== 'All' ? 'No results found' : 'No applications yet'}
                        </p>
                        <p className="text-xs text-gray-400 mb-5">
                            {search || filter !== 'All'
                                ? 'Try adjusting your search or filter'
                                : 'Start applying to jobs and track them here'}
                        </p>
                        {!search && filter === 'All' && (
                            <button onClick={() => navigate('/browse-jobs')}
                                className="bg-[#6B21A8] hover:bg-[#5b1890] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl border border-[#1a0a2e] transition-all">
                                Browse Jobs
                            </button>
                        )}
                    </div>

                ) : (
                    <div className="space-y-3">
                        {filtered.map((app, i) => {
                            const cfg = statusConfig(app.status);
                            return (
                                <div key={app._id}
                                    className="bg-white border-2 border-[#e2d4f5] rounded-2xl p-4 md:p-5 hover:border-[#6B21A8] transition-all group">

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                                        {/* Left: job info */}
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            {/* Job icon */}
                                            <div className="w-10 h-10 bg-[#f0e8ff] rounded-xl flex items-center justify-center text-[#6B21A8] flex-shrink-0 border border-[#e2d4f5] group-hover:bg-[#6B21A8] group-hover:text-white group-hover:border-[#6B21A8] transition-all">
                                                <Briefcase size={16} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="text-sm font-extrabold text-[#0a0a0a] group-hover:text-[#6B21A8] transition-colors truncate">
                                                        {app.job?.title || 'Unknown Position'}
                                                    </h3>
                                                    {app.job?.jobType && (
                                                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#f8f5ff] border border-[#e2d4f5] rounded-lg text-[#6B21A8] uppercase tracking-wide flex-shrink-0">
                                                            {app.job.jobType}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs font-bold text-gray-600 mb-1.5">{app.job?.company}</p>

                                                <div className="flex flex-wrap items-center gap-3">
                                                    {app.job?.location && (
                                                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                            <MapPin size={9} />{app.job.location}
                                                        </span>
                                                    )}
                                                    {app.job?.salary && (
                                                        <span className="text-[10px] font-bold text-emerald-600">
                                                            {app.job.salary}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                        <Calendar size={9} />
                                                        Applied {new Date(app.createdAt).toLocaleDateString('en-GB', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: status badge */}
                                        <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                                            <span className={`flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 rounded-xl border uppercase tracking-wider ${cfg.cls}`}>
                                                {cfg.icon}{cfg.label}
                                            </span>
                                            {app.job?.resumeLink && (
                                                <a href={app.resumeLink} target="_blank" rel="noreferrer"
                                                    className="text-[10px] font-bold text-[#6B21A8] hover:underline">
                                                    View Resume →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer link */}
                <div className="mt-8 text-center">
                    <Link to="/jobs"
                        className="inline-flex items-center gap-2 bg-[#6B21A8] hover:bg-[#5b1890] text-white text-xs font-extrabold px-6 py-3 rounded-xl border border-[#1a0a2e] transition-all">
                        <Briefcase size={13} /> Browse More Jobs
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default MyApplications;