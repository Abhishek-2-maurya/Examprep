
import React, { useEffect, useState } from 'react';

import axios from 'axios';

const ExamResultsDeclaration = ({ exams }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleDeclare = async (examResultId) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await axios.post(`http://localhost:5000/api/exams/result/${examResultId}`);
      setMessage({ type: 'success', text: response.data.message });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to declare result' });
    } finally {
      setLoading(false);
    }
  };
  const [data, setData] = useState([]);
  const handlefetch = async () => {
    const res = await axios.get('http://localhost:5000/api/exams/examination')
    setData(res.data.message);
    console.log(res)
  }
  useEffect(() => {
    handlefetch();
  }, [])
  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">Exam Results Declaration</h2>
      {message && (
        <div className={alert `alert-${message.type === 'success' ? 'success' : 'danger'}`}>
          {message.text}
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
              <th>Exam Name</th>
              <th>Exam Date</th>
              <th style={{ minWidth: '120px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((examResult, idx) => (
                <tr key={examResult._id}>
                  <td>{idx + 1}</td>
                  <td>{examResult.examId?.title || 'N/A'}</td>
                  <td>{examResult.examId?.date ? new Date(examResult.examId.date).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleDeclare(examResult._id)}
                      disabled={loading}
                    >
                      {loading ? 'Declaring...' : 'Declare'}
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default ExamResultsDeclaration;