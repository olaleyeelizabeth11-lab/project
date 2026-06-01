import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase, CheckCircle, Circle, ChevronRight,
  Bell, Search, LayoutDashboard, BookMarked,
  LogOut, User, TrendingUp, Zap, MapPin, X,
  Clock, CheckCheck, AlertCircle, Menu
} from 'lucide-react';

const NAV = [
  { icon: <LayoutDashboard size={15} />, label: 'Dashboard',      path: '/user-dashboard' },
  { icon: <Briefcase size={15} />,       label: 'Browse Jobs',     path: '/jobs' },
  { icon: <BookMarked size={15} />,      label: 'My Applications', path: '/my-applications' },
  { icon: <User size={15} />,            label: 'My Profile',      path: null },
];

const PROFILE_STEPS = [
  { key: 'firstName',  label: 'First name' },
  { key: 'lastName',   label: 'Last name' },
  { key: 'email',      label: 'Email address' },
  { key: 'bio',        label: 'Bio / About you' },
  { key: 'phone',      label: 'Phone number' },
  { key: 'location',   label: 'Location' },
  { key: 'resumeUrl',  label: 'Resume uploaded' },
  { key: 'photoUrl',   label: 'Profile photo' },
  { key: 'skills',     label: 'Skills added' },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1, type: 'status', read: false,
    title: 'Application Update',
    message: 'Your application at Paystack moved to Under Review.',
    time: '2 hours ago',
    icon: <AlertCircle size={13} />, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200'
  },
  {
    id: 2, type: 'match', read: false,
    title: 'New Job Match',
    message: '3 new jobs match your profile in Lagos.',
    time: '5 hours ago',
    icon: <Zap size={13} />, color: 'text-[#6B21A8]', bg: 'bg-[#f8f5ff] border-[#e2d4f5]'
  },
  {
    id: 3, type: 'accepted', read: true,
    title: 'Congratulations!',
    message: 'Your application at Flutterwave was Accepted.',
    time: 'Yesterday',
    icon: <CheckCheck size={13} />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200'
  },
  {
    id: 4, type: 'reminder', read: true,
    title: 'Complete Your Profile',
    message: "You're 33% done. Complete it to get more matches.",
    time: '2 days ago',
    icon: <User size={13} />, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200'
  },
];

