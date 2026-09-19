const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// =========================
// SIGNUP
// =========================

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    // Validate username
    if (username.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters",
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Signup successful",

      token,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// LOGIN
// =========================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// UPDATE PROFILE
// =========================

const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    // At least one field should be provided
    if (!username && !email) {
      return res.status(400).json({
        message: "Username or email is required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =========================
    // UPDATE USERNAME
    // =========================

    if (username) {
      if (username.trim().length < 3) {
        return res.status(400).json({
          message: "Username must be at least 3 characters",
        });
      }

      user.username = username.trim();
    }

    // =========================
    // UPDATE EMAIL
    // =========================

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();

      // Check if email belongs to another user
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.userId },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already being used",
        });
      }

      user.email = normalizedEmail;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// CHANGE PASSWORD
// =========================

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    // =========================
    // FIND USER
    // =========================

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =========================
    // VERIFY CURRENT PASSWORD
    // =========================

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // =========================
    // HASH NEW PASSWORD
    // =========================

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
