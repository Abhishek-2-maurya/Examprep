import React from 'react'
import { Link } from 'react-router';
import { FaUser, FaLock } from "react-icons/fa";
import "../style/Login.css";
import axios from 'axios';
import { useState } from 'react';
const AdminLogin = () => {
    const [form , setForm] = useState({
        email:"",
        password:"",
    });
    const handleChange = (e)=>{
        // console.log(e.target.value)
        const {name,value} = e.target;
        setForm((prev)=>({...prev,[name]:value}));
        // console.log(form);
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
      try
      {
          const res = await axios.post('http://localhost:5000/api/admin/login',form);
         console.log(res);
         
        if(res.data.message == "Login Successfully"){
            localStorage.setItem("role",res.data.admin.role);
            localStorage.setItem("email",res.data.admin.email);
            window.location.href = '/admin';
        }else{
            window.alert("your email or password are incorrect");
        }
      }catch{
        alert("Your Username password incorrect")
      }
    }
  return (
    <div className="login-container d-flex justify-content-center align-items-center">
            <div className="login-box">
                <div className="login-form-section">
                    <h2 className="text-white mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group position-relative mb-4">
                           <FaUser className="input-icon icon" />
                            <input
                                type="email"
                                name="email"
                                className="form-control input-field"
                                placeholder="Username"
                                onChange={handleChange}
                            />
                            
                        </div>
                        <div className="form-group position-relative mb-4">
                            <input
                                type="password"
                                name="password"
                                className="form-control input-field"
                                placeholder="Password"
                                onChange={handleChange}

                            />
                            <FaLock className="input-icon" />
                        </div>
                        <button className="btn btn-login w-100 mb-3" type='submit'>Login</button>
                        <p className="text-white">
                            Don't have an account? <Link to="/register">Sign Up</Link>
                        </p>
                    </form>
                </div>
                <div className="login-info-section">
                    <h3>WELCOME BACK!</h3>
                    <p>Please log in.., "Sign in to your account.., and "log in to get started.."</p>
                </div>
            </div>
        </div>
  )
}

export default AdminLogin