const Question = require('../models/Question');
const express = require("express");
const router = express.Router();

router.post('/',async(req,res)=>{
  const question = await new Question(req.body);
  question.save();
  return res.status(200).json("Api called successfully");
})

router.get('/',async(req,res)=>{
    const question=await Question.find().populate('subject');
    return res.json({data:question})
    // return res.json("Api Called successfully");
})

router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ error: "Failed to delete question" });
  }
});


router.put('/:id', async (req, res) => {
  const {id}=req.params
    const question=await Question.findByIdAndUpdate(id,req.body)
    return res.json({message:"updated successfulyy"});
});

module.exports = router
