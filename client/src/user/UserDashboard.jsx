import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, Outlet, useLocation } from 'react-router';
import {
  FaBars, FaUser, FaLock, FaEnvelope, FaChartBar,
  FaCheck, FaTimes, FaSignOutAlt, FaStar, FaPencilAlt, FaFileAlt
} from 'react-icons/fa';
import '../admin/Dashboard.css';

const UserDashboard = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();
  const isBaseRoute = location.pathname === '/';

  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("userRole");
  if (role !== "user") {
    window.location.href = '/user';
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/examinee/profile/${userId}`);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <h2 style={{ color: "white" }}>Loading profile...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;
  if (!user) return null;

  const hour = new Date().getHours();
  let greeting = "Good Night";
  if (hour >= 4 && hour < 12) greeting = "Good Morning";
  else if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  else if (hour >= 17 && hour < 21) greeting = "Good Evening";

  return (
    <div className={`dashboard-container ${collapsed ? 'collapsed' : ''}`}>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h4>{collapsed ? 'W' : 'Welcome'}</h4>
        </div>
        <ul className="nav-links">
          <li><Link to="myexam"><FaPencilAlt /> {!collapsed && 'MyExam'}</Link></li>
          <li><Link to="result"><FaChartBar /> {!collapsed && 'Result'}</Link></li>
          <li><Link to="contactus"><FaEnvelope /> {!collapsed && 'Contact Us'}</Link></li>
          <li><Link to="changepassword"><FaLock /> {!collapsed && 'Change Password'}</Link></li>
          <li><Link to="#" onClick={() => {
            localStorage.clear();
            navigate('/');
          }}><FaSignOutAlt /> {!collapsed && 'Logout'}</Link></li>
        </ul>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="greetbox">
            <button onClick={() => setCollapsed(!collapsed)} className="toggle-btn">
              <FaBars />
            </button>
            <h1>{greeting}</h1>
          </div>
          <div className="user-image">
            <img src="" alt="User" />
          </div>
        </div>

        <div className="content">
          {isBaseRoute && (
            <div className="profile-container mt-0" style={{ color: "white" }}>
              <div className="profile-card">
                <img
                  src={user.profilePic || "/default-profile.png"}
                  alt="Profile"
                  className="profile-pic"
                />
                <h2 className="username">
                  <FaUser /> {user.name}
                </h2>
                <div className="user-info">
                  <p><FaEnvelope /> {user.email}</p>
                </div>
              </div>

              <div className="stats-container">
                <div className="stat-box">
                  <FaFileAlt className="stat-icon" />
                  <p className="stat-label">Total Exams</p>
                  <p className="stat-value">{user.stats?.totalExams || 0}</p>
                </div>
                <div className="stat-box">
                  <FaCheck className="stat-icon" />
                  <p className="stat-label">Passed</p>
                  <p className="stat-value">{user.stats?.examsPassed || 3}</p>
                </div>
                <div className="stat-box">
                  <FaTimes className="stat-icon" />
                  <p className="stat-label">Failed</p>
                  <p className="stat-value">{user.stats?.examsFailed || 0}</p>
                </div>
                <div className="stat-box">
                  <FaStar className="stat-icon" />
                  <p className="stat-label">Total Score</p>
                  <p className="stat-value">{user.stats?.totalScore || 0}</p>
                </div>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
