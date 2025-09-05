import React, { useEffect, useState } from 'react'
import "../style/Login.css"
import { Link, useNavigate } from 'react-router';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome, FaUniversity, FaInfoCircle, FaGraduationCap } from "react-icons/fa";
import axios from 'axios';
// import { Link } from 'react-router';
const Registation = () => {
    const navigate = useNavigate();
  const [formData,setfromData] = useState({
    name:'',
    email:'',
    number:'',
    address:'',
    password:'',
    college:'',
    qualification:'',
    session:'',
  });
  const [sessions,setSessions] = useState([]);
  const handlefetch = async()=>{
    try{
      const res = await axios.get("http://localhost:5000/api/session/");
      //setSession
      // console.log(res.data.data);
       setSessions(res.data.data);
    }
    catch(err){
      console.error(err);
    }
  }

  useEffect(()=>{
    handlefetch();
  },[])

  const handleChange=(e)=>{
    setfromData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };

   const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/examinee',formData);
      alert("Examinee registerred !");
      setfromData({
        name:'',
        email:'',
        number:'',
        address:'',
        password:'',
        college:'',
        qualification:'',
        session:'',
      });
      navigate("/");
    }
    catch(err){
      console.error('Submission error',err);
      alert("Failed to registration");
    }
   } 


  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-box">
        <div className="login-form-section">
          <h2 className="text-white mb-4">Register</h2>
          <form className='form-box' onSubmit={handleSubmit}>
            <div className="form-group position-relative mb-4 ">
              <div className='box-2'>
                <label htmlFor="username" className="form-label reg-label">user name <FaUser className="reg-icon" /></label>
                <input
                  type="text"
                  id="username"
                  name='name'
                  className="form-control input-field"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Username"
                />
              </div>

              <div className='box-2' >
                <label htmlFor="username" className="form-label reg-label">contact <FaPhone className="reg-icon" /></label>
                <input
                  type="text"
                  id="contact"
                  name='number'
                  className="form-control input-field"
                  placeholder="contact"
                  value={formData.number}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group position-relative mb-4">
              <div className='box-2'>
                <label htmlFor="username" className="form-label reg-label">Mail <FaEnvelope className="reg-icon" /></label>
                <input
                  type="Mail"
                  id="Mail"
                  name='email'
                  className="form-control input-field"
                  placeholder="Mail"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className='box-2'>
                <label htmlFor="username" className="form-label reg-label">Password <FaLock className="reg-icon" /></label>
                <input
                  type="Password"
                  id="Password"
                  name='password'
                  className="form-control input-field"
                  placeholder="Password"
                   value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group position-relative mb-4">
              <div className='box-2'>
                <label htmlFor="username" className="form-label reg-label">Address <FaHome className="reg-icon" /></label>
                <input
                  type="text"
                  id="Address"
                  name='address'
                  className="form-control input-field"
                  placeholder="Address"
                   value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className='box-2'>
                <label htmlFor="username" className="form-label reg-label">College <FaUniversity className="reg-icon" /></label>
                <input
                  type="text"
                  id="College"
                  name='college'
                  className="form-control input-field"
                  placeholder="College"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group position-relative mb-4">
              <div className='box-2'>
                <label htmlFor="username" className="form-label reg-label">Qualification <FaGraduationCap className="reg-icon" /></label>
                <input
                  type="text"
                  id="Qualification"
                  name='qualification'
                  className="form-control input-field"
                  placeholder="Qualification"
                   value={formData.qualification}
                  onChange={handleChange}
                />
              </div>

              <div className='box-2' >
                <label htmlFor="status" className="form-label reg-label">Session <FaInfoCircle className="reg-icon" /></label>
                {/* <input
                type="text"
                id="status"                
                className="form-control input-field"
                placeholder="State"
              /> */}
                <select name="session" className="form-control input-field" value={formData.session} onChange={handleChange}>
                  <option className='option' value="">select Session</option>
                  {sessions.map((item)=>(
                    <option className='option' value={item._id} key={item._id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type='submit' className="btn btn-login w-100 mb-3">Sign Up</button>
            <p className="text-white">
              If alrady have an accont <Link to='/'>Login Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Registation;