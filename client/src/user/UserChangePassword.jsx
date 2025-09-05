import React, { useState } from "react";
import axios from "axios";


const UserChangePassword = () => {
  const userId = localStorage.getItem("userId");

  const [data, formData] = useState({
    op: "",
    np: "",
    cnp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    formData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (data.np !== data.cnp) {
    //   alert("New password and confirm password do not match.");
    //   return;
    // }

    try {
      const res = await axios.put(`http://localhost:5000/api/examinee/change/${userId}`,data);
     
     if(res){
      alert(res.data.message);
      if(res.data.message == "Password Changed Successfully"){
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        window.location.href = '/user'
      }
     }
  }
  catch(err){
    alert('Sorry Try Again');
    console.log(err);
    
  }
  }
  return (
    <div className="change-password-container">
      <form  method='post'  className="change-password-form" onSubmit={handleSubmit}>
        <h3 className="form-title">Change Your Password</h3>

        <label htmlFor="oldPassword">Old Password</label>
        <input
          type="password"
          name="op"
          id="oldPassword"
          value={data.op}
          onChange={handleChange}
          required
        />

        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          name="np"
          id="newPassword"
          value={data.np}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="cnp"
          id="confirmPassword"
          value={data.cnp}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default UserChangePassword;
