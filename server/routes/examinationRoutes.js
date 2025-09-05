const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Examination = require('../models/Examination');
const mongoose = require('mongoose');
const Examinee = require('../models/Examinee');
const ExamAttempted = require('../models/ExamAttempted');

// POST: Create a new exam
router.post('/', async (req, res) => {
  console.log("Incoming body:", req.body);

  try {
    const {
      examName,
      date,
      time,
      duration,
      totalMarks,
      passingMarks,
      sessionId,
      status,
      questionDistribution
    } = req.body;

    // Validate required fields
    if (!examName || !date || !time || !duration || !totalMarks || !passingMarks || !sessionId || !questionDistribution) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate sessionId
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: `Invalid session ID: ${sessionId}` });
    }

    const selectedQuestions = [];

    // Validate questionDistribution and fetch questions
    for (const dist of questionDistribution) {
      const { subject, numberOfQuestions } = dist;
      const questionCount = Number(numberOfQuestions); // FIXED: Always convert to number

      if (!mongoose.Types.ObjectId.isValid(subject)) {
        return res.status(400).json({ error: `Invalid subject ID: ${subject}` });
      }

      if (!Number.isInteger(questionCount) || questionCount <= 0) { // FIXED: Strict validation
        return res.status(400).json({ error: `Invalid number of questions for subject: ${subject}` });
      }

      const questions = await Question.aggregate([
        { $match: { subject: new mongoose.Types.ObjectId(subject) } },
        { $sample: { size: questionCount } }
      ]);

      if (questions.length < questionCount) {
        return res.status(400).json({ error: `Not enough questions available for subject: ${subject}` });
      }

      selectedQuestions.push(...questions.map(q => q._id));
    }

    const newExam = new Examination({
      title: examName,
      date,
      time,
      duration,
      totalMarks,
      passingMarks,
      sessionId,
      status: status || 'Scheduled',
      questionDistribution: questionDistribution.map(d => ({
        subject: d.subject,
        questionCount: Number(d.numberOfQuestions) // FIXED: Always save as number
      })),
      questions: selectedQuestions
    });

    const savedExam = await newExam.save();
    res.status(201).json(savedExam);
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// GET: Fetch all exams
router.get('/exams', async (req, res) => {
  try {
    const exams = await Examination.find({}, 'title date time status')
      .populate('sessionId', 'name')
      .populate('questionDistribution.subject', 'name');
    res.json(exams);
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ error: 'Error fetching exams' });
  }
});

// PUT: Update an exam
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `Invalid exam ID: ${id}` });
    }

    const updatedExam = await Examination.findByIdAndUpdate(id, req.body, { new: true })
      .populate('sessionId', 'name')
      .populate('questionDistribution.subject', 'name');

    if (!updatedExam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json(updatedExam);
  } catch (err) {
    console.error('Error updating exam:', err);
    res.status(400).json({ error: 'Error updating exam' });
  }
});

// DELETE: Delete an exam
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `Invalid exam ID: ${id}` });
    }

    const deletedExam = await Examination.findByIdAndDelete(id);
    if (!deletedExam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json({ message: 'Exam deleted successfully' });
  } catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({ error: 'Error deleting exam' });
  }
});

// GET: Fetch questions for a specific exam
router.get('/exam/:examId', async (req, res) => {
  const { examId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ error: `Invalid exam ID: ${examId}` });
    }

    const exam = await Examination.findById(examId)
      .populate('questionDistribution.subject', 'name')
      .populate('questions');
      // console.log(exam);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const allQuestions = [];

    for (const dist of exam.questionDistribution) {
      const subjectId = dist.subject._id;
      const questionCount = Number(dist.questionCount); // FIXED: Ensure numeric

      if (!Number.isInteger(questionCount) || questionCount <= 0) { // FIXED: Validation
        return res.status(400).json({ error: `Invalid question count for subject: ${subjectId}` });
      }

      const questions = await Question.aggregate([
        { $match: { subject: new mongoose.Types.ObjectId(subjectId) } },
        { $sample: { size: questionCount } }
      ]);

      if (questions.length < questionCount) {
        return res.status(400).json({ error: `Not enough questions for subject: ${subjectId}` });
      }

      allQuestions.push(...questions);
    }

    return res.json({
      exam: {
        title: exam.title,
        date: exam.date,
        time: exam.time,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        status: exam.status
      },
      questions: allQuestions
    });
  } catch (err) {
    console.error('Error fetching exam questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/submit-exam', async (req, res) => {
  try {
    const { examId, answers, email } = req.body;

    const examinee = await Examinee.findOne({ email });
    if (!examinee) return res.status(404).json({ error: 'Examinee not found' });

    const exam = await Examination.findById(examId).populate('questions');
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    let score = 0;

    exam.questions.forEach((q) => {
      const qId = q._id.toString();
      if (answers[qId] && answers[qId] === q.correctAnswer) {
        score += q.marks ? Number(q.marks) : 1;
      }
    });

    const passingMarks = Number(exam.passingMarks);

    const attempt = new ExamAttempted({
      examId,
      examineeId: examinee._id,
      answers,
      score,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      status: score >= passingMarks ? 'Passed' : 'Failed',
      resultStatus: 'Completed',
      submittedAt: new Date()
    });

    await attempt.save();

    res.json({
      message: 'Exam submitted successfully',
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      passed: attempt.status === 'Passed'
    });

  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ error: 'Failed to submit exam' });
  }
});

router.get('/report', async (req, res) => {
  try {
    const exams = await ExamAttempted.find()
      .populate('examineeId', 'email')
      .populate('examId', 'title date time');
    console.log(exams)
    const report = exams.map(exam => ({
      examineeEmail: exam.examineeId?.email || 'Unknown',
      examTitle: exam.examId?.title || 'Unknown',
      score: exam.score,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      status: exam.status,
      resultStatus: exam.resultStatus,
      attemptedAt: exam.createdAt
    }));

    res.json(report);
  } catch (err) {
    console.error('Error generating report:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

router.get('/examinee-result/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const results = await ExamAttempted.find({ examineeId: userId })
      .populate('examId')
      .populate('examineeId');

    res.json({ message: results });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;
