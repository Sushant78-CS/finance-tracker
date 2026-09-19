const express = require("express");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// PROFILE
// =========================

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

// =========================
// CHANGE PASSWORD
// =========================

router.put("/change-password", protect, changePassword);

module.exports = router;
