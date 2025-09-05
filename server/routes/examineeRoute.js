const sendEmail = require('../utils/sendEmail');
const Examinee = require('../models/Examinee');
// const User=require('../models/Examinee');
const express = require('express');
// const { route } = require('./examinationRoutes');
const ExamAttempted = require('../models/ExamAttempted');
const router = express.Router();

router.get('/', async (req, res) => {
  const examinee = await Examinee.find();
  return res.json({ data: examinee })
})
router.post('/', async (req, res) => {
  const { email, name } = req.body;
  const existingExaminee = await Examinee.findOne({
    email:email
  });
  if(existingExaminee){
    return res.status(400).json({message:'Examinee with this email alredy exist'});
  }
  const examinee = new Examinee(req.body);
  await examinee.save();
  res.json({ message: "You are registered Successfully" });
  const html = `
  <div style="font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #e3f2fd, #ffffff); padding: 40px;">
    <div style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
     
      <!-- Header -->
      <div style="background: linear-gradient(90deg, #007bff, #00c6ff); padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎓 Welcome to Softpro!</h1>
      </div>
     
      <!-- Body -->
      <div style="padding: 30px;">
        <p style="font-size: 18px; color: #333;"><strong>Dear ${name},</strong></p>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          We're excited to welcome you to the <strong>Softpro Exam Prep</strong>! Your registration was successful, and your account is now active.
        </p>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          You can now log in to access your dashboard, take exams, track your progress, and explore learning resources.
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://localhost:5000/login&quot; style="background: #007bff; color: #fff; padding: 12px 24px; font-size: 16px; border-radius: 6px; text-decoration: none; display: inline-block;">
            🔐 Log in to Your Account
          </a>
        </div>

        <p style="font-size: 16px; color: #555;">
          If you have any questions or face issues logging in, feel free to contact our support team.
        </p>

        <p style="margin-top: 30px; font-size: 16px; color: #333;">
          Best regards,<br>
          <strong>Team Softpro</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #777;">
        This is an automated message. Please do not reply to this email.
      </div>
    </div>
  </div>
`;
  setTimeout(async () => {
    await sendEmail(email, "Welcome to the Exam Portal", html);
  }, 100)
})

router.delete('/:id', async (req, res) => {
  try {
    await Examinee.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Delete failed" });
  }
});

//Update
router.put('/:id', async (req, res) => {
  try {
    await Examinee.findByIdAndUpdate(req.params.id, req.body);
    return res.json({ message: "Updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Update failed" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const examinee = await Examinee.findOne({ email: email });
    if (!examinee) {
      return res.status(400).json({ message: "Your Email Incorrect" });
    }

    if (examinee.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.json({
      message: "Login Successfully",
      user: {
        email: examinee.email,
        role: "user",
        id: examinee._id.toString() // ensure it's a string
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/change/:id', async (req, res) => {
  const { op, np, cnp, } = req.body;

  const examinee = await Examinee.find({ _id: req.params.id });
  if (!examinee) {
    return res.json({ message: "old password is incorect" });
  }
  if(examinee[0].password != op){
    return res.json({message:"password change successfuly"})
  }
  if(np!= cnp){
    return res.json({message:"new password and confirm password do not match"});
  }
  try{
    const updatedExaminee = await Examinee.findByIdAndUpdate(
      req.params.id,
      {password:np},
      {new:true}
    );
  }
  catch(err){
    console.error("Error updating password:",err);
    return res.status(500).json({message:"server error while changing password"});
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
    res.status(500).json({ error: error.message });
  }
});

router.get('/examinee-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const attempts = await ExamAttempted.find({ examineeId: userId });

    const totalExams = attempts.length;
    const examsPassed = attempts.filter(a => a.status === 'Passed').length;
    const examsFailed = totalExams - examsPassed;
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);

    res.json({ totalExams, examsPassed, examsFailed, totalScore });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});



router.get('/profile/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const examinee = await Examinee.findById(userId);
    if (!examinee) return res.status(404).json({ error: "User not found" });

    const attempts = await ExamAttempted.find({ examineeId: userId });

    console.log("Attempts:", attempts); // DEBUG line

    const totalExams = attempts.length;
    const examsPassed = attempts.filter(a => a.status === "Passed").length; // ✅ fixed field name
    const examsFailed = attempts.filter(a => a.status === "Failed").length; // ✅ fixed field name
    const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);

    res.json({
      name: examinee.name,
      email: examinee.email,
      phone: examinee.phone || "Not Available",
      stats: {
        totalExams,
        examsPassed,
        examsFailed,
        totalScore
      }
    });

  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});




module.exports = router;