import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Building2, MapPin, DollarSign,
  FileText, Plus, X, CheckCircle, ArrowLeft,
  LayoutDashboard, Users, PlusCircle, LogOut,
  AlertTriangle, Menu, Lightbulb
} from 'lucide-react';

const NAV = [
  { icon: <LayoutDashboard size={15} />, label: 'Dashboard',    path: '/admin-dashboard' },
  { icon: <Briefcase size={15} />,       label: 'Job Listings', path: '/admin-jobs' },
  { icon: <Users size={15} />,           label: 'Applicants',   path: '/admin-applicants' },
  { icon: <PlusCircle size={15} />,      label: 'Post a Job',   path: '/admin-post-job' },
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const EMPTY_FORM = {
  title:        '',
  company:      '',
  location:     '',
  salary:       '',
  jobType:      'Full-time',
  description:  '',
  requirements: [],
};

const TIPS = [
  { icon: '✍️', text: 'Be specific with the job title — "React Developer" gets more clicks than "Developer".' },
  { icon: '💰', text: 'Jobs with a salary range get 40% more applicants than those without.' },
  { icon: '📍', text: 'Include "Remote" in location if the role allows remote work.' },
  { icon: '📋', text: 'Keep requirements realistic — too many filters reduce quality applicants.' },
];

export default function AdminPostJob() {
  const [form, setForm]             = useState(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState(null);
  const [errors, setErrors]         = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive]           = useState('Post a Job');

  const navigate  = useNavigate();
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Job title is required';
    if (!form.company.trim())     e.company     = 'Company name is required';
    if (!form.location.trim())    e.location    = 'Location is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // ── Requirements/skills tags ──
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.requirements.includes(s)) {
      setForm({ ...form, requirements: [...form.requirements, s] });
    }
    setSkillInput('');
  };

  const removeSkill = (s) => {
    setForm({ ...form, requirements: form.requirements.filter(r => r !== s) });
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await axios.post('https://proback-ops7.onrender.com/jobs/create', {
        ...form,
        postedBy: user.id || user._id,
      });
      showToast('success', 'Job posted successfully!');
      setForm(EMPTY_FORM);
      setSkillInput('');
      // Navigate to jobs list after short delay
      setTimeout(() => navigate('/admin-jobs'), 1500);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Error posting job. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/admin-login'); };

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
              <Menu size={14} className="text-[#6B21A8]" />
            </button>
            <button onClick={() => navigate('/admin-jobs')}
              className="w-8 h-8 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl hidden md:flex items-center justify-center hover:border-[#6B21A8] transition-all">
              <ArrowLeft size={14} className="text-[#6B21A8]" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-[#0a0a0a]">Post a Job</h1>
              <p className="text-[10px] text-gray-400 font-mono">Fill in the details to publish a new listing</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl px-2 py-1.5">
            <div className="w-6 h-6 bg-[#6B21A8] rounded-lg flex items-center justify-center text-white text-[9px] font-extrabold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <span className="hidden sm:block text-xs font-extrabold text-[#1a0a2e]">{user?.firstName}</span>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── Left: Main form ── */}
                <div className="lg:col-span-2 space-y-5">

                  {/* Basic Info Card */}
                  <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b-2 border-[#f0e8ff] flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#f0e8ff] rounded-lg flex items-center justify-center">
                        <Briefcase size={13} className="text-[#6B21A8]" />
                      </div>
                      <h3 className="text-xs font-extrabold text-[#1a0a2e] uppercase tracking-wider">Basic Information</h3>
                    </div>
                    <div className="p-5 space-y-4">

                      {/* Title */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input name="title" value={form.title} onChange={handle}
                          placeholder="e.g. Senior Frontend Developer"
                          className={`w-full bg-[#f8f5ff] border-2 rounded-xl py-2.5 px-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:bg-white transition-all ${
                            errors.title ? 'border-red-300 focus:border-red-400' : 'border-[#e2d4f5] focus:border-[#6B21A8]'
                          }`} />
                        {errors.title && <p className="text-[10px] text-red-500 mt-1 font-mono">{errors.title}</p>}
                      </div>

                      {/* Company + Location row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                            Company <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                            <input name="company" value={form.company} onChange={handle}
                              placeholder="e.g. Paystack"
                              className={`w-full bg-[#f8f5ff] border-2 rounded-xl py-2.5 pl-9 pr-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:bg-white transition-all ${
                                errors.company ? 'border-red-300 focus:border-red-400' : 'border-[#e2d4f5] focus:border-[#6B21A8]'
                              }`} />
                          </div>
                          {errors.company && <p className="text-[10px] text-red-500 mt-1 font-mono">{errors.company}</p>}
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                            Location <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <MapPin size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                            <input name="location" value={form.location} onChange={handle}
                              placeholder="e.g. Lagos or Remote"
                              className={`w-full bg-[#f8f5ff] border-2 rounded-xl py-2.5 pl-9 pr-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:bg-white transition-all ${
                                errors.location ? 'border-red-300 focus:border-red-400' : 'border-[#e2d4f5] focus:border-[#6B21A8]'
                              }`} />
                          </div>
                          {errors.location && <p className="text-[10px] text-red-500 mt-1 font-mono">{errors.location}</p>}
                        </div>
                      </div>

                      {/* Salary */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                          Salary <span className="text-gray-400 normal-case tracking-normal font-normal">(optional but recommended)</span>
                        </label>
                        <div className="relative">
                          <DollarSign size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                          <input name="salary" value={form.salary} onChange={handle}
                            placeholder="e.g. ₦200,000 - ₦350,000 / month"
                            className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 pl-9 pr-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all" />
                        </div>
                      </div>

                      {/* Job Type */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-2">
                          Job Type
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {JOB_TYPES.map(t => (
                            <button key={t} type="button"
                              onClick={() => setForm({ ...form, jobType: t })}
                              className={`px-4 py-2 rounded-xl text-[11px] font-extrabold border-2 transition-all ${
                                form.jobType === t
                                  ? 'bg-[#6B21A8] text-white border-[#6B21A8]'
                                  : 'bg-white text-[#6B21A8] border-[#e2d4f5] hover:border-[#6B21A8]'
                              }`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Card */}
                  <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b-2 border-[#f0e8ff] flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#f0e8ff] rounded-lg flex items-center justify-center">
                        <FileText size={13} className="text-[#6B21A8]" />
                      </div>
                      <h3 className="text-xs font-extrabold text-[#1a0a2e] uppercase tracking-wider">Job Description</h3>
                    </div>
                    <div className="p-5">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handle}
                        rows={6}
                        placeholder="Describe the role in detail — responsibilities, day-to-day tasks, team structure, and what success looks like in this position..."
                        className={`w-full bg-[#f8f5ff] border-2 rounded-xl py-3 px-4 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:bg-white transition-all resize-none ${
                          errors.description ? 'border-red-300 focus:border-red-400' : 'border-[#e2d4f5] focus:border-[#6B21A8]'
                        }`} />
                      {errors.description && <p className="text-[10px] text-red-500 mt-1 font-mono">{errors.description}</p>}
                      <p className="text-[10px] text-gray-400 mt-2 font-mono">{form.description.length} characters</p>
                    </div>
                  </div>

                  {/* Requirements Card */}
                  <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b-2 border-[#f0e8ff] flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#f0e8ff] rounded-lg flex items-center justify-center">
                        <CheckCircle size={13} className="text-[#6B21A8]" />
                      </div>
                      <h3 className="text-xs font-extrabold text-[#1a0a2e] uppercase tracking-wider">Requirements & Skills</h3>
                    </div>
                    <div className="p-5">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                        Add Requirements <span className="text-gray-400 normal-case tracking-normal font-normal">(press Enter or click +)</span>
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={e => setSkillInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          placeholder="e.g. React, 3 years experience, Node.js..."
                          className="flex-1 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 px-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                        />
                        <button type="button" onClick={addSkill}
                          className="w-10 h-10 bg-[#6B21A8] hover:bg-[#5b1890] rounded-xl flex items-center justify-center text-white border border-[#1a0a2e] transition-all flex-shrink-0">
                          <Plus size={16} />
                        </button>
                      </div>

                      {form.requirements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-[#e2d4f5] rounded-xl">
                          <p className="text-[10px] text-gray-400 font-mono">No requirements added yet</p>
                          <p className="text-[10px] text-gray-300 font-mono">Type above and press Enter</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {form.requirements.map((req, i) => (
                            <span key={i}
                              className="flex items-center gap-1.5 bg-[#f0e8ff] border border-[#c4a0e8] text-[#6B21A8] text-[11px] font-bold px-3 py-1.5 rounded-xl">
                              {req}
                              <button type="button" onClick={() => removeSkill(req)}
                                className="hover:text-red-500 transition-colors ml-0.5">
                                <X size={11} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="flex gap-3 pb-6">
                    <button type="button" onClick={() => navigate('/admin-jobs')}
                      className="flex-1 py-3.5 rounded-xl border-2 border-[#e2d4f5] text-sm font-extrabold text-gray-500 hover:border-[#6B21A8] hover:text-[#6B21A8] transition-all">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#6B21A8] hover:bg-[#5b1890] text-white text-sm font-extrabold py-3.5 rounded-xl border border-[#1a0a2e] transition-all disabled:opacity-50">
                      {saving
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing...</>
                        : <><Plus size={15} /> Publish Job</>}
                    </button>
                  </div>
                </div>

                {/* ── Right: Preview + Tips ── */}
                <div className="space-y-4">

                  {/* Live Preview Card */}
                  <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl overflow-hidden sticky top-4">
                    <div className="px-5 py-4 border-b-2 border-[#f0e8ff] flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#f0e8ff] rounded-lg flex items-center justify-center">
                        <Briefcase size={13} className="text-[#6B21A8]" />
                      </div>
                      <h3 className="text-xs font-extrabold text-[#1a0a2e] uppercase tracking-wider">Live Preview</h3>
                    </div>

                    <div className="p-4">
                      <div className="border-2 border-[#e2d4f5] rounded-xl p-4 bg-[#fdfbff]">
                        {/* Job card preview */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-9 h-9 bg-[#f0e8ff] rounded-xl flex items-center justify-center text-[#6B21A8] border border-[#e2d4f5]">
                            <Briefcase size={14} />
                          </div>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
                            form.jobType === 'Full-time'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            form.jobType === 'Part-time'  ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            form.jobType === 'Contract'   ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            'bg-purple-50 text-purple-700 border-purple-200'
                          }`}>
                            {form.jobType}
                          </span>
                        </div>

                        <p className="text-xs font-extrabold text-[#0a0a0a] leading-tight mb-0.5">
                          {form.title || <span className="text-gray-300">Job Title</span>}
                        </p>
                        <p className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                          <Building2 size={9} />
                          {form.company || <span className="text-gray-300">Company</span>}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {form.location && (
                            <span className="flex items-center gap-1 text-[9px] bg-[#f8f5ff] border border-[#e2d4f5] px-2 py-0.5 rounded-lg text-gray-500">
                              <MapPin size={8} />{form.location}
                            </span>
                          )}
                          {form.salary && (
                            <span className="flex items-center gap-1 text-[9px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-emerald-700 font-bold">
                              <DollarSign size={8} />{form.salary}
                            </span>
                          )}
                        </div>

                        {form.requirements.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {form.requirements.slice(0, 3).map((r, i) => (
                              <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 bg-[#f0e8ff] border border-[#c4a0e8] rounded-md text-[#6B21A8]">
                                {r}
                              </span>
                            ))}
                            {form.requirements.length > 3 && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded-md text-gray-500">
                                +{form.requirements.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-[9px] text-gray-400 font-mono text-center mt-2">
                        This is how candidates will see your listing
                      </p>
                    </div>
                  </div>

                  {/* Tips Card */}
                  <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b-2 border-[#f0e8ff] flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#f0e8ff] rounded-lg flex items-center justify-center">
                        <Lightbulb size={13} className="text-[#6B21A8]" />
                      </div>
                      <h3 className="text-xs font-extrabold text-[#1a0a2e] uppercase tracking-wider">Posting Tips</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {TIPS.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="text-base flex-shrink-0 mt-0.5">{tip.icon}</span>
                          <p className="text-[10px] text-gray-500 leading-relaxed">{tip.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border-2 border-[#1a0a2e] rounded-2xl max-w-xs ${
          toast.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
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