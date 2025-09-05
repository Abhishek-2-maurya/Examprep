import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminContactUs = () => {
  const [questions, setQuestions] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
      setQuestions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleReplyClick = (id, currentReply) => {
    setReplyingId(id);
    setReplyText(currentReply || "");
  };

  const handleReplySubmit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/contact/${id}/reply`, {
        reply: replyText,
      });
      setReplyingId(null);
      setReplyText("");
      fetchMessages(); // Refresh
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`);
      fetchMessages();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="admin-container">
      <h2>Examinee Questions</h2>
      <table className="contact-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Question</th>
            <th>Reply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q._id}>
              <td>{q.email}</td>
              <td>{q.message}</td>
              <td>{q.reply || "No reply yet"}</td>
              <td>
                <button onClick={() => handleReplyClick(q._id, q.reply)}>Reply</button>
                <button onClick={() => handleDelete(q._id)}>Delete</button>
                {replyingId === q._id && (
                  <div className="reply-box">
                    <textarea
                      rows="3"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                    />
                    <button onClick={() => handleReplySubmit(q._id)}>Send</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminContactUs;
