import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Examination = () => {
  const [formData, setFormData] = useState({
    examName: '',
    date: '',
    time: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    sessionId: '',
    status: 'Scheduled',
    questionDistribution: [{ subject: '', numberOfQuestions: '' }],
  });
  const [createdExams, setCreatedExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const fetchExams = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/exams/exams');
      setCreatedExams(res.data || []);
    } catch (err) {
      console.error('Failed to fetch created exams:', err);
      setError('Error fetching created exams');
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes, sessionRes] = await Promise.all([
          axios.get('http://localhost:5000/api/subject'),
          axios.get('http://localhost:5000/api/session'),

        ]);
        setSubjects(subjectRes.data.data || []);
        setSessions(sessionRes.data.data || []);
        fetchExams();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load subjects or sessions');
      }
    };

    fetchData();

  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };


  const handleQuestionDistChange = (index, e) => {
    const updated = [...formData.questionDistribution];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, questionDistribution: updated });
    setError('');
  };

  const addDistributionField = () => {
    setFormData({
      ...formData,
      questionDistribution: [
        ...formData.questionDistribution,
        { subject: '', numberOfQuestions: '' },
      ],
    });
  };

  const removeDistributionField = (index) => {
    if (formData.questionDistribution.length === 1) {
      setError('At least one subject is required');
      return;
    }
    const updated = [...formData.questionDistribution];
    updated.splice(index, 1);
    setFormData({ ...formData, questionDistribution: updated });
  };

  const validateForm = () => {
    if (
      !formData.examName ||
      !formData.date ||
      !formData.time ||
      !formData.duration ||
      !formData.totalMarks ||
      !formData.passingMarks ||
      !formData.sessionId
    ) {
      return 'All fields are required';
    }
    if (parseInt(formData.passingMarks) > parseInt(formData.totalMarks)) {
      return 'Passing marks cannot exceed total marks';
    }
    if (
      formData.questionDistribution.some(
        (dist) =>
          !dist.subject ||
          !dist.numberOfQuestions ||
          parseInt(dist.numberOfQuestions) <= 0
      )
    ) {
      return 'All question distributions must have a valid subject and number of questions';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (formData._id) {
        // Update existing exam
        await axios.put(`http://localhost:5000/api/exams/${formData._id}`, formData);
        alert('Exam Updated Successfully');
      } else {
        // Create new exam
        await axios.post('http://localhost:5000/api/exams', formData);
        alert('Exam Created Successfully');
      }

      await fetchExams(); // Refresh the exam list

      // Reset the form
      setFormData({
        examName: '',
        date: '',
        time: '',
        duration: '',
        totalMarks: '',
        passingMarks: '',
        sessionId: '',
        status: 'Scheduled',
        questionDistribution: [{ subject: '', numberOfQuestions: '' }],
        _id: undefined, // Important: reset _id after update
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.error || 'Error submitting form');
    }
  };



  const handleDelete = async (examId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this exam?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/exams/${examId}`);
      alert("Exam deleted successfully");
      await fetchExams();
    } catch (err) {
      console.error("Error deleting exam:", err);
      setError("Failed to delete exam");
    }
  };

 const handleEdit = (exam) => {
  setFormData({
    examName: exam.title || '', // title ka use karein
    date: exam.date?.slice(0, 10),
    time: exam.time,
    duration: exam.duration,
    totalMarks: exam.totalMarks,
    passingMarks: exam.passingMarks,
    sessionId: exam.sessionId?._id || '',
    status: exam.status || 'Scheduled',
    questionDistribution: exam.questionDistribution.length
      ? exam.questionDistribution.map((qd) => ({
          subject: qd.subject?._id || qd.subject,
          numberOfQuestions: qd.questionCount || qd.numberOfQuestions // ensure dono handle ho
        }))
      : [{ subject: '', numberOfQuestions: '' }],
    _id: exam._id,
  });
};



  return (
    <div className="exam-form-container mt-5">
      <h3 className="h2">Create Examination</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="exam-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Exam Name</label>
            <input
              type="text"
              className="form-control"
              name="examName"
              value={formData.examName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Marks</label>
            <input
              type="number"
              className="form-control"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Passing Marks</label>
            <input
              type="number"
              className="form-control"
              name="passingMarks"
              value={formData.passingMarks}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-control"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input
              type="number"
              className="form-control"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Session</label>
            <select
              className="form-select"
              name="sessionId"
              value={formData.sessionId}
              onChange={handleChange}
              required
            >
              <option value="">Select Session</option>
              {sessions.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <hr />
        <h5>Question Distribution</h5>
        {formData.questionDistribution.map((item, index) => (
          <div className="form-row" key={index}>
            <div className="form-group mt-3" style={{ flex: 2 }}>
              <select
                className="form-select"
                name="subject"
                value={item.subject}
                onChange={(e) => handleQuestionDistChange(index, e)}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3" style={{ flex: 1 }}>
              <input
                type="number"
                className="form-control"
                name="numberOfQuestions"
                placeholder="No. of Questions"
                value={item.numberOfQuestions}
                onChange={(e) => handleQuestionDistChange(index, e)}
                min="1"
                required
              />
            </div>

            <button
              type="button"
              className="btn btn-danger mybtn mt-3 mb-4"
              onClick={() => removeDistributionField(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <div className="row_2">
          <div className="form-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addDistributionField}
            >
              + Add Subject
            </button>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Create Exam
            </button>
          </div>
        </div>
      </form>

      <hr />
      <h3 className="mt-5 mb-3">Created Exams</h3>
      <table className="custom-table">
        <thead className='table-light'>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Session</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {createdExams.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No exams created yet</td>
            </tr>
          ) : (
            createdExams.map((exam, index) => (
              <tr key={exam._id}>
                <td>{index + 1}</td>
                <td>{exam.title || exam.examName}</td>
                <td>{new Date(exam.date).toLocaleDateString()}</td>
                <td>{exam.time}</td>
                <td>{exam.status}</td>
                <td>{exam.sessionId?.name || '-'}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(exam._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="delete-btn-2"
                    onClick={() => handleEdit(exam)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
};

export default Examination;
