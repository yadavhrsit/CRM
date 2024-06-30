// controllers/leadController.js
const Lead = require("../models/Lead");
const Company = require("../models/Company");
const {notificationsHandler} = require("../utils/notificationsHandler");
// Create a new lead
const createLead = async (req, res, next) => {
  try {
    let company = await Company.findOne({ name: req.body.company });
    if (!company) {
      company = await Company.create({ name: req.body.company });
    }
    const lead = await Lead.create({
      ...req.body,
      addedBy: req.user.userId,
      company: company._id,
    });
    const type = "leads";
    const id = lead._id;
    const user = req.user.username;
    const message = `${req.user.name} just added a ${type}.`;
    notificationsHandler(type, id, message, user,notifyEveryone=true);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// Get all leads
const getLeads = async (req, res, next) => {
  try {
    const { search, status, sortBy, sortOrder } = req.query;

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
        ],
      };
    }

    // Add status condition
    if (status) {
      query.status = status;
    }

    // Parse page and limit as integers
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit, 10) || 10; // Default to limit 10 if not specified

    // Calculate skip
    const skip = (page - 1) * limit;

    // Add sort condition
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort["createdAt"] = -1;
    }

    // Pagination options
    const options = {
      skip: skip,
      limit: limit,
      sort: sort,
    };

    // Now use `options` in your query
    const leads = await Lead.find(query, null, options)
      .populate({ path: "company", select: "name" })
      .populate({ path: "addedBy", select: "name" });

    const total = await Lead.countDocuments(query);

    res.json({
      docs: leads,
      totalDocs: total,
      totalPages: Math.ceil(total / options.limit),
      page: parseInt(page, 10) || 1,
    });
  } catch (error) {
    next(error);
  }
};

// Get all leads of signed in user
const getLeadsByUser = async (req, res, next) => {
  try {
    const { search, status, sortBy, sortOrder } = req.query;

    let query = {
      addedBy: req.user.userId,
    };

    // Add search condition
    if (search) {
      query = {
        ...query,
        $or: [
          { company: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Add status condition
    if (status) {
      query.status = status;
    }

    // Parse page and limit as integers
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit, 10) || 10; // Default to limit 10 if not specified

    // Calculate skip
    const skip = (page - 1) * limit;

    // Add sort condition
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Pagination options
    const options = {
      skip: skip,
      limit: limit,
      sort: sort,
    };

    // Now use `options` in your query
    const leads = await Lead.find(query, null, options)
      .populate({ path: "company", select: "name" })
      .populate({ path: "addedBy", select: "name" });

    const total = await Lead.countDocuments(query);

    res.json({
      docs: leads,
      totalDocs: total,
      totalPages: Math.ceil(total / options.limit),
      page: parseInt(page, 10) || 1,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single lead by ID
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate({ path: "company", select: "name" })
      .populate({ path: "addedBy", model: "User", select: "name" })
      .populate({
        path: "followUps",
        populate: [
          { path: "addedBy", model: "User", select: "name" },
          { path: "assignedTo", model: "User", select: "name username" },
        ],
      });
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

// Get all leads by a company
const getLeadsByCompany = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page to 1 and limit to 10
    const { companyId } = req.params; // Assuming companyId is passed as a URL parameter

    // Calculate the total number of documents and total pages
    const totalDocuments = await Lead.countDocuments({ company: companyId });
    const totalPages = Math.ceil(totalDocuments / limit);

    // Fetch paginated leads
    const leads = await Lead.find({ company: companyId })
      .populate("addedBy", "name") // Populate the addedBy field with the name of the user
      .populate("company", "name") // Populate the company field with the name of the company
      .skip((page - 1) * limit) // Calculate the number of documents to skip
      .limit(limit) // Limit the number of documents
      .exec(); // Execute the query

    // Return the paginated results along with pagination details
    res.status(200).json({
      leads,
      currentPage: page,
      limit,
      totalPages,
      totalDocuments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching leads by company",
      error: error.message,
    });
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
  getLeadsByUser,
  getLeadById,
  getLeadsByCompany,
  updateLead,
  deleteLead,
  getLeadsByAddedUser,
};
