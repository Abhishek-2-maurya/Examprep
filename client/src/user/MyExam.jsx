
import React, { useEffect } from 'react'
import { Link } from 'react-router';
import axios from 'axios';
const MyExam = () => {
  const [exam,setExam] = React.useState([]);
  const fetchExams = async()=>{
    const res = await axios.get('http://localhost:5000/api/exams/exams');
    setExam(res.data);
    console.log(res.data.date)

  }
  useEffect(()=>{
    fetchExams();
  },[])
  
  return (
    <table className="custom-table">
        <thead className="table-light">
          <tr>
            <th>S.No</th>
            <th>Exam Name</th>
            <th>Date of Exam</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
         <tbody>
            {
              exam.map((item,i)=>(
                <tr key={item._id}>
                  <td>{i+1}</td>
                  <td>{item.title}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>
                    <Link to={`/getexam/${item._id}`}>Start Exam</Link>
                  </td>
                </tr>
              )
            )}
         </tbody>
      </table>
  )
}

export default MyExam