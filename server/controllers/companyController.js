const Company = require("../models/Company");

// Create a new company
const createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

// Get all companies 
const getCompanies = async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Search parameter
    const searchQuery = req.query.search || '';

    // Sorting parameters
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Query for searching
    const searchCondition = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { industry: { $regex: searchQuery, $options: 'i' } },
        { address: { $regex: searchQuery, $options: 'i' } }
      ]
    };

    // Query for sorting
    const sortCondition = { [sortBy]: sortOrder };

    // Total count of documents
    const totalCompanies = await Company.countDocuments(searchCondition);

    // Query to retrieve companies with pagination, searching, and sorting
    const companies = await Company.find(searchCondition)
      .sort(sortCondition)
      .skip((page - 1) * limit)
      .limit(limit);

    // Send response with pagination metadata and companies data
    res.json({
      page,
      totalPages: Math.ceil(totalCompanies / limit),
      totalCompanies,
      companies
    });
  } catch (error) {
    next(error);
  }
};

// Get a single company by ID
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    next(error);
  }
};

// Update a company
const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    next(error);
  }
};

// Delete a company
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndRemove(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(204).json({ message: "Company deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
