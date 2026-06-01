import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const ViewApplicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await axios.get(`https://proback-ops7.onrender.com/applications/job/${jobId}`);
                setApplicants(response.data.applicants);
            } catch (error) {
                console.error("Error fetching applicants");
            }
        };
        fetchApplicants();
    }, [jobId]);

    const updateStatus = async (appId, newStatus) => {
        try {
            await axios.put(`https://proback-ops7.onrender.com/applications/status/${appId}`, { status: newStatus });
            alert(`Candidate has been ${newStatus}!`);
            // Refresh the list
            setApplicants(applicants.map(app => app._id === appId ? { ...app, status: newStatus } : app));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    return (
<div className="min-h-screen bg-slate-950 text-white">
<AdminNavbar />
<div className="max-w-5xl mx-auto p-10">
<h2 className="text-3xl font-bold text-emerald-400 mb-6">Job Applicants</h2>

<div className="grid gap-4">
    {applicants.length > 0 ? applicants.map((app) => (
        <div key={app._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-white">
                    {app.applicant?.firstName} {app.applicant?.lastName}
                </h3>
                <p className="text-slate-400">{app.applicant?.email}</p>
                <p className="text-xs text-slate-500 mt-2 font-mono">ID: {app._id}</p>
            </div>

            <div className="flex gap-3">
                {app.status === "Pending" ? (
                    <>
                        <button 
                            onClick={() => updateStatus(app._id, "Accepted")}
                            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-bold transition-all"
                        >
                            Offer Job (Accept)
                        </button>
                        <button 
                            onClick={() => updateStatus(app._id, "Rejected")}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                            Decline
                        </button>
                    </>
                ) : (
                    <span className={`px-4 py-2 rounded-lg font-bold ${app.status === 'Accepted' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {app.status}
                    </span>
                )}
            </div>
        </div>
    )) : (
        <p className="text-slate-500 text-center mt-10">No one has applied for this position yet.</p>
    )}
</div>
</div>
</div>
);
};

export default ViewApplicants;