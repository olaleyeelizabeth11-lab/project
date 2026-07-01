import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase, Users, CheckCircle, Clock,
  Bell, Search, LayoutDashboard, PlusCircle,
  LogOut, TrendingUp, Menu, X, ChevronRight,
  FileText, AlertCircle, CheckCheck, Zap,
  Building2, MapPin, Calendar
} from 'lucide-react';

const NAV = [
  { icon: <LayoutDashboard size={15} />, label: 'Dashboard',    path: '/admin-dashboard' },
  { icon: <Briefcase size={15} />,       label: 'Job Listings', path: '/admin-jobs' },
  { icon: <Users size={15} />,           label: 'Applicants',   path: '/admin-applicants' },
  { icon: <PlusCircle size={15} />,      label: 'Post a Job',   path: '/admin-post-job' },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1, read: false,
    title: 'New Application',
    message: 'Someone applied for Frontend Developer.',
    time: '10 min ago',
    icon: <FileText size={13} />, color: 'text-[#6B21A8]', bg: 'bg-[#f8f5ff] border-[#e2d4f5]'
  },
  {
    id: 2, read: false,
    title: 'Application Milestone',
    message: 'Your Backend Engineer role hit 20 applicants.',
    time: '1 hour ago',
    icon: <Zap size={13} />, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200'
  },
  {
    id: 3, read: true,
    title: 'Job Post Live',
    message: 'UI/UX Designer role is now live.',
    time: 'Yesterday',
    icon: <CheckCheck size={13} />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200'
  },
];

const statusConfig = (s) => ({
  Pending:  { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200',   icon: <Clock size={10} /> },
  Accepted: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle size={10} /> },
  Rejected: { cls: 'bg-red-50 text-red-700 border-red-200',            icon: <X size={10} /> },
}[s] || { cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: null });

