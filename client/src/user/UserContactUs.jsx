import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserContactUs = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const email = localStorage.getItem("userEmail");

  // Fetch user messages
  const fetchUserMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/contact/user/${encodeURIComponent(email)}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Send new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message.trim()) {
      return alert("Please enter a message.");
    }

    try {
      await axios.post("http://localhost:5000/api/contact", {
        email,
        message,
      });
      alert("Message sent successfully");
      setMessage('');
      fetchUserMessages(); // Refresh message list
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send message");
    }
  };

  // Delete a message
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contact/user/${id}`);
      setMessages(prev => prev.filter(msg => msg._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete message");
    }
  };

  useEffect(() => {
    if (email) {
      fetchUserMessages();
    } else {
      console.warn("No userEmail found in localStorage.");
    }
  }, []);

  return (
    <div className="contact-container" >
      <h2>Contact Admin</h2>

      <form className="contact-form" onSubmit={handleSubmit} 
      >
        <textarea
          placeholder="Type your question here..."
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="contact-textarea"
          
        />
        <button type="submit" className="submit-btn" >Send</button>
      </form>

      <h3>Your Questions</h3>
      {messages.length === 0 ? (
        <p>No questions submitted yet.</p>
      ) : (
        <ul className="message-list">
          {messages.map((msg) => (
            <li key={msg._id} className="message-item">
              <p><strong>Question:</strong> {msg.message}</p>
              <p><strong>Reply:</strong> {msg.reply || <em>No reply yet</em>}</p>
              <button onClick={() => handleDelete(msg._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserContactUs;
