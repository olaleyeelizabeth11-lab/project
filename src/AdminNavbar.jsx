import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/admin-login");
    };

    return (
        <nav className="bg-slate-950/90 backdrop-blur-md border-b border-emerald-500/20 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/admin-dashboard" className="text-2xl font-bold text-emerald-400">
                JobPortal <span className="text-xs border border-emerald-500 px-2 py-0.5 rounded ml-2 uppercase tracking-widest">Admin</span>
            </Link>
            
            <div className="flex items-center gap-8 text-slate-300 font-medium">
                <Link to="/admin-dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
                <Link to="/post-job" className="hover:text-emerald-400 transition-colors">Post a Job</Link>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;