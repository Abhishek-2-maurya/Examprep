const express = require("express");

const router = express.Router();
const Session = require("../models/Session");



router.post('/', async (req, res) => {
    try {
        const session = new Session(req.body);
        await session.save();
        return res.json({ message: "Session added successfully" });
    } catch (err) {
        console.error("Error saving session:", err);
        return res.status(500).json({ error: "Failed to save session" });
    }
});

router.get('/',async(req,res)=>{
    const session = await Session.find();
    return res.json({data:session})
});
// router.delete('/',async(req,res)=>{
// const {id} = req.params
// const session = await Session.findByIdAndDelete(id)
// return res.json({messege:"Delete Successfully"});
// }
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Session.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});
router.put('/:id',async(req,res)=>{
  const {id}=req.params
  const session=await Session.findByIdAndUpdate(id,req.body)
  return res.json({message:"updated successfulyy"});
})
module.exports = router;
