const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const url = 'mongodb://localhost:27017/examprep';
mongoose.connect(url)
  .then(() => {
    console.log("successfully connected");
  })
  .catch((err) => {
    console.error(err);
  });

// Routes
app.use('/api/session', require('./routes/sessionRoute'));
app.use('/api/subject', require('./routes/subjectRoutes'));
app.use('/api/exams', require('./routes/examinationRoutes'));
app.use('/api/question', require('./routes/questionRoutes'));
app.use('/api/examinee', require('./routes/examineeRoute'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoute')); 
app.use('/api/admin', require('./routes/adminDashRoute'));



app.listen(5000, () => {
  console.log("server connect on http://localhost:5000");
});
