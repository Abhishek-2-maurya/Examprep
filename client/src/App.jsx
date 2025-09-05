import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import Session from './admin/Session';
import Subject from './admin/Subject';
import UserDashboard from './user/UserDashboard';
import Examinee from './admin/Examinee';
import QuestionBank from './admin/QuestionBank';
import Examination from './admin/Examination';
import RepoartGeneration from './admin/RepoartGeneration';
import ExamResultDeclaration from './admin/ExamResultDeclaration'; // ✅ Add this line

import AdminContactUs from './admin/AdminContactUs';
import UserContactUs from './user/UserContactUs';
import MyExam from './user/MyExam';
import Result from './user/Result';
import UserChangePassword from './user/UserChangePassword';
import AdminChangePassword from './admin/AdminChangePassword';
import GetExam from './user/GetExam';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/user" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/adlogin" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />}>
          <Route index element={<div style={{ color: "white" }}>Welcome Admin 👋</div>} />
          <Route path="session" element={<Session />} />
          <Route path="subject" element={<Subject />} />
          <Route path="examinee" element={<Examinee />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path='examination' element={<Examination />} />
          <Route path='repoart-generation' element={<RepoartGeneration />} />
          <Route path='result-declaration' element={<ExamResultDeclaration />} />
          <Route path='contactus' element={<AdminContactUs />} />
          <Route path='change-password' element={<AdminChangePassword />} />
        </Route>

        {/* User Routes */}
        <Route path="/" element={<UserDashboard />}>
          <Route index element={null} /> {/* You can leave this or remove it */}
          <Route path="myexam" element={<MyExam />} />
          <Route path="result" element={<Result />} />
          <Route path="contactus" element={<UserContactUs />} />
          <Route path="changepassword" element={<UserChangePassword />} />
          <Route path="getexam/:id" element={<GetExam />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
