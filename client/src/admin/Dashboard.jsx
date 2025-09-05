import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Outlet, useLocation } from 'react-router';
import { FaBars, FaUser, FaLock, FaFileAlt, FaClipboardList, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isBaseRoute = location.pathname == '/admin';
  const role = localStorage.getItem("role");
  if (role == "admin") {
    var email = localStorage.getItem("email");
  } else {
    window.location.href = '/adlogin'
  }

  const hour = new Date().getHours();
  console.log("Hour:", hour);

  let greeting = "Good Night";

  if (hour >= 4 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }
  const [counts, setCounts] = useState({
    totalExams: 0,
    totalExaminees: 0,
    totalSubjects: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/counts');
        setCounts(res.data);
      } catch (err) {
        console.error('Failed to fetch counts', err);
      }
    };

    fetchCounts();
  }, []);


  return (
    <div className={`dashboard-container ${collapsed ? 'collapsed' : ''}`}>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h4>{collapsed ? 'A' : 'Admin'}</h4>
        </div>
        <ul className="nav-links">
          <li><Link to="session">📅 {!collapsed && 'Session'}</Link></li>

          <li><Link to="subject">📘 {!collapsed && 'Subject'}</Link></li>
          <li><Link to="examinee">🧑‍🎓 {!collapsed && 'Examinee'}</Link></li>
          <li><Link to="question-bank">📝 {!collapsed && 'Question Bank'}</Link></li>
          <li><Link to="examination"><FaClipboardList /> {!collapsed && 'Examination'}</Link></li>
          <li><Link to="repoart-generation"><FaFileAlt /> {!collapsed && 'RepoartGeneration'}</Link></li>
          <li><Link to="result-declaration">🧪 {!collapsed && 'ResultDeclaration'}</Link></li>
          <li><Link to="result"><FaChartBar /> {!collapsed && 'Result'}</Link></li>
          <li><Link to="contactus"><FaChartBar /> {!collapsed && 'AdminContactUs'}</Link></li>
          <li><Link to="change-password"><FaLock /> {!collapsed && 'Change Password'}</Link></li>
          <li><Link onClick={() => {
            localStorage.removeItem('role');
            localStorage.removeItem("email");
            window.location.href = '/adlogin';
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
            <>
              <div className="dashboard-overview">
                <div className="stat-box">
                  <h3>Total Exams</h3>
                  <p>{counts.totalExams}</p>
                </div>
                <div className="stat-box">
                  <h3>Total Examinees</h3>
                  <p>{counts.totalExaminees}</p>
                </div>
                <div className="stat-box">
                  <h3>Total Subjects</h3>
                  <p>{counts.totalSubjects}</p>
                </div>
              </div>

              <div className="recent-exams-box">
                <h3>Recent Exams</h3>
                <ul>
                  <li>Mid Term - 05 Aug 2025</li>
                  <li>Unit Test - 28 July 2025</li>
                  <li>Weekly Quiz - 20 July 2025</li>
                </ul>
              </div>
            </>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

