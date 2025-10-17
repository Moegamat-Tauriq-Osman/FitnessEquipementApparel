const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, (req, res) => {
  if (req.user) {
    res.status(200).json({
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(200).json(null);
  }
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;