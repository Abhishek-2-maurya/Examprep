import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/login.css"
const Examinee = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    address: '',
    college: '',
    qualification: ''
  });

  
  
  const handleFetch = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/examinee');
      setData(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/examinee/${id}`);
      handleFetch(); 
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      name: item.name,
      email: item.email,
      number: item.number,
      address: item.address,
      college: item.college,
      qualification: item.qualification,
    });
  };

  // Submit edit
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/examinee/${editId}`, formData);
      setEditId(null);
      handleFetch();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div>
      {editId && (
        <div className="edit-form">
          <h3>Edit Examinee</h3>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input name="number" value={formData.number} onChange={handleChange} placeholder="Number" />
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
          <input name="college" value={formData.college} onChange={handleChange} placeholder="College" />
          <input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification" />
          <button onClick={handleUpdate}>Update</button>
        </div>
      )}

      <table className="custom-table">
        <thead className="table-light">
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Number</th>
            <th>Address</th>
            <th>College</th>
            <th>Qualification</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.number}</td>
              <td>{item.address}</td>
              <td>{item.college}</td>
              <td>{item.qualification}</td>
              <td>
                <div className="box-btn">
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                <button className="delete-btn-2" onClick={() => handleEdit(item)}>Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Examinee;
