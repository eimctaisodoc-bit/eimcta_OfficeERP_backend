const express = require("express");
const { generateToken } = require("../../middleware/tokengerate");
const verifyToken = require("../../middleware/authmiddleware");
const router = express.Router();

const users = [
  { id: 123, username: "admin1", password: "admin123", role: "admin" },
  { id: 987, username: "client1", password: "client123", role: "client" },
  { id: 456, username: "staff1", password: "staff123", role: "staff" },
];

// LOGIN
router.post("/login", (req, res) => {
  const { username, password, role } = req.body;
  
  const user = users.find((u) => u.username === username);
  if (!user || user.password !== password || user.role !== role)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  res.cookie("token__", token, {
    httpOnly: true,   // ✅ prevents JS from reading it   // ✅ only HTTPS in production
    sameSite: "lax",
    secure: false,
    maxAge: 8 * 60 * 60 * 1000
  });

  res.json({
    user: { id: user.id, username: user.username, role: user.role, token },
  });
});

// 🔐 ME
router.get("/me", verifyToken, (req, res) => {
  return res.status(200).json({
    user: req.user
  });
});

// 🚪 LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token__");
  // console.log('logout is operate.')
  return res.json({ logout: true, message: "Logged out" });
});

module.exports = router;