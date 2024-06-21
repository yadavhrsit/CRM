const User = require("../models/User");
const Lead = require("../models/Lead");
const FollowUp = require("../models/FollowUp");
const mongoose = require("mongoose");
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
      limit = 9999,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    let query = {
      role: { $ne: "admin" },
    };
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
      totalPages: Math.ceil(total / limit),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

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
    const user = await User.findById(
      new mongoose.Types.ObjectId(req.user.userId)
    ).select("-password");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Get logged-in user dashboard
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Count all leads
    const totalLeads = await Lead.countDocuments({});
    const userTotalLeads = await Lead.countDocuments({ addedBy: userId });

    // Count leads created today
    const todayLeads = await Lead.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const todayUserLeads = await Lead.countDocuments({
      addedBy: userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Count won, lost, and closed open leads
    const wonLeadsCount = await Lead.countDocuments({ status: "won" });
    const lostLeadsCount = await Lead.countDocuments({ status: "lost" });
    const closedLeadsCount = wonLeadsCount + lostLeadsCount;
    const openLeadsCount = totalLeads - closedLeadsCount;

    // Count upcoming follow-ups and today's follow-ups for the user
    const allUserFollowUps = await FollowUp.find({ assignedTo: userId });

    // Calculate upcoming follow-ups count for the user
    const today = new Date();
    const upcomingFollowUpsCount = await FollowUp.countDocuments({
      assignedTo: userId,
      followDate: { $gte: today }, // Filter for follow-up dates today or in the future
    });

    // Calculate today's follow-ups count for the user
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 to get the start of the day
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to the end of the day
    const todayFollowUpsCount = await FollowUp.countDocuments({
      assignedTo: userId,
      followDate: { $gte: startOfToday, $lte: endOfToday }, // Filter for follow-up dates within today
    });

    // Count leads closed by the user
    const userClosedLeads = await Lead.countDocuments({
      addedBy: userId,
      status: { $in: ["won", "lost"] },
    });

    const userOpenLeads = userTotalLeads - userClosedLeads;

    const userWonLeadsCount = await Lead.countDocuments({
      addedBy: userId,
      status: "won",
    });

    const userLostLeadsCount = await Lead.countDocuments({
      addedBy: userId,
      status: "lost",
    });


    res.json({
      totalLeads,
      userTotalLeads,
      todayLeads,
      todayUserLeads,
      wonLeadsCount,
      lostLeadsCount,
      closedLeadsCount,
      openLeadsCount,
      upcomingFollowUpsCount,
      todayFollowUpsCount,
      userClosedLeads,
      userOpenLeads,
      userWonLeadsCount,
      userLostLeadsCount,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in Admin dashboard
const getAdminDashboard = async (req, res, next) => {
  try {
    // Get start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Count all leads
    const totalLeads = await Lead.countDocuments({});

    // Count leads created today
    const todayLeads = await Lead.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Count won, lost, and closed,open leads
    const wonLeadsCount = await Lead.countDocuments({ status: "won" });
    const lostLeadsCount = await Lead.countDocuments({ status: "lost" });
    const closedLeadsCount = wonLeadsCount + lostLeadsCount;
    const openLeadsCount = totalLeads - closedLeadsCount;

    // Count all FollowUps
    const totalFollowUps = await FollowUp.countDocuments({});

    // Count follow-ups created today
    const todayFollowUps = await FollowUp.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Count won, lost, and closed leads updated today
    const todayWonLeads = await Lead.countDocuments({
      status: "won",
      updatedAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const todayLostLeads = await Lead.countDocuments({
      status: "lost",
      updatedAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const todayClosedLeads = todayWonLeads + todayLostLeads;

    res.json({
      totalLeads,
      todayLeads,
      wonLeadsCount,
      lostLeadsCount,
      closedLeadsCount,
      openLeadsCount,
      totalFollowUps,
      todayFollowUps,
      todayWonLeads,
      todayLostLeads,
      todayClosedLeads,
    });
  } catch (error) {
    next(error);
  }
};

// Update logged-in user
const updateProfile = async (req, res, next) => {
  try {
    const { username, password, mobile, email } = req.body;

    let user = await User.findById(req.user.userId);
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

    let user = await User.findById(req.params.id).select(
      "username role name mobile email status password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    console.log(username, password, role, name, mobile, email, status);
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
  getDashboard,
  getAdminDashboard,
  updateProfile,
  updateUser,
  deleteUser,
};
