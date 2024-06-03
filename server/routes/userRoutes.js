const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Route to create a new user
router.post(
  "/",
  [
    check("username", "Username is required").notEmpty(),
    check("password", "Password is required").notEmpty(),
    check("role", "Role is required").notEmpty(),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      req.body.password = await hashPassword(req.body.password);
      next();
    },
  ],
  roleMiddleware(["admin"]),
  createUser
);

// Route to get all users
router.get("/", verifyToken, getUsers);

// Route to get logged in user
router.get("/profile", verifyToken, getProfile);

// Route to get user by ID
router.get("/:id", verifyToken, getUserById);

// Route to update logged in user
router.put("/profile", verifyToken, updateProfile);

// Route to update user
router.put("/:id", verifyToken, roleMiddleware(["admin"]), updateUser);

// Route to delete user
router.delete("/:id", verifyToken, roleMiddleware(["admin"]), deleteUser);

module.exports = router;
