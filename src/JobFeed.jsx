import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
Briefcase, MapPin, DollarSign, Building2, Search,
X, Upload, CheckCircle, Clock, ArrowLeft, Eye,
Filter, ChevronRight, Calendar, Users, FileText
} from 'lucide-react';

const JobFeed = () => {
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('');
const [filterType, setFilterType] = useState('All');
const [selectedJob, setSelectedJob] = useState(null); // for detail modal
const [applyJob, setApplyJob] = useState(null); // for apply modal
const [resumeFile, setResumeFile] = useState(null);
const [resumeLink, setResumeLink] = useState('');
const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'link'
const [applying, setApplying] = useState(false);
const [appliedIds, setAppliedIds] = useState([]);
const [successJob, setSuccessJob] = useState(null);

const navigate = useNavigate();
const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

useEffect(() => {
if (!user || user.role !== 'user') { navigate('/user-login'); return; }

axios.get('https://proback-ops7.onrender.com/jobs/all')
    .then(r => { setJobs(r.data); setLoading(false); })
    .catch(err => { console.error(err); setLoading(false); });

// fetch already-applied job IDs to disable those buttons
const userId = user?.id || user?._id;
axios.get(`https://proback-ops7.onrender.com/applications/user/${userId}`)
    .then(r => {
        const apps = r.data?.applications || r.data || [];
        setAppliedIds(apps.map(a => a.job?._id || a.job));
    })
    .catch(console.error);
}, []);

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];

const filtered = jobs.filter(job => {
const q = search.toLowerCase();
const matchSearch =
    job.title?.toLowerCase().includes(q) ||
    job.company?.toLowerCase().includes(q) ||
    job.location?.toLowerCase().includes(q);
const matchType = filterType === 'All' || job.jobType === filterType;
return matchSearch && matchType;
});

// ── Apply handler ──
const handleApply = async () => {
if (!applyJob) return;
if (uploadMode === 'file' && !resumeFile) {
    return alert('Please upload your resume before applying.');
}
if (uploadMode === 'link' && !resumeLink.trim()) {
    return alert('Please paste your resume link before applying.');
}

setApplying(true);
try {
    // If file uploaded, convert to base64 data URL as the resumeLink placeholder
    // In production you'd upload to S3/Cloudinary and get back a URL
    let finalResumeLink = resumeLink;
    if (uploadMode === 'file' && resumeFile) {
        finalResumeLink = `uploaded:${resumeFile.name}`; // replace with real upload URL
    }

    const res = await axios.post('https://proback-ops7.onrender.com/applications/apply', {
        jobId: applyJob._id,
        applicantId: user.id || user._id,
        resumeLink: finalResumeLink,
    });

    setAppliedIds(prev => [...prev, applyJob._id]);
    setSuccessJob(applyJob);
    setApplyJob(null);
    setResumeFile(null);
    setResumeLink('');
} catch (err) {
    alert(err.response?.data?.message || 'Error applying. Try again.');
} finally {
    setApplying(false);
}
};

const closeApplyModal = () => {
setApplyJob(null);
setResumeFile(null);
setResumeLink('');
setUploadMode('file');
};

const typeColor = (t) => ({
'Full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
'Part-time': 'bg-blue-50 text-blue-700 border-blue-200',
'Contract': 'bg-orange-50 text-orange-700 border-orange-200',
'Internship': 'bg-purple-50 text-purple-700 border-purple-200',
}[t] || 'bg-gray-100 text-gray-600 border-gray-200');

