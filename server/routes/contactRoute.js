const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

// POST /api/contact
router.post("/", async (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: "Missing fields" });

  try {
    const newMsg = new ContactMessage({ email, message });
    await newMsg.save();
    return res.json({ message: "Message sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save message" });
  }
});

// GET /api/contact
router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// PUT /api/contact/:id/reply
router.put("/:id/reply", async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  try {
    await ContactMessage.findByIdAndUpdate(id, { reply });
    return res.json({ message: "Reply saved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update reply" });
  }
});

// DELETE /api/contact/:id
router.delete("/:id", async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    return res.json({ message: "Message deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete message" });
  }
});

// GET /api/contact/user/:email
router.get("/user/:email", async (req, res) => {
  try {
    const userMessages = await ContactMessage.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(userMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user messages" });
  }
});

// DELETE /api/contact/user/:id
router.delete("/user/:id", async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;
