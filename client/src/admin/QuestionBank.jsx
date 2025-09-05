import React, { useEffect, useState } from 'react'
import axios from "axios";
const QuestionBank = () => {
  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    subject:'',
  });
  const [questions, setQuestions] = useState([]);
  const[subjects,setSubjects]=useState([]);
  const [data, setData] = useState([])

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/question/${editId}`, formData);
        alert("Question updated successfully");
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/question', formData);
        alert("Question added successfully");
      }
      handlefetch();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong");
    }


    setFormData({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      subject:"",
    });
  };

  const handleEdit = (question) => {
  setFormData({
    question: question.question,
    optionA: question.optionA,
    optionB: question.optionB,
    optionC: question.optionC,
    optionD: question.optionD,
    correctAnswer: question.correctAnswer,
  });
  setIsEditing(true);
  setEditId(question._id);
  };

  
  const handlefetch = async () => {
    const res = await axios.get('http://localhost:5000/api/question')
    setData(res.data.data);
    const res1=await axios.get('http://localhost:5000/api/subject')
    setSubjects(res1.data.data)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/question/${id}`);
      alert("Question deleted successfully");
      handlefetch();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete question");
    }
  };


  useEffect(() => {
    handlefetch();
  }, [])
  return (
    <div className="question-form-container">
      <h2 className="form-title">Add a Question</h2>
      <form className="question-form" onSubmit={handleSubmit}>

        {/* Question Textarea */}
        <label htmlFor="question">Question</label>
        <textarea id="question" rows="4" name='question' value={formData.question} onChange={handleChange} placeholder="Enter your question here..."></textarea>

        {/* Option Rows */}
        <div className="option-row">
          <div className="option-item">
            <label htmlFor="option1">Option 1</label>
            <input id="option1" name='optionA' value={formData.optionA} onChange={handleChange} type="text" placeholder="Enter option 1" required />
          </div>
          <div className="option-item">
            <label htmlFor="option2">Option 2</label>
            <input id="option2" name='optionB' value={formData.optionB} onChange={handleChange} type="text" placeholder="Enter option 2" />
          </div>
        </div>

        <div className="option-row">
          <div className="option-item">
            <label htmlFor="option3">Option 3</label>
            <input id="option3" type="text" name='optionC' value={formData.optionC} onChange={handleChange} placeholder="Enter option 3" />
          </div>
          <div className="option-item">
            <label htmlFor="option4">Option 4</label>
            <input id="option4" type="text" name='optionD'
              value={formData.optionD} onChange={handleChange} placeholder="Enter option 4" />
          </div>
        </div>

        <div className="option-row">
          <div className="option-item">
            <label htmlFor="option4">Correct Answer</label>
            <input id="option4" type="text" name='correctAnswer' value={formData.correctAnswer} onChange={handleChange} placeholder="Enter option 4" />
          </div>
          <select  className="option-row" name="subject" value={formData.subject} onChange={handleChange}
          required
          >
            <option value="">Select Subject</option>
            {subjects.map((sub)=>(
              <option key={sub._id} value={sub._id} >
            {sub.name}

              </option>
            ))}

          </select>
          
        </div>
<button type="submit">Submit</button>


      </form>

     <table className="custom-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Question</th>
            <th>Subject</th>
            <th>optionA</th>
            <th>optionB</th>
            <th>optionC</th>
            <th>optionD</th>
            <th>Correct Answer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((q, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{q.question}</td>
              <td>{q.subject?.name}</td>
              <td>{q.optionA}</td>
              <td>{q.optionB}</td>
              <td>{q.optionC}</td>
              <td>{q.optionD}</td>
              <td>{q.correctAnswer}</td>
              <td>
                <div className="btn-box">
                  <button className='delete-btn' onClick={() => handleDelete(q._id)}>Delete</button>
                  <button className='delete-btn-2' onClick={() => handleEdit(q)}>Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default QuestionBank