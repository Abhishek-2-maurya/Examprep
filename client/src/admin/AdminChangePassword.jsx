import React, { useState } from "react";
import axios from "axios";

const AdminChangePassword = () => {
  const email = localStorage.getItem("email");

  const [data, setData] = useState({
    op: "",
    np: "",
    cnp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.np !== data.cnp) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/admin/changepassword",
        {
          ...data,
          email,
        }
      );

      alert(response.data.message);
      setData({ op: "", np: "", cnp: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    }
  };

  return (
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleSubmit}>
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

export default AdminChangePassword;
