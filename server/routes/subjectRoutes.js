
const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");


router.post('/', async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        return res.json({ message: "Subject added successfully" });
    } catch (err) {
        console.error("Error saving session:", err);
        return res.status(500).json({ error: "Failed to save Subject" });
    }
});


router.get('/',async(req,res)=>{
    const subject = await Subject.find();
    return res.json({data:subject})
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Subject.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

 router.put('/:id',async(req,res)=>{
      const {id}=req.params
      const subject=await Subject.findByIdAndUpdate(id,req.body)
      return res.json({message:"updated successfulyy"});
    })

module.exports = router;