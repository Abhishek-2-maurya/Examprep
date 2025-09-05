
import React, { useState ,useEffect} from 'react'
import "../style/Login.css"
import axios from 'axios'
const Subject = () => {

  const [form, setForm] = useState({
    name: '',
    description: ''
  })

  const [data, setData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editForm){
        const res = await axios.put(`http://localhost:5000/api/subject/${id.id}`, form);
        if (res) {
        alert('Subject updated successfully');
      }
      handlefetch();
      }else{
        const res = await axios.post('http://localhost:5000/api/subject', form);
        if (res) {
          alert('Subject added successfully');
        }
        handlefetch();
      }
    }
    catch (er) {
      alert('sorry');
    }
  }


  const handlefetch = async () => {
    const res = await axios.get('http://localhost:5000/api/subject')
    setData(res.data.data);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => (
      { ...prev, [name]: value }
    )
    )
    // console.log(form);

  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/subject/${id}`);
      alert("Subject deleted");
      handlefetch();
    } catch (err) {
      alert("Delete failed");
    }
  };

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
      <form method="Post" onSubmit={handleSubmit}>
        <div className="form-container">
          <h2 className="form-title">Subject</h2>

          <div className="form-group-s mb-3">
            <input type="text" name='name' className="input-field" placeholder="Session Name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group-s mb-3">
            <textarea className="input-field" name='description' placeholder="Description" value={form.description} onChange={handleChange}></textarea>
          </div>
          <button className="submit-button">Add Subject</button>
        </div>
      </form>

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
              <td className='tdbutton'>
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

export default Subject