const express = require("express");
const { generateToken } = require("../../middleware/tokengerate");
const verifyToken = require("../../middleware/authmiddleware");
const UserSchema = require("../../Usersmodel/UserSchema");
const router = express.Router();

const users = [
  { id: 123, username: "admin1", password: "admin123", role: "admin" },
  { id: 987, username: "client1", password: "client123", role: "client" },
  { id: 456, username: "staff1", password: "staff123", role: "staff" },
];

// LOGIN
router.post("/login", async (req, res) => {
  // console.log("Login attempt:", req.body);
  try {
    const { username, password, role } = req.body;
    console.log(UserSchema.collection.collectionName)
    const user = await UserSchema.findOne({ username, role });
    if (!user || user.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });


    const token = generateToken({ id: user.id, username: user.username, role: user.role, });

    res.cookie("token__", token, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 });
    res.json({ user: { id: user._id, username: user.username, role: user.role, token } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.get("/login", async (req, res) => {
//   console.log("Login attempt:", req.body);
//   try {
//     const { username, password, role } = req.body;

//     const user = await UserSchema.find({});
//    res.json(user)
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

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