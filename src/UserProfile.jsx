// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, CheckCircle } from 'lucide-react';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', bio: '',
    phone: '', location: '', photoUrl: '', resumeUrl: '', skills: []
  });

  useEffect(() => {
    axios.get(`https://proback-ops7.onrender.com/user/profile/${id}`)
      .then(r => setForm({
        firstName: r.data.firstName || '',
        lastName:  r.data.lastName  || '',
        bio:       r.data.bio       || '',
        phone:     r.data.phone     || '',
        location:  r.data.location  || '',
        photoUrl:  r.data.photoUrl  || '',
        resumeUrl: r.data.resumeUrl || '',
        skills:    r.data.skills    || [],
      }))
      .catch(console.error);
  }, [id]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
    }
    setSkillInput('');
  };

  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter(x => x !== s) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`https://proback-ops7.onrender.com/user/profile/${id}`, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'firstName', label: 'First Name',    type: 'text',  placeholder: 'Jane' },
    { name: 'lastName',  label: 'Last Name',     type: 'text',  placeholder: 'Doe' },
    { name: 'phone',     label: 'Phone Number',  type: 'text',  placeholder: '+234 800 000 0000' },
    { name: 'location',  label: 'Location',      type: 'text',  placeholder: 'Lagos, Nigeria' },
    { name: 'photoUrl',  label: 'Profile Photo URL', type: 'text', placeholder: 'https://...' },
    { name: 'resumeUrl', label: 'Resume / CV Link',  type: 'text', placeholder: 'Google Drive or Dropbox link' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ff] font-sans p-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate('/user-dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-[#6B21A8] hover:underline mb-6"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl shadow-[6px_6px_0px_#1a0a2e] overflow-hidden">

          {/* Header */}
          <div className="bg-[#6B21A8] px-8 py-6 relative overflow-hidden">
            <div className="absolute w-32 h-32 rounded-full border-[20px] border-white/10 -top-10 -right-10 pointer-events-none" />
            <h1 className="text-xl font-extrabold text-white">Complete Your Profile</h1>
            <p className="text-xs text-white/70 mt-1">A complete profile gets 3× more recruiter views</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {/* Name + basic fields grid */}
            <div className="grid grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.name} className={f.name === 'resumeUrl' || f.name === 'photoUrl' ? 'col-span-2' : ''}>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handle}
                    placeholder={f.placeholder}
                    className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 px-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                Bio / About You
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handle}
                rows={3}
                placeholder="Tell recruiters a bit about yourself, your experience and what you're looking for..."
                className="w-full bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 px-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a0a2e] font-bold mb-1.5">
                Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g. React, Node.js, Figma..."
                  className="flex-1 bg-[#f8f5ff] border-2 border-[#e2d4f5] rounded-xl py-2.5 px-3 text-sm text-[#0a0a0a] placeholder-[#9d75c7] focus:outline-none focus:border-[#6B21A8] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="w-10 h-10 bg-[#6B21A8] hover:bg-[#5b1890] rounded-xl flex items-center justify-center text-white shadow-[2px_2px_0px_#1a0a2e] transition-all flex-shrink-0"
                >
                  <Plus size={16} />
                </button>
              </div>
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.skills.map(s => (
                    <span key={s} className="flex items-center gap-1.5 bg-[#f0e8ff] border border-[#c4a0e8] text-[#6B21A8] text-[11px] font-bold font-mono px-3 py-1 rounded-lg">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#6B21A8] hover:bg-[#5b1890] text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-[3px_3px_0px_#1a0a2e] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1a0a2e] disabled:opacity-50"
              >
                <Save size={15} />
                {loading ? 'Saving...' : 'Save Profile'}
              </button>

              {saved && (
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                  <CheckCircle size={14} /> Saved successfully!
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}