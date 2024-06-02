const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// Create a new user
const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role, name, mobile, email, status } = req.body;

    // Check if the username or email already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      password,
      role,
      name,
      mobile,
      email,
      status,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all users with pagination, searching, and sorting
const getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { role: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get a single user by ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Get logged-in user
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update logged-in user
const updateProfile = async (req, res, next) => {
  try {
    const { username, password, mobile, email } = req.body;

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if any field is updated
    if (
      username === user.username &&
      mobile === user.mobile &&
      email === user.email &&
      password === user.password
    ) {
      return res.json({ message: "Nothing to update" });
    }

    // Update user details
    user.username = username || user.username;
    user.mobile = mobile || user.mobile;
    user.email = email || user.email;
    user.password = password || user.password;

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Update a user
const updateUser = async (req, res, next) => {
  try {
    const { username, password, role, name, mobile, email, status } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if any field is updated
    if (
      username === user.username &&
      role === user.role &&
      mobile === user.mobile &&
      email === user.email &&
      name === user.name &&
      status === user.status &&
      password === user.password
    ) {
      return res.json({ message: "Nothing to update" });
    }

    // Update user details
    user.username = username || user.username;
    user.role = role || user.role;
    user.mobile = mobile || user.mobile;
    user.email = email || user.email;
    user.name = name || user.name;
    user.status = status || user.status;
    user.password = password || user.password;

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Delete a user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  updateUser,
  deleteUser,
};
