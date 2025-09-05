import "../style/Login.css";
import React, { useState } from "react";
import { Link } from "react-router";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [data, formData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    formData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {

      e.preventDefault();

      const res = await axios.post("http://localhost:5000/api/examinee/login", data);

     if (res.data && res.data.user && res.data.user.id) {
  localStorage.setItem("userRole", res.data.user.role);
  localStorage.setItem("userEmail", res.data.user.email);
  localStorage.setItem("userId", res.data.user.id);
  window.location.href = '/';
} else {
  setError(res.data.message || "Login failed");
}

      } 

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-box">
        <div className="login-form-section">
          <h2 className="text-white mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group-l position-relative mb-4">
              <input
                type="email"
                name="email"
                className="form-control input-field"
                placeholder="Email"
                onChange={handleChange}
              />
              <FaUser className="input-icon" />
            </div>
            <div className="form-group-l position-relative mb-4">
              <input
                type="password"
                name="password"
                className="form-control input-field"
                placeholder="Password"
                onChange={handleChange}
              />
              <FaLock className="input-icon" />
            </div>
            <button className="btn btn-login w-100 mb-3" type="submit">Login</button>
            <p className="text-white">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </form>
        </div>
        <div className="login-info-section">
          <h3>WELCOME BACK!</h3>
          <p>Please log in... Sign in to your account... and log in to get started...</p>
        </div>
      </div>
    </div>
  );
};


export default Login;
