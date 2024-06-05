const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");
const verifyToken = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
// Validation middleware for creating or updating a company
const validateCompany = [
  body("name", "Name is required").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Route to create a new company
router.post("/", verifyToken, validateCompany, createCompany);

// Route to get all companies
router.get("/", verifyToken, getCompanies);

// Route to get company by ID
router.get("/view/:id", verifyToken, getCompanyById);

// Route to update company
router.put("/:id", verifyToken, validateCompany, updateCompany);

// Route to delete company
router.delete("/:id", verifyToken,roleMiddleware(["admin"]), deleteCompany);

module.exports = router;
