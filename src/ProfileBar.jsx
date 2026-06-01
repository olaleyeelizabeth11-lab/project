import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PROFILE_STEPS = [
    { key: 'firstName',  label: 'First name' },
    { key: 'lastName',   label: 'Last name' },
    { key: 'email',      label: 'Email address' },
    { key: 'bio',        label: 'Bio / About you' },
    { key: 'phone',      label: 'Phone number' },
    { key: 'location',   label: 'Location' },
    { key: 'resumeUrl',  label: 'Resume / CV uploaded' },
    { key: 'photoUrl',   label: 'Profile photo' },
    { key: 'skills',     label: 'Skills added' },
];
const ProfileBar = () => {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    useEffect(() => {
        if (!userId) return;
        axios.get(`https://proback-ops7.onrender.com/user/profile/${userId}`)
            .then(res => setUser(res.data))
            .catch(err => console.error(err));
    }, [userId]);

    if (!user) return null;
    const steps = PROFILE_STEPS.map(step => ({
        ...step,
        done: step.key === 'skills'
            ? user.skills?.length > 0
            : Boolean(user[step.key])
    }));

    const completedCount = steps.filter(s => s.done).length;
    const percentage = Math.round((completedCount / steps.length) * 100);

    const barColor = percentage < 40
        ? 'bg-red-400'
        : percentage < 70
        ? 'bg-yellow-400'
        : 'bg-emerald-500';
  return (
    <>
     <div className="bg-white border-2 border-[#1a0a2e] rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(26,10,46,1)] mb-6">
            
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-sm font-extrabold text-[#0a0a0a]">Profile Completion</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {percentage < 100
                            ? `Complete your profile to get better job matches`
                            : `Your profile is 100% complete 🎉`}
                    </p>
                </div>
                <span className={`text-2xl font-extrabold ${
                    percentage < 40 ? 'text-red-500' 
                    : percentage < 70 ? 'text-yellow-500' 
                    : 'text-emerald-500'}`}>
                    {percentage}%
                </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-[#f0e8ff] rounded-full overflow-hidden mb-5">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Step checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                {steps.map(step => (
                    <div key={step.key} className="flex items-center gap-2">
                        {step.done
                            ? <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                            : <Circle size={15} className="text-gray-300 flex-shrink-0" />
                        }
                        <span className={`text-xs font-mono ${
                            step.done ? 'text-gray-400 line-through' : 'text-[#1a0a2e] font-bold'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            {percentage < 100 && (
                <button
                    onClick={() => navigate(`/user-profile/${userId}`)}
                    className="flex items-center gap-1 bg-[#6B21A8] hover:bg-[#5b1890] text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(26,10,46,1)] transition-all"
                >
                    Complete your profile <ChevronRight size={13} />
                </button>
            )}
        </div>

    </>
  )
}

export default ProfileBar