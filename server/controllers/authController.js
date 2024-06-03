const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { jwtSecret } = require("../config/env");

// Login
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { phone: identifier },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid User" });
    }

    if (user.status !== "enabled") {
      return res.status(401).json({ message: "Your account has been disabled. Please contact Admin" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
      expiresIn: "30d",
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
