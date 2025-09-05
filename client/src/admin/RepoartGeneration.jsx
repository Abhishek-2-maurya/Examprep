import React, { useEffect, useState } from 'react'
import axios from 'axios';
const RepoartGeneration = () => {
  const [data, setData] = useState([]);
  const handlefetch = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/exams/report');
      console.log(res.data);
      setData(res.data);
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    handlefetch();
  }, []);

  const handlePrint = () => {

  }
  console.log(data);
  return (
    <table className="custom-table">
      <thead className="table-light">
        <tr>
          <th>S.No</th>
          <th>Exam Name</th>
          <th>Examinee</th>
          <th>Total Marks</th>
          <th>Passing Marks</th>
          <th>Optained</th>
          <th>Status</th>
          <th>DOE</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={item._id}>
            <td>{i + 1}</td>
            <td>{item.examTitle}</td>
            <td>{item.examineeEmail}</td>
            <td>{item.totalMarks}</td>
            <td>{item.passingMarks}</td>
            <td>{item.score}</td>
            <td>{item.status}</td>
            <td>{item.attemptedAt}</td>
            <td>
              <button className='print-btn' onClick={handlePrint}>Print</button>
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  )
}

export default RepoartGeneration