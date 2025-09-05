import React, { useState } from 'react'
import axios from "axios";
import "../style/Login.css"
import { useEffect } from 'react';

const Session = () => {
  const [form, setForm] = useState({
    name: '',
    description: ''
  })
  const [data, setData] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => (
      { ...prev, [name]: value }
    ));
    // console.log(form);

  }

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editForm){
        const res = await axios.put(`http://localhost:5000/api/session/${id.id}`, form);
          if (res) {
        alert('Session updated successfully');
      }
      handlefetch();
      }else{
        const res = await axios.post('http://localhost:5000/api/session', form);
        if (res) {
          alert('Session added successfully');
        }
        handlefetch();
      }
    }
    catch (er) {
      alert('sorry');
    }
  }

  const handlefetch = async () => {
    const res = await axios.get('http://localhost:5000/api/session')
    setData(res.data.data);
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/session/${id}`);
      alert("Session deleted");
      handlefetch();
    } catch (err) {
      alert("Delete failed");
    }
  };
//handle edit
const [editForm,setEditForm]=useState(null);
const [id, setId] = useState({
  id:'',
})


const handleEdit=async(item)=>{
  setForm(
    {
      name:item.name,
      description:item.description
    }
  )
  setId({
    id:item._id
  })
  setEditForm(true);
  console.log(form);
}

  useEffect(() => {
    handlefetch();
  }, [])
  return (
    <div className="container-box">
      <div className="form-container">
        <form method="Post" onSubmit={handleSubmit}>
          <h2 className="form-title">Add Session</h2>

          <div className="form-group-s mb-3">
            <input type="text" name="name" className="input-field" placeholder="Session Name" onChange={handleChange} value={form.name} />
          </div>

          <div className="form-group-s mb-3">
            <textarea name='description' className="input-field" placeholder="Description"  value={form.description}onChange={handleChange} ></textarea>
          </div>

          <button className="submit-button">Add Session</button>
        </form>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Action</th>


          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.createdAt}</td>
              <td className='tdbutton' >
              <button className='delete-btn' onClick={() => handleDelete(item._id)}>Delete</button>
              <button className='delete-btn-2' onClick={() => handleEdit(item)}>Edit</button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>

    </div>
  )
}

export default Session;