// src/pages/AdminJobs.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Plus, Pencil, Trash2, X, Save,
  MapPin, DollarSign, Building2, ArrowLeft,
  Search, ChevronRight, Clock, Users, CheckCircle,
  AlertTriangle, LayoutDashboard, PlusCircle, LogOut
} from 'lucide-react';

const NAV = [
  { icon: <LayoutDashboard size={15} />, label: 'Dashboard',    path: '/admin-dashboard' },
  { icon: <Briefcase size={15} />,       label: 'Job Listings', path: '/admin-jobs' },
  { icon: <Users size={15} />,           label: 'Applicants',   path: '/admin-applicants' },
  { icon: <PlusCircle size={15} />,      label: 'Post a Job',   path: '/admin-post-job' },
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const EMPTY_FORM = {
  title: '', company: '', location: '',
  salary: '', description: '', requirements: '', jobType: 'Full-time'
};

export default function AdminJobs() {
  const [jobs, setJobs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState('All');

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Form state
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast]     = useState(null); // { type: 'success'|'error', msg }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive]           = useState('Job Listings');

  const navigate = useNavigate();
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') navigate('/admin-login');
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetchJobs();
  }, [user?.id]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`https://proback-ops7.onrender.com/jobs/admin/${user.id}`);
      setJobs(res.data);
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

  // ── Filtered jobs ──
  const filtered = jobs.filter(job => {
    const q = search.toLowerCase();
    const matchSearch =
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q);
    const matchType = filterType === 'All' || job.jobType === filterType;
    return matchSearch && matchType;
  });

  // ── Create ──
  const handleCreate = async () => {
    if (!form.title || !form.company || !form.location || !form.description) {
      return showToast('error', 'Please fill in all required fields.');
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        postedBy: user.id,
        requirements: form.requirements
          ? form.requirements.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };
      await axios.post('https://proback-ops7.onrender.com/jobs/create', payload);
      await fetchJobs();
      setShowCreate(false);
      setForm(EMPTY_FORM);
      showToast('success', 'Job posted successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Error posting job.');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ──
  const openEdit = (job) => {
    setSelectedJob(job);
    setForm({
      title:        job.title || '',
      company:      job.company || '',
      location:     job.location || '',
      salary:       job.salary || '',
      description:  job.description || '',
      requirements: job.requirements?.join(', ') || '',
      jobType:      job.jobType || 'Full-time',
    });
    setShowEdit(true);
  };

  const handleEdit = async () => {
    if (!form.title || !form.company || !form.location || !form.description) {
      return showToast('error', 'Please fill in all required fields.');
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements
          ? form.requirements.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };
      await axios.put(`https://proback-ops7.onrender.com/jobs/update/${selectedJob._id}`, payload);
      await fetchJobs();
      setShowEdit(false);
      setSelectedJob(null);
      setForm(EMPTY_FORM);
      showToast('success', 'Job updated successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Error updating job.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const openDelete = (job) => { setSelectedJob(job); setShowDelete(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`https://proback-ops7.onrender.com/jobs/delete/${selectedJob._id}`);
      await fetchJobs();
      setShowDelete(false);
      setSelectedJob(null);
      showToast('success', 'Job deleted successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Error deleting job.');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/admin-login'); };

  const typeColor = (t) => ({
    'Full-time':  'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Part-time':  'bg-blue-50 text-blue-700 border-blue-200',
    'Contract':   'bg-orange-50 text-orange-700 border-orange-200',
    'Internship': 'bg-purple-50 text-purple-700 border-purple-200',
  }[t] || 'bg-gray-100 text-gray-600 border-gray-200');

  // ── Reusable Job Form ──
  const JobForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'title',    label: 'Job Title *',   placeholder: 'e.g. Frontend Developer' },
          { name: 'company',  label: 'Company *',     placeholder: 'e.g. Tech Solutions Ltd' },
          { name: 'location', label: 'Location *',    placeholder: 'e.g. Lagos or Remote' },
          { name: 'salary',   label: 'Salary',        placeholder: 'e.g. ₦200,000 - ₦300,000' },
        ].map(f => (
          <div key={f.name} className="col-span-2 sm:col-span-1">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
              {f.label}
            </label>
            <input
              type="text"
              value={form[f.name]}
              onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 px-3 text-xs text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
            />
          </div>
        ))}
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
          Job Type
        </label>
        <div className="flex gap-2 flex-wrap">
          {JOB_TYPES.map(t => (
            <button key={t} type="button" onClick={() => setForm({ ...form, jobType: t })}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border-2 transition-all ${
                form.jobType === t
                  ? 'bg-[#6B21A8] text-white border-[#6B21A8]'
                  : 'bg-white text-[#6B21A8] border-[#e2d4f5] hover:border-[#6B21A8]'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
          Description *
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Describe the role, responsibilities and what you're looking for..."
          className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 px-3 text-xs text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all resize-none"
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
          Requirements <span className="text-gray-400 normal-case tracking-normal">(comma separated)</span>
        </label>
        <input
          type="text"
          value={form.requirements}
          onChange={e => setForm({ ...form, requirements: e.target.value })}
          placeholder="e.g. React, Node.js, 3 years experience"
          className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 px-3 text-xs text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
        />
      </div>
    </div>
  );

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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-[#6B21A8] text-white' : 'text-[#4a4a6a] hover:bg-[#f0e8ff] hover:text-[#6B21A8]'
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
              <Briefcase size={14} className="text-[#6B21A8]" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-[#0a0a0a]">Job Listings</h1>
              <p className="text-[10px] text-gray-400 font-mono">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search size={12} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2 pl-8 pr-3 text-xs text-[#1a0a2e] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] w-48 transition-all" />
            </div>

            {/* Post job button */}
            <button onClick={() => { setForm(EMPTY_FORM); setShowCreate(true); }}
              className="flex items-center gap-1.5 bg-[#6B21A8] hover:bg-[#5b1890] text-white text-xs font-extrabold px-4 py-2 rounded-xl border border-[#1a0a2e] transition-all">
              <Plus size={13} /> Post Job
            </button>

            {/* Avatar */}
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
              placeholder="Search jobs..."
              className="w-full bg-white border-2 border-[#e2d4f5] rounded-xl py-2.5 pl-8 pr-3 text-xs text-[#1a0a2e] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] transition-all" />
          </div>

          {/* Type filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5 flex-nowrap">
            {['All', ...JOB_TYPES].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-3 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border-2 transition-all whitespace-nowrap ${
                  filterType === t
                    ? 'bg-[#6B21A8] text-white border-[#6B21A8]'
                    : 'bg-white text-[#6B21A8] border-[#e2d4f5] hover:border-[#6B21A8]'
                }`}>
                {t} {t === 'All' ? `(${jobs.length})` : `(${jobs.filter(j => j.jobType === t).length})`}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#6B21A8] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-gray-400 font-mono">Loading your jobs...</p>
            </div>

          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-[#e2d4f5] rounded-2xl">
              <div className="w-14 h-14 bg-[#f0e8ff] rounded-2xl flex items-center justify-center mb-4">
                <Briefcase size={24} className="text-[#c4a0e8]" />
              </div>
              <p className="text-sm font-extrabold text-[#1a0a2e] mb-1">
                {search || filterType !== 'All' ? 'No jobs match your search' : 'No jobs posted yet'}
              </p>
              <p className="text-xs text-gray-400 mb-5">
                {search || filterType !== 'All' ? 'Try adjusting your filters' : 'Post your first job to start receiving applications'}
              </p>
              {!search && filterType === 'All' && (
                <button onClick={() => { setForm(EMPTY_FORM); setShowCreate(true); }}
                  className="flex items-center gap-2 bg-[#6B21A8] hover:bg-[#5b1890] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl border border-[#1a0a2e] transition-all">
                  <Plus size={13} /> Post Your First Job
                </button>
              )}
            </div>

          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(job => (
                <div key={job._id}
                  className="bg-white border-2 border-[#e2d4f5] rounded-2xl p-5 hover:border-[#6B21A8] transition-all group flex flex-col">

                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-[#f0e8ff] rounded-xl flex items-center justify-center text-[#6B21A8] border border-[#e2d4f5] group-hover:bg-[#6B21A8] group-hover:text-white group-hover:border-[#6B21A8] transition-all flex-shrink-0">
                      <Briefcase size={16} />
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg border uppercase tracking-wider ${typeColor(job.jobType)}`}>
                      {job.jobType}
                    </span>
                  </div>

                  {/* Title + company */}
                  <h3 className="text-sm font-extrabold text-[#0a0a0a] group-hover:text-[#6B21A8] transition-colors mb-0.5 leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-[11px] font-bold text-gray-500 mb-2 flex items-center gap-1">
                    <Building2 size={10} />{job.company}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="flex items-center gap-1 text-[10px] bg-[#f8f5ff] border border-[#e2d4f5] px-2 py-0.5 rounded-lg text-gray-500">
                      <MapPin size={9} />{job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 text-[10px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-emerald-700 font-bold">
                        <DollarSign size={9} />{job.salary}
                      </span>
                    )}
                  </div>

                  {/* Description preview */}
                  <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-3 flex-1">
                    {job.description}
                  </p>

                  {/* Requirements tags */}
                  {job.requirements?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {job.requirements.slice(0, 3).map((r, i) => (
                        <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-[#f0e8ff] border border-[#c4a0e8] rounded-lg text-[#6B21A8]">
                          {r}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">
                          +{job.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Posted date */}
                  <p className="text-[9px] text-gray-400 font-mono flex items-center gap-1 mb-4">
                    <Clock size={9} />
                    Posted {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => openEdit(job)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#f8f5ff] hover:bg-[#f0e8ff] text-[#6B21A8] text-[11px] font-extrabold py-2.5 rounded-xl border-2 border-[#e2d4f5] hover:border-[#6B21A8] transition-all">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => openDelete(job)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-extrabold py-2.5 rounded-xl border-2 border-red-200 hover:border-red-400 transition-all">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ══ CREATE MODAL ══ */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-[#6B21A8] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-white">Post a New Job</h2>
                <p className="text-[10px] text-white/70 mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={() => setShowCreate(false)}
                className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">
                <X size={13} className="text-white" />
              </button>
            </div>
            <div className="p-6">
              <JobForm />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-[#e2d4f5] text-xs font-extrabold text-gray-500 hover:border-[#6B21A8] hover:text-[#6B21A8] transition-all">
                  Cancel
                </button>
                <button onClick={handleCreate} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#6B21A8] hover:bg-[#5b1890] text-white text-xs font-extrabold py-3 rounded-xl border border-[#1a0a2e] transition-all disabled:opacity-50">
                  {saving
                    ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Posting...</>
                    : <><Plus size={13} /> Post Job</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT MODAL ══ */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setShowEdit(false)}>
          <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-[#6B21A8] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-white">Edit Job</h2>
                <p className="text-[10px] text-white/70 mt-0.5 truncate max-w-[260px]">{selectedJob?.title}</p>
              </div>
              <button onClick={() => setShowEdit(false)}
                className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">
                <X size={13} className="text-white" />
              </button>
            </div>
            <div className="p-6">
              <JobForm />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowEdit(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-[#e2d4f5] text-xs font-extrabold text-gray-500 hover:border-[#6B21A8] hover:text-[#6B21A8] transition-all">
                  Cancel
                </button>
                <button onClick={handleEdit} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#6B21A8] hover:bg-[#5b1890] text-white text-xs font-extrabold py-3 rounded-xl border border-[#1a0a2e] transition-all disabled:opacity-50">
                  {saving
                    ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                    : <><Save size={13} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM MODAL ══ */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setShowDelete(false)}>
          <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h2 className="text-sm font-extrabold text-[#0a0a0a] mb-1">Delete this job?</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="font-bold text-[#0a0a0a]">"{selectedJob?.title}"</span> will be permanently deleted along with all its applications. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)}
                className="flex-1 py-3 rounded-xl border-2 border-[#e2d4f5] text-xs font-extrabold text-gray-500 hover:border-[#6B21A8] hover:text-[#6B21A8] transition-all">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold py-3 rounded-xl border border-red-600 transition-all disabled:opacity-50">
                {deleting
                  ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting...</>
                  : <><Trash2 size={13} /> Yes, Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOAST ══ */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border-2 border-[#1a0a2e] rounded-2xl max-w-xs ${
          toast.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
            : <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />}
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