const express = require("express");
const { createServer } = require("http");
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

// Import notifications handler
const { initSocket } = require("./utils/notificationsHandler");

// Create Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
initSocket(httpServer);

// Middleware
app.use(
  cors({
    origin: "https://nexencast.in",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/follow-ups", followUpRoutes);

// Error handler middleware
app.use(errorHandler);

// Start server
const port = PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
