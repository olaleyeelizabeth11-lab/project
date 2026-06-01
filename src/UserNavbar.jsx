import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear the session
        navigate("/user-login");
    };

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/user-dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                JobPortal
            </Link>
            
            <div className="flex items-center gap-8 text-slate-300 font-medium">
                <Link to="/user-dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
                <Link to="/jobs" className="hover:text-blue-400 transition-colors">Browse Jobs</Link>
                <Link to="/my-applications" className="hover:text-blue-400 transition-colors">My Apps</Link>
                
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

export default UserNavbar;