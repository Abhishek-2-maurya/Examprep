const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Examinee = require('../models/Examinee');
const Examination = require('../models/Examination');

// GET: Total counts for dashboard
router.get('/counts', async (req, res) => {
  try {
    const totalSubjects = await Subject.countDocuments();
    const totalExaminees = await Examinee.countDocuments();
    const totalExams = await Examination.countDocuments();

    res.json({
      totalSubjects,
      totalExaminees,
      totalExams
    });
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;
