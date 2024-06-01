const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/database");
const { PORT } = require("./config/env");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const leadRoutes = require("./routes/leadRoutes");
const companyRoutes = require("./routes/companyRoutes");
const followUpRoutes = require("./routes/followUpRoutes");

// Create Express app
const app = express();
app.use(express.json());

// Middleware
app.use(cors());
app.use(morgan("dev"));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/follow-ups", followUpRoutes);

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