return (
<div className="min-h-screen bg-[#f7f5ff] font-sans">

    {/* ── Header ── */}
    <header className="bg-white border-b-1 border-[rgba(26,10,46,0.1)] px-4 md:px-8 py-4 flex items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate('/user-dashboard')}
                className="w-8 h-8 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl flex items-center justify-center hover:border-[#6B21A8] transition-all">
                <ArrowLeft size={14} className="text-[#6B21A8]" />
            </button>
            <div>
                <h1 className="text-base font-extrabold text-[#0a0a0a]">Browse Jobs</h1>
                <p className="text-[13px] text-gray-900 font-mono">{filtered.length} opportunit{filtered.length !== 1 ? 'ies' : 'y'} found</p>
            </div>
        </div>
        {/* <div className="flex items-center gap-2 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl px-3 py-1.5">
            <div className="w-6 h-6 bg-[#6B21A8] rounded-lg flex items-center justify-center text-white text-[9px] font-extrabold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <span className="hidden sm:block text-xs font-extrabold text-[#1a0a2e]">{user?.firstName}</span>
        </div> */}
    </header>

    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">

        {/* ── Search + filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
                <Search size={19} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search job title, company, location..."
                    className="w-full bg-white border-2 border-[#e2d4f5] rounded-xl py-2.5 pl-9 pr-9 text-sm text-[#1a0a2e] placeholder-[#9d75c7] focus:outline-none focus:border-[rgba(26,10,46,0.2)] transition-all" />
                {search && (
                    <button onClick={() => setSearch('')} className="absolute top-1/2 -translate-y-1/2 right-3">
                        <X size={12} className="text-gray-400 hover:text-gray-700" />
                    </button>
                )}
            </div>

            {/* Type filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 flex-nowrap">
                {JOB_TYPES.map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                        className={`px-3 py-2 rounded-xl text-[10px] cursor-pointer font-extrabold uppercase tracking-wider border-2 transition-all whitespace-nowrap ${filterType === t
                                ? 'bg-[#6B21A8] text-white border-[#6B21A8]'
                                : 'bg-white text-[#6B21A8] border-[#e2d4f5] '
                            }`}>
                        {t}
                    </button>
                ))}
            </div>
        </div>

        {/* ── Loading ── */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-[#6B21A8] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs text-gray-400 font-mono">Fetching opportunities...</p>
            </div>

        ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-[#e2d4f5] rounded-2xl">
                <div className="w-14 h-14 bg-[#f0e8ff] rounded-2xl flex items-center justify-center mb-4">
                    <Briefcase size={24} className="text-[#c4a0e8]" />
                </div>
                <p className="text-sm font-extrabold text-[#1a0a2e] mb-1">No jobs found</p>
                <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
            </div>

        ) : (
            // ── Job grid ──
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(job => {
                    const alreadyApplied = appliedIds.includes(job._id);
                    return (
                        <div key={job._id}
                            className="bg-white border-2 border-[#e2d4f5] rounded-2xl p-5 transition-all group flex flex-col">

                            {/* Top row */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-[#f0e8ff] rounded-xl flex items-center justify-center text-[#6B21A8] border border-[#e2d4f5] group-hover:bg-[#6B21A8] group-hover:text-white group-hover:border-[#6B21A8] transition-all flex-shrink-0">
                                    <Briefcase size={16} />
                                </div>
                                <span className={`text-[12px] font-extrabold px-2 py-0.5 rounded-lg border uppercase tracking-wider ${typeColor(job.jobType)}`}>
                                    {job.jobType}
                                </span>
                            </div>

                            {/* Title + company */}
                            <h3 className="text-sm font-extrabold text-[#0a0a0a] group-hover:text-[#6B21A8] transition-colors mb-0.5 leading-tight">
                                {job.title}
                            </h3>
                            <p className="text-[13px] font-bold text-gray-900 mb-3 flex items-center gap-1">
                                <Building2 size={10} />{job.company}
                            </p>

                            {/* Description preview */}
                            <p className="text-[13px] text-gray-900 leading-relaxed line-clamp-2 mb-3 flex-1">
                                {job.description}
                            </p>

                            {/* Meta chips */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                <span className="flex items-center gap-1 text-[12px] bg-[#f8f5ff] border border-[#e2d4f5] px-2 py-0.5 rounded-lg text-dark font-bold">
                                    <MapPin size={11} />{job.location}
                                </span>
                                {job.salary && (
                                    <span className="flex items-center gap-1 text-[12px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-dark font-bold">
                                        <DollarSign size={11} />{job.salary}
                                    </span>
                                )}
                                {job.requirements?.length > 0 && (
                                    <span className="flex items-center gap-1 text-[12px] bg-[#f8f5ff] border border-[#e2d4f5] px-2 py-0.5 rounded-lg text-dark font-bold">
                                        <Users size={11} />{job.requirements.length} skills
                                    </span>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 mt-auto">
                                {/* View details */}
                                <button onClick={() => setSelectedJob(job)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#f8f5ff] hover:bg-[#f0e8ff] text-[#6B21A8] text-[11px] font-extrabold py-2.5 rounded-xl border-2 border-[#e2d4f5] hover:border-[#6B21A8] transition-all">
                                    <Eye size={12} /> Details
                                </button>

                                {/* Apply */}
                                <button
                                    disabled={alreadyApplied}
                                    onClick={() => !alreadyApplied && setApplyJob(job)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-extrabold py-2.5 rounded-xl border-2 transition-all ${alreadyApplied
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 cursor-not-allowed'
                                            : 'bg-[#6B21A8] hover:bg-[#5b1890] text-white border-[#6B21A8] hover:border-[#5b1890]'
                                        }`}>
                                    {alreadyApplied
                                        ? <><CheckCircle size={12} /> Applied</>
                                        : <><ChevronRight size={12} /> Apply</>}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>

    {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setSelectedJob(null)}>
            <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">

                {/* Modal header */}
                <div className="bg-[#6B21A8] px-6 py-5 relative overflow-hidden">
                    <div className="absolute w-32 h-32 rounded-full border-[20px] border-white/10 -top-10 -right-10 pointer-events-none" />
                    <button onClick={() => setSelectedJob(null)}
                        className="absolute top-4 right-4 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">
                        <X size={13} className="text-white" />
                    </button>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-white leading-tight">{selectedJob.title}</h2>
                            <p className="text-xs text-white/70 mt-0.5">{selectedJob.company}</p>
                        </div>
                    </div>
                </div>

                {/* Modal body */}
                <div className="p-6 space-y-5">

                    {/* Quick info chips */}
                    <div className="flex flex-wrap gap-2">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${typeColor(selectedJob.jobType)}`}>
                            {selectedJob.jobType}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] bg-[#f8f5ff] border border-[#e2d4f5] px-2.5 py-1 rounded-lg text-gray-600 font-bold">
                            <MapPin size={10} />{selectedJob.location}
                        </span>
                        {selectedJob.salary && (
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-700 font-bold">
                                <DollarSign size={10} />{selectedJob.salary}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] bg-[#f8f5ff] border border-[#e2d4f5] px-2.5 py-1 rounded-lg text-gray-500">
                            <Calendar size={10} />
                            Posted {new Date(selectedJob.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-xs font-extrabold text-[#1a0a2e] uppercase tracking-wider mb-2">About this Role</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{selectedJob.description}</p>
                    </div>

                    {/* Requirements */}
                    {selectedJob.requirements?.length > 0 && (
                        <div>
                            <h4 className="text-xs font-extrabold text-[#1a0a2e] uppercase tracking-wider mb-2">Requirements</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedJob.requirements.map((req, i) => (
                                    <span key={i}
                                        className="text-[10px] font-bold px-2.5 py-1 bg-[#f0e8ff] border border-[#c4a0e8] rounded-lg text-[#6B21A8]">
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setSelectedJob(null)}
                            className="flex-1 py-3 rounded-xl border-2 border-[#e2d4f5] text-xs font-extrabold text-gray-500 hover:border-[#6B21A8] hover:text-[#6B21A8] transition-all">
                            Close
                        </button>
                        {appliedIds.includes(selectedJob._id) ? (
                            <button disabled
                                className="flex-1 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-xs font-extrabold text-emerald-600 flex items-center justify-center gap-2 cursor-not-allowed">
                                <CheckCircle size={13} /> Already Applied
                            </button>
                        ) : (
                            <button
                                onClick={() => { setSelectedJob(null); setApplyJob(selectedJob); }}
                                className="flex-1 py-3 rounded-xl bg-[#6B21A8] hover:bg-[#5b1890] border-2 border-[#6B21A8] text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all">
                                Apply Now <ChevronRight size={13} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )}

    {applyJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeApplyModal()}>
            <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl w-full max-w-md">

                {/* Header */}
                <div className="px-6 py-5 border-b-2 border-[#f0e8ff] flex items-start justify-between">
                    <div>
                        <h2 className="text-sm font-extrabold text-[#0a0a0a]">Apply for Position</h2>
                        <p className="text-xs text-[#6B21A8] font-bold mt-0.5">{applyJob.title} — {applyJob.company}</p>
                    </div>
                    <button onClick={closeApplyModal}
                        className="w-7 h-7 bg-[#f8f5ff] border border-[#e2d4f5] rounded-lg flex items-center justify-center hover:border-[#6B21A8] transition-all">
                        <X size={12} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-5">

                    {/* Upload mode toggle */}
                    <div>
                        <p className="text-[10px] font-extrabold text-[#1a0a2e] uppercase tracking-wider mb-2">
                            Resume / CV <span className="text-red-500">*</span>
                        </p>
                        <div className="flex gap-2 mb-3">
                            {['file', 'link'].map(mode => (
                                <button key={mode} onClick={() => setUploadMode(mode)}
                                    className={`flex-1 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border-2 transition-all ${uploadMode === mode
                                            ? 'bg-[#6B21A8] text-white border-[#6B21A8]'
                                            : 'bg-white text-[#6B21A8] border-[#e2d4f5] hover:border-[#6B21A8]'
                                        }`}>
                                    {mode === 'file' ? '📎 Upload File' : '🔗 Paste Link'}
                                </button>
                            ))}
                        </div>

                        {uploadMode === 'file' ? (
                            <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${resumeFile
                                    ? 'border-emerald-400 bg-emerald-50'
                                    : 'border-[#c4a0e8] bg-[#f8f5ff] hover:border-[#6B21A8] hover:bg-[#f0e8ff]'
                                }`}>
                                <input type="file" accept=".pdf,.doc,.docx" className="hidden"
                                    onChange={e => setResumeFile(e.target.files[0])} />
                                {resumeFile ? (
                                    <>
                                        <CheckCircle size={24} className="text-emerald-500" />
                                        <div className="text-center">
                                            <p className="text-xs font-extrabold text-emerald-700">{resumeFile.name}</p>
                                            <p className="text-[10px] text-emerald-500 mt-0.5">
                                                {(resumeFile.size / 1024).toFixed(0)} KB — Click to change
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={24} className="text-[#9d75c7]" />
                                        <div className="text-center">
                                            <p className="text-xs font-extrabold text-[#6B21A8]">Click to upload resume</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">PDF, DOC, DOCX — max 5MB</p>
                                        </div>
                                    </>
                                )}
                            </label>

                        ) : (

                            <div className="relative">
                                <FileText size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9d75c7]" />
                                <input
                                    type="url"
                                    value={resumeLink}
                                    onChange={e => setResumeLink(e.target.value)}
                                    placeholder="https://drive.google.com/your-resume"
                                    className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#1a0a2e] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] transition-all"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-2 bg-[#f8f5ff] border border-[#e2d4f5] rounded-xl p-3">
                        <Clock size={13} className="text-[#9d75c7] flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            Your application will be reviewed by the recruiter. You'll receive a status update in your dashboard.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={closeApplyModal}
                            className="flex-1 py-3 rounded-xl border-2 border-[#e2d4f5] text-xs font-extrabold text-gray-500 hover:border-[#6B21A8] hover:text-[#6B21A8] transition-all">
                            Cancel
                        </button>
                        <button onClick={handleApply} disabled={applying}
                            className="flex-1 py-3 rounded-xl bg-[#6B21A8] hover:bg-[#5b1890] text-white text-xs font-extrabold flex items-center justify-center gap-2 border-2 border-[#6B21A8] transition-all disabled:opacity-50">
                            {applying
                                ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                                : <><ChevronRight size={13} /> Submit Application</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}

    {successJob && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-2 border-[#1a0a2e] rounded-2xl p-4 flex items-start gap-3 max-w-xs animate-bounce-in">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle size={16} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-[#0a0a0a]">Application Submitted!</p>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{successJob.title} at {successJob.company}</p>
            </div>
            <button onClick={() => setSuccessJob(null)}>
                <X size={12} className="text-gray-400 hover:text-gray-700" />
            </button>
        </div>
    )}

</div>
);
};

export default JobFeed;