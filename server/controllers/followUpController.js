const FollowUp = require("../models/Followup");

// create a new follow-up
const createFollowUp = async (req, res, next) => {
  try {
    const followUp = new FollowUp(req.body);
    followUp.addedBy = req.user._id;
    await followUp.save();
    res.status(201).json(followUp);
  } catch (error) {
    next(error);
  }
};

// Get all follow-ups
const getFollowUps = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder } = req.query;

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
  getFollowUpsByLeadId,
  getFollowUpsByAssignedUser,
  getFollowUpsByAddedUser,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
};
