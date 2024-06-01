const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");
const verifyToken = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Validation middleware for creating or updating a lead
const validateLead = [
  body("company", "Company name is required").notEmpty(),
  body("name", "Name is required").notEmpty(),
  body("mobile", "Mobile number is required").notEmpty(),
  body("email", "Email is required").notEmpty().isEmail(),
  body("query", "Query is required").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Route to create a new lead
router.post("/", verifyToken, validateLead, createLead);

// Route to get all leads
router.get("/", verifyToken, getLeads);

// Route to get lead by ID
router.get("/:id", verifyToken, getLeadById);

// Route to update lead
router.put(
  "/:id",
  verifyToken,
  validateLead,
  roleMiddleware(["admin"]),
  updateLead
);

// Route to delete lead
router.delete("/:id", verifyToken, roleMiddleware(["admin"]), deleteLead);

module.exports = router;
