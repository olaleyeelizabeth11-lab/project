import { Routes, Route } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard'
import AdminRegister from './AdminRegister';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import UserDashboard from './UserDashboard'; 
import JobFeed from './JobFeed';
import MyApplications from './MyApplications';
import AdminApplicants from './AdminApplicants';
import PostJob from './PostJob'
import UserProfile from './UserProfile';
import LandingPage from './LandingPage';
import ViewApplicants from './ViewApplicants'
import AdminPostJob from './AdminPostJob';

function App() {
  return (
    <>
    <Routes>
      {/* LANDING PAGE */}
      <Route path="/" element={<LandingPage />} />
      
      {/* CANDIDATE ROUTES */}
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-register" element={<UserRegister />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/jobs" element={<JobFeed />} />
      <Route path="/my-applications" element={<MyApplications />} />
      <Route path="/user-profile/:id" element={<UserProfile />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-jobs" element={<PostJob />} />
      <Route path="/admin-applicants" element={<AdminApplicants />} />
      <Route path="/admin-post-job" element={<AdminPostJob />} />
      <Route path="/view-applicants/:jobId" element={<ViewApplicants />} />
    </Routes>
    </>
  );
}

export default App;