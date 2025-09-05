const Admin = require("../models/Admin");
const express = require("express");
const router = express.Router();

router.post('/',async(req,res)=>{
  const admin = await new Admin(req.body);
  admin.save();
  return res.status(200).json("Api called successfully");
})

//admin login route
// admin login route

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if admin exists

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check password
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Login success
    return res.status(200).json({
      message: "Login Successfully",
      admin: {
        role: 'admin',
        id: admin._id,
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.put("/changepassword", async (req, res) => {
  const { op, np, cnp, email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.password !== op) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (op === np) {
      return res.status(400).json({ message: "New password is the same as old password" });
    }

    if (np !== cnp) {
      return res.status(400).json({ message: "Confirm password does not match" });
    }

    admin.password = np;
    await admin.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Password change failed", error: err.message });
  }
});

module.exports = router;