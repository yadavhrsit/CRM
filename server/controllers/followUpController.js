const FollowUp = require("../models/FollowUp");
const Lead = require("../models/Lead");
const User = require("../models/User");

// create a new follow-up
const createFollowUp = async (req, res, next) => {
  try {
    // Check if the lead exists
    const lead = await Lead.findById(req.params.id).populate({
      path: "followUps",
      populate: [
        { path: "addedBy", model: "User", select: "name" },
        { path: "assignedTo", model: "User", select: "name" },
      ],
    });
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check if the lead is open
    if (lead.status !== "open") {
      return res.status(400).json({
        message: `Cannot create follow-up for a lead with status ${lead.status}`,
      });
    }

    // Check if the assigned user is enabled
    const assignedUser = await User.findById(req.body.assignedTo);
    if (!assignedUser || !assignedUser.status === "enabled") {
      return res.status(400).json({ message: "This user has been disabled." });
    }

    // Check if the user is assigned to the lead or its the first follow-up
    if (
      lead.followUps.length === 0 ||
      lead.followUps[lead.followUps.length - 1].assignedTo._id.toString() ===
        req.user.userId
    ) {
      const followUp = await FollowUp.create({
        lead: req.params.id,
        addedBy: req.user.userId,
        ...req.body,
      });

      lead.followUps.push(followUp._id);
      await lead.save();
      if (req.body.leadStatus) {
        lead.status = req.body.leadStatus;
        await lead.save();
        console.log(lead);
      }
      res.status(201).json(followUp);
    } else {
      return res
        .status(400)
        .json({ message: "You are not assigned to follow-Up for this lead." });
    }
  } catch (error) {
    next(error);
  }
};

// Get all follow-ups
const getFollowUps = async (req, res, next) => {
  try {
    const {
      search,
      sortBy = "followDate",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};
    if (search) {
      query = {
        ...query,
        $or: [
          { followDate: { $regex: search, $options: "i" } },
          { remarks: { $regex: search, $options: "i" } },
        ],
      };
    }

    let sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const followUps = await FollowUp.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("addedBy", "name email")
      .populate("assignedTo", "name email")
      .populate({
        path: "lead",
        populate: {
          path: "company",
          model: "Company",
          select: "name",
        },
      });

    const total = await FollowUp.countDocuments(query);

    res.json({
      followUps,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get all follow-ups of logged in user
const getFollowUpsByUser = async (req, res, next) => {
  try {
    const {
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    let query = {
      assignedTo: req.user.userId,
    };
    if (search) {
      query = {
        ...query,
        $or: [
          { followDate: { $regex: search, $options: "i" } },
          { remarks: { $regex: search, $options: "i" } },
        ],
      };
    }

    let sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const followUps = await FollowUp.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("addedBy", "name email")
      .populate("assignedTo", "name email")
      .populate({
        path: "lead",
        populate: {
          path: "company",
          model: "Company",
          select: "name",
        },
      });

    const total = await FollowUp.countDocuments(query);

    res.json({
      followUps,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// Get follow-up by ID
const getFollowUpById = async (req, res, next) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }
    res.json(followUp);
  } catch (error) {
    next(error);
  }
};

// get all follow-ups by lead ID with search, sort, and filter
const getFollowUpsByLeadId = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder } = req.query;

    let query = { lead: req.params.id };

    // Add search condition
    if (search) {
      query = {
        ...query,
        $or: [
          { followDate: { $regex: search, $options: "i" } },
          { remarks: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Add sort condition
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const followUps = await FollowUp.find(query).sort(sort);
    res.json(followUps);
  } catch (error) {
    next(error);
  }
};

// get all follow-ups by assigned user ID with search, sort, and filter
const getFollowUpsByAssignedUser = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder } = req.query;

    let query = { assignedTo: req.params.id };

    // Add search condition
    if (search) {
      query = {
        ...query,
        $or: [
          { followDate: { $regex: search, $options: "i" } },
          { remarks: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Add sort condition
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const followUps = await FollowUp.find(query).sort(sort);
    res.json(followUps);
  } catch (error) {
    next(error);
  }
};

// get all follow-ups by added user ID with search, sort, and filter
const getFollowUpsByAddedUser = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder } = req.query;

    let query = { addedBy: req.params.id };

    // Add search condition
    if (search) {
      query = {
        ...query,
        $or: [
          { followDate: { $regex: search, $options: "i" } },
          { remarks: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Add sort condition
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const followUps = await FollowUp.find(query).sort(sort);
    res.json(followUps);
  } catch (error) {
    next(error);
  }
};

// Update follow-up
const updateFollowUp = async (req, res, next) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }
    res.json({ message: "Follow-up updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Delete follow-up
const deleteFollowUp = async (req, res, next) => {
  try {
    const followUp = await FollowUp.findByIdAndDelete(req.params.id);
    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }
    res.json({ message: "Follow-up deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFollowUp,
  getFollowUps,
  getFollowUpsByUser,
  getFollowUpsByLeadId,
  getFollowUpsByAssignedUser,
  getFollowUpsByAddedUser,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
};
