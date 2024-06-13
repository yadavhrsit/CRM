const express = require("express");
const router = express.Router();
const {
  createFollowUp,
  getFollowUps,
  getFollowUpsByLeadId,
  getFollowUpsByAssignedUser,
  getFollowUpsByAddedUser,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
  getFollowUpsByUser,
} = require("../controllers/followUpController");
const verifyToken = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Route to create a new follow-up by using a lead ID
router.post("/:id", verifyToken, createFollowUp);

// Route to get all follow-ups
router.get("/", verifyToken, getFollowUps);

// Route to get all follow-ups of logged in user
router.get("/my-follow-ups", verifyToken, getFollowUpsByUser);

// Route to get follow-up by Lead ID
router.get("/lead/:id", verifyToken, getFollowUpsByLeadId);

// Route to get follow-up by assigned user ID
router.get("/assigned-user/:id", verifyToken, getFollowUpsByAssignedUser);

// Route to get follow-up by added user ID
router.get("/added-by-user/:id", verifyToken, getFollowUpsByAddedUser);

// Route to get a follow-up by ID
router.get("/:id", verifyToken, getFollowUpById);

// Route to update a follow-up
router.put("/:id", verifyToken, roleMiddleware(["admin"]), updateFollowUp);

// Route to delete follow-up
router.delete("/:id", verifyToken, roleMiddleware(["admin"]), deleteFollowUp);

module.exports = router;