export default function UserDashboard() {
  const [stats, setStats]               = useState({ appliedJobs: 0 });
  const [profile, setProfile]           = useState(null);
  const [jobs, setJobs]                 = useState([]);
  const [applications, setApplications] = useState([]);
  const [active, setActive]             = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen]     = useState(false);

  const notifRef  = useRef(null);
  const searchRef = useRef(null);
  const navigate  = useNavigate();

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'user') navigate('/user-login');
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`https://proback-ops7.onrender.com/user/dashboard/${user.id}`).then(r => setStats(r.data.stats)).catch(console.error);
    axios.get(`https://proback-ops7.onrender.com/user/profile/${user.id}`).then(r => setProfile(r.data)).catch(console.error);
    axios.get('https://proback-ops7.onrender.com/jobs/all').then(r => setJobs(r.data)).catch(console.error);
    axios.get(`https://proback-ops7.onrender.com/applications/user/${user.id}`).then(r => setApplications(r.data.slice(0, 4))).catch(console.error);
  }, [user?.id]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    const q = searchQuery.toLowerCase();
    const filtered = jobs.filter(j =>
      j.title?.toLowerCase().includes(q) ||
      j.company?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.jobType?.toLowerCase().includes(q)
    );
    setSearchResults(filtered.slice(0, 6));
    setSearchOpen(true);
  }, [searchQuery, jobs]);

  if (!user) return null;

  const steps = PROFILE_STEPS.map(s => ({
    ...s,
    done: s.key === 'skills' ? profile?.skills?.length > 0 : Boolean(profile?.[s.key])
  }));
  const pct      = profile ? Math.round(steps.filter(s => s.done).length / steps.length * 100) : 0;
  const barColor = pct < 40 ? '#ef4444' : pct < 70 ? '#f59e0b' : '#10b981';
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const markRead    = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const handleLogout = () => { localStorage.removeItem('user'); navigate('/user-login'); };

  const statusBadge = (s) => ({
    Pending:  'bg-yellow-100 text-yellow-800 border border-yellow-300',
    Accepted: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    Rejected: 'bg-red-100 text-red-800 border border-red-300',
  }[s] || 'bg-gray-100 text-gray-700 border border-gray-200');

  const Sidebar = () => (
    <aside className="w-56 bg-white border-r-2 border-[#1a0a2e] flex flex-col justify-between py-6 px-3 flex-shrink-0 h-full">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-[#6B21A8] rounded-lg flex items-center justify-center border border-[#1a0a2e]">
            <Briefcase size={14} className="text-white" />
          </div>
          <span className="text-sm font-extrabold text-[#1a0a2e] tracking-tight">TalentHub</span>
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {NAV.map(item => {
            const dest     = item.label === 'My Profile' ? `/user-profile/${user.id}` : item.path;
            const isActive = active === item.label;
            return (
              <button key={item.label}
                onClick={() => { setActive(item.label); if (dest) navigate(dest); setSidebarOpen(false); }}
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

        {/* Profile mini bar */}
        {profile && (
          <div className="mt-6 mx-1 p-3 bg-[#f8f5ff] border border-[#e2d4f5] rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-extrabold text-[#6B21A8] uppercase tracking-widest">Profile</span>
              <span className="text-[10px] font-extrabold" style={{ color: barColor }}>{pct}%</span>
            </div>
            <div className="h-1.5 bg-[#e2d4f5] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: barColor }} />
            </div>
          </div>
        )}
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
        <header className="bg-white border-b-2 border-[#1a0a2e] px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0 gap-3">

          {/* Mobile hamburger */}
          <button onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl flex items-center justify-center flex-shrink-0">
            <Menu size={15} className="text-[#6B21A8]" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs md:max-w-sm" ref={searchRef}>
            <Search size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7] z-10" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
              placeholder="Search jobs, companies..."
              className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2 pl-8 pr-3 text-xs text-[#1a0a2e] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] transition-all"
            />

            {/* Search dropdown */}
            {searchOpen && (
              <div className="absolute top-full mt-2 left-0 w-80 md:w-96 bg-white border-2 border-[#1a0a2e] rounded-2xl z-50 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#f0e8ff] flex justify-between items-center bg-[#fdfbff]">
                  <span className="text-[9px] font-extrabold text-[#9d75c7] uppercase tracking-widest">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </span>
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                    <X size={11} className="text-gray-400 hover:text-gray-700" />
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-gray-400 font-mono">No jobs found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#f0e8ff]">
                    {searchResults.map(job => (
                      <button key={job._id}
                        onClick={() => { navigate('/jobs'); setSearchOpen(false); setSearchQuery(''); }}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#f8f5ff] transition-colors text-left">
                        <div className="w-7 h-7 bg-[#f0e8ff] rounded-lg flex items-center justify-center text-[#6B21A8] flex-shrink-0 mt-0.5">
                          <Briefcase size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-[#0a0a0a] truncate">{job.title}</p>
                          <p className="text-[10px] text-gray-500">{job.company}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                              <MapPin size={8} />{job.location}
                            </span>
                            {job.salary && <span className="text-[10px] font-bold text-emerald-600">{job.salary}</span>}
                          </div>
                        </div>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 bg-[#f0e8ff] border border-[#c4a0e8] rounded-lg text-[#6B21A8] flex-shrink-0">
                          {job.jobType}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-[#f0e8ff] bg-[#fdfbff]">
                    <button
                      onClick={() => { navigate('/jobs'); setSearchOpen(false); setSearchQuery(''); }}
                      className="text-[10px] font-extrabold text-[#6B21A8] hover:underline">
                      See all results in Browse Jobs →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Notification bell */}
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

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute top-full mt-2 right-0 w-72 md:w-80 bg-white border-2 border-[#1a0a2e] rounded-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b-2 border-[#1a0a2e] flex justify-between items-center bg-[#6B21A8]">
                    <div>
                      <h3 className="text-xs font-extrabold text-white">Notifications</h3>
                      {unreadCount > 0 && <p className="text-[9px] text-white/70">{unreadCount} unread</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead}
                          className="text-[9px] font-extrabold text-white/80 hover:text-white uppercase tracking-wide">
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)}>
                        <X size={13} className="text-white/70 hover:text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#f0e8ff]">
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

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Greeting */}
          <div className="mb-5">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#0a0a0a]">
              Good day, {user.firstName}! 👋
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Here's your job search overview</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[
              { icon: <Briefcase size={16} />, label: 'Jobs Applied',  value: stats.appliedJobs ?? 0, accent: '#6B21A8', light: '#f0e8ff' },
              { icon: <TrendingUp size={16} />, label: 'Profile Views', value: 24,                    accent: '#0891b2', light: '#e0f2fe' },
              { icon: <Zap size={16} />,        label: 'New Matches',   value: jobs.length,           accent: '#059669', light: '#d1fae5' },
            ].map(card => (
              <div key={card.label}
                className="bg-white border-2 border-[#1a0a2e] rounded-2xl p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#e2d4f5]"
                  style={{ background: card.light, color: card.accent }}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#0a0a0a]">{card.value}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            {/* Profile Completion */}
            <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0a0a0a]">Profile Completion</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Complete profile = better matches</p>
                </div>
                <span className="text-2xl font-extrabold" style={{ color: barColor }}>{pct}%</span>
              </div>
              <div className="w-full h-2 bg-[#f0e8ff] rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: barColor }} />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
                {steps.map(s => (
                  <div key={s.key} className="flex items-center gap-1.5">
                    {s.done
                      ? <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />
                      : <Circle size={11} className="text-gray-300 flex-shrink-0" />}
                    <span className={`text-[10px] ${s.done ? 'text-gray-400 line-through' : 'text-[#1a0a2e] font-bold'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              {pct < 100 && (
                <button onClick={() => navigate(`/user-profile/${user.id}`)}
                  className="flex items-center gap-1 bg-[#6B21A8] hover:bg-[#5b1890] text-white text-[10px] font-extrabold px-3 py-2 rounded-xl border border-[#1a0a2e] transition-all">
                  Complete profile <ChevronRight size={11} />
                </button>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl p-5">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-extrabold text-[#0a0a0a]">Recent Applications</h3>
                <Link to="/my-applications" className="text-[10px] font-extrabold text-[#6B21A8] hover:underline">
                  View all →
                </Link>
              </div>
              {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center border-2 border-dashed border-[#e2d4f5] rounded-xl">
                  <Briefcase size={24} className="text-[#e2d4f5] mb-2" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">No applications yet</p>
                  <button onClick={() => navigate('/jobs')}
                    className="mt-3 text-[10px] font-extrabold text-[#6B21A8] hover:underline">
                    Browse jobs →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {applications.map(app => (
                    <div key={app._id}
                      className="flex items-center justify-between p-2.5 bg-[#f8f5ff] border border-[#e2d4f5] rounded-xl hover:border-[#6B21A8] transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-[#0a0a0a] truncate">{app.job?.title || 'Job'}</p>
                        <p className="text-[10px] text-gray-500">{app.job?.company}</p>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider flex-shrink-0 ml-2 ${statusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-extrabold text-[#0a0a0a]">Recommended Jobs</h3>
              <Link to="/jobs" className="text-[10px] font-extrabold text-[#6B21A8] hover:underline">
                See all →
              </Link>
            </div>
            {jobs.length === 0 ? (
              <p className="text-[10px] text-gray-400 uppercase tracking-wider text-center py-6 border-2 border-dashed border-[#e2d4f5] rounded-xl">
                No jobs available right now
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {jobs.slice(0, 4).map(job => (
                  <div key={job._id}
                    onClick={() => navigate('/jobs')}
                    className="p-3.5 border-2 border-[#e2d4f5] rounded-xl hover:border-[#6B21A8] hover:bg-[#fdfbff] group cursor-pointer transition-all">
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="w-8 h-8 bg-[#f0e8ff] rounded-lg flex items-center justify-center text-[#6B21A8] flex-shrink-0">
                        <Briefcase size={13} />
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#f0e8ff] border border-[#c4a0e8] rounded-lg text-[#6B21A8] uppercase tracking-wide">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-[#0a0a0a] mb-0.5 group-hover:text-[#6B21A8] transition-colors leading-tight">{job.title}</p>
                    <p className="text-[10px] text-gray-500 mb-2">{job.company}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <MapPin size={9} />{job.location}
                    </div>
                    {job.salary && (
                      <p className="text-[10px] font-extrabold text-emerald-600 mt-1.5">{job.salary}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}