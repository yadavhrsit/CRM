// controllers/leadController.js
const Lead = require("../models/Lead");


// Create a new lead
const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// Get all leads 
const getLeads = async (req, res, next) => {
  try {
    const { search, status, sortBy, sortOrder, page, limit } = req.query;

    let query = {};

    // Add search condition
    if (search) {
      query = {
        ...query,
        $or: [
          { company: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
          { query: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Add status condition
    if (status) {
      query.status = status;
    }

    // Add sort condition
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Pagination options
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };

    const leads = await Lead.paginate(query, { ...options, sort });
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

// Get a single lead by ID
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// Get all leads by a user
const getLeadsByAddedUser = async (req, res, next) => {
  try {
    const leads = await Lead.find({ addedBy: req.params.id });
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

// Update a lead
const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// Delete a lead
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadsByAddedUser,
};