export default function AdminDashboard() {
  const [stats, setStats]               = useState({ totalJobsPosted: 0, totalApplicants: 0, totalAccepted: 0, totalPending: 0 });
  const [recentApps, setRecentApps]     = useState([]);
  const [active, setActive]             = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery]   = useState('');

  const notifRef  = useRef(null);
  const navigate  = useNavigate();

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') navigate('/admin-login');
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`https://proback-ops7.onrender.com/user/dashboard/${user.id}`)
      .then(r => {
        setStats(r.data.stats);
        setRecentApps(r.data.recentApplications || []);
      })
      .catch(console.error);
  }, [user?.id]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const unreadCount   = notifications.filter(n => !n.read).length;
  const markAllRead   = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const markRead      = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const handleLogout  = () => { localStorage.removeItem('user'); navigate('/admin-login'); };

  const STAT_CARDS = [
    { icon: <Briefcase size={18} />,   label: 'Jobs Posted',   value: stats.totalJobsPosted,  accent: '#6B21A8', light: '#f0e8ff' },
    { icon: <Users size={18} />,       label: 'Total Applicants', value: stats.totalApplicants, accent: '#0891b2', light: '#e0f2fe' },
    { icon: <CheckCircle size={18} />, label: 'Accepted',      value: stats.totalAccepted,    accent: '#059669', light: '#d1fae5' },
    { icon: <Clock size={18} />,       label: 'Pending Review', value: stats.totalPending,    accent: '#d97706', light: '#fef3c7' },
  ];

  const Sidebar = () => (
    <aside className="w-56 bg-white border-r-1 border-[rgba(26,10,46,0.2)] flex flex-col justify-between py-6 px-3 flex-shrink-0 h-full">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-[#6B21A8] rounded-lg flex items-center justify-center">
            <Building2 size={14} className="text-white" />
          </div>
          <span className="text-sm font-extrabold text-[#1a0a2e] tracking-tight">Recruiter</span>
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {NAV.map(item => {
            const isActive = active === item.label;
            return (
              <button key={item.label}
                onClick={() => { setActive(item.label); navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#6B21A8] text-white'
                    : 'text-[#4a4a6a] hover:bg-[#f0e8ff] hover:text-[#6B21A8]'
                }`}>
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick stats in sidebar */}
        <div className="mt-6 mx-1 space-y-2">
          <p className="text-[9px] font-extrabold text-gray-900 uppercase tracking-widest px-2">Quick Stats</p>
          <div className="p-3 bg-[#f8f5ff] border border-[#e2d4f5] rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-500">Fill rate</span>
              <span className="text-[10px] font-extrabold text-[#6B21A8]">
                {stats.totalApplicants > 0
                  ? Math.round((stats.totalAccepted / stats.totalApplicants) * 100)
                  : 0}%
              </span>
            </div>
            <div className="h-1.5 bg-[#e2d4f5] rounded-full overflow-hidden">
              <div className="h-full bg-[#6B21A8] rounded-full transition-all duration-700"
                style={{ width: `${stats.totalApplicants > 0 ? Math.round((stats.totalAccepted / stats.totalApplicants) * 100) : 0}%` }} />
            </div>
          </div>
        </div>
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
      <div className="hidden md:flex flex-col h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-56 z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="bg-white border-b-1 border-[rgba(26,10,46,0.2)] px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0 gap-3">

          <button onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl flex items-center justify-center">
            <Menu size={15} className="text-[#6B21A8]" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs md:max-w-sm">
            <Search size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search jobs, applicants..."
              className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2 pl-8 pr-3 text-xs text-[#1a0a2e] placeholder-[#9d75c7] focus:outline-none  transition-all" />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-8 h-8 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl flex items-center justify-center hover:border-[#6B21A8] transition-all">
                <Bell size={13} className="text-[#6B21A8]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6B21A8] rounded-full text-[8px] text-white flex items-center justify-center font-extrabold border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute top-full mt-2 right-0 w-72 md:w-80 bg-white border-2 border-[#1a0a2e] rounded-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b-2 border-[#1a0a2e] flex justify-between items-center bg-[#6B21A8]">
                    <div>
                      <h3 className="text-xs font-extrabold text-white">Notifications</h3>
                      {unreadCount > 0 && <p className="text-[9px] text-white/70">{unreadCount} unread</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[9px] font-extrabold text-white/80 hover:text-white uppercase tracking-wide">
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)}>
                        <X size={13} className="text-white/70 hover:text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#f0e8ff]">
                    {notifications.map(n => (
                      <button key={n.id} onClick={() => markRead(n.id)}
                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-[#f8f5ff] transition-colors text-left ${!n.read ? 'bg-[#fdfbff]' : 'bg-white'}`}>
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${n.bg} ${n.color}`}>
                          {n.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] font-extrabold text-[#0a0a0a]">{n.title}</p>
                            {!n.read && <span className="w-1.5 h-1.5 bg-[#6B21A8] rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">{n.message}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={8} className="text-gray-300" />
                            <span className="text-[9px] text-gray-400">{n.time}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#f0e8ff] bg-[#fdfbff]">
                    <button className="text-[10px] font-extrabold text-[#6B21A8] hover:underline w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-2 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl px-2 py-1.5">
              <div className="w-6 h-6 bg-[#6B21A8] rounded-lg flex items-center justify-center text-white text-[9px] font-extrabold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <span className="hidden sm:block text-xs font-extrabold text-[#1a0a2e]">{user.firstName}</span>
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Greeting */}
          <div className="mb-5">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#0a0a0a]">
              Welcome back, {user.firstName}! 👋
            </h1>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {STAT_CARDS.map(card => (
              <div key={card.label}
                className="bg-white border-1 border-[rgba(26,10,46,0.1)] rounded-2xl p-4 flex items-center gap-3 transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#e2d4f5]"
                  style={{ background: card.light, color: card.accent }}>
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xl md:text-2xl font-extrabold text-[#0a0a0a]">{card.value}</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold leading-tight">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Middle row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            {/* Recent Applications */}
            <div className="bg-white border-1 border-[rgba(26,10,46,0.1)] rounded-2xl p-5 md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0a0a0a]">Recent Applications</h3>
                </div>
                <Link to="/admin-applicants"
                  className="text-[10px] font-extrabold text-dark hover:underline flex items-center gap-1">
                  View all <ChevronRight size={11} />
                </Link>
              </div>

              {recentApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-[#e2d4f5] rounded-xl">
                  <Users size={28} className="text-[#e2d4f5] mb-2" />
                  <p className="text-xs text-gray-400 font-mono">No applications yet</p>
                  <button onClick={() => navigate('/admin-post-job')}
                    className="mt-3 text-[11px] font-extrabold text-[#6B21A8] hover:underline">
                    Post a job to get started →
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b-2 border-[#f0e8ff]">
                        {['Candidate', 'Job', 'Company', 'Date', 'Status'].map(h => (
                          <th key={h} className="text-left text-[9px] font-extrabold text-gray-400 uppercase tracking-widest pb-3 pr-4">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f8f5ff]">
                      {recentApps.map(app => {
                        const cfg = statusConfig(app.status);
                        return (
                          <tr key={app._id} className="hover:bg-[#fdfbff] transition-colors group">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-[#f0e8ff] rounded-lg flex items-center justify-center text-[#6B21A8] text-[9px] font-extrabold flex-shrink-0 group-hover:bg-[#6B21A8] group-hover:text-white transition-colors">
                                  {app.applicant?.firstName?.[0]}{app.applicant?.lastName?.[0]}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-extrabold text-[#0a0a0a] truncate">
                                    {app.applicant?.firstName} {app.applicant?.lastName}
                                  </p>
                                  <p className="text-[10px] text-gray-400 truncate">{app.applicant?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <p className="text-xs font-bold text-[#0a0a0a] truncate max-w-[120px]">{app.job?.title}</p>
                            </td>
                            <td className="py-3 pr-4">
                              <p className="text-xs text-gray-500 truncate max-w-[100px]">{app.job?.company}</p>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <Calendar size={9} />
                                {new Date(app.createdAt).toLocaleDateString('en-GB', {
                                  day: 'numeric', month: 'short'
                                })}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`flex items-center gap-1 text-[9px] font-extrabold px-2 py-1 rounded-lg border uppercase tracking-wider w-fit ${cfg.cls}`}>
                                {cfg.icon}{app.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Application breakdown */}
            <div className="bg-white border-1 border-[rgba(26,10,46,0.1)] rounded-2xl p-5">
              <h3 className="text-sm font-extrabold text-[#0a0a0a] mb-4">Application Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Pending',  value: stats.totalPending,   color: '#f59e0b', bg: '#fef3c7' },
                  { label: 'Accepted', value: stats.totalAccepted,  color: '#10b981', bg: '#d1fae5' },
                  { label: 'Rejected', value: stats.totalApplicants - stats.totalAccepted - stats.totalPending, color: '#ef4444', bg: '#fee2e2' },
                ].map(row => {
                  const pct = stats.totalApplicants > 0
                    ? Math.round((row.value / stats.totalApplicants) * 100) : 0;
                  return (
                    <div key={row.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider">{row.label}</span>
                        <span className="text-[10px] font-extrabold text-gray-500">{row.value} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-[#f0e8ff] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: row.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white border-1 border-[rgba(26,10,46,0.1)] rounded-2xl p-5">
              <h3 className="text-sm font-extrabold text-[#0a0a0a] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: <PlusCircle size={14} />, label: 'Post a New Job',       sub: 'Create a new listing',          path: '/admin-post-job',    accent: '#6B21A8', bg: '#f0e8ff' },
                  { icon: <Users size={14} />,      label: 'View All Applicants',  sub: 'Review and update statuses',    path: '/admin-applicants',  accent: '#0891b2', bg: '#e0f2fe' },
                  { icon: <Briefcase size={14} />,  label: 'Manage Job Listings',  sub: 'Edit or remove your jobs',      path: '/admin-jobs',        accent: '#059669', bg: '#d1fae5' },
                ].map(action => (
                  <button key={action.label} onClick={() => navigate(action.path)}
                    className="w-full flex items-center gap-3 p-3 border-2 border-[#e2d4f5] rounded-xl hover:border-[#6B21A8] hover:bg-[#fdfbff] transition-all group text-left">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#e2d4f5] group-hover:border-[#6B21A8] transition-colors"
                      style={{ background: action.bg, color: action.accent }}>
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-[#0a0a0a] group-hover:text-[#6B21A8] transition-colors">{action.label}</p>
                      <p className="text-[10px] text-gray-400">{action.sub}</p>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-[#6B21A8] transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}