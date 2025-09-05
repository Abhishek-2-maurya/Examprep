import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Result = () => {
  const [data, setData] = useState([]);
  const userId = localStorage.getItem('userId');

  const handlefetch = async () => {
    const res = await axios.get(`http://localhost:5000/api/exams/examinee-result/${userId}`);
    console.log(res.status);
    setData(Array.isArray(res.data.message) ? res.data.message : [res.data.message]);
  };

  useEffect(() => {
    handlefetch();
  }, []);

  return (
    <div>
      <table className="custom-table">
        <thead className="table-light">
          <tr style={{ color: "#00f5ff" }}>
            <th>S.N</th>
            <th>Exam name</th>
            <th>Your Name</th>
            <th>Total Marks</th>
            <th>Score</th>
            <th>Passing Marks</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ color: 'white' }}>No results</td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={item._id || i}>
                <td>{i + 1}</td>
                <td>{item.examId?.title || 'N/A'}</td>
                <td>{item.examineeId?.name || item.examineeId || 'N/A'}</td>
                <td>{item.totalMarks}</td>
                <td>{item.score}</td>
                <td>{item.passingMarks}</td>
                <td>{item.status}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Result;
