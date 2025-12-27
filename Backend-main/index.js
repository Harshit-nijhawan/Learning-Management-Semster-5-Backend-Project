const dotenv = require("dotenv");
dotenv.config(); // 👈 MUST BE THE FIRST THING

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`❌ FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please create a .env file with all required variables');
  process.exit(1);
}

const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const StudentModel = require("./models/Students");
const { hashPassword, comparePassword } = require("./utils/passwordUtils");
const authRoutes = require("./routes/auth.routes");
const message = require("./routes/contactUs.routes");
const connectDb = require("./utils/db");
const protectedRoutes = require("./routes/protected.routes");
const courseRoutes = require("./routes/course.route");
const articleRoutes = require("./routes/article.routes");
const problemRoutes = require("./routes/problem.routes");
const learningPathRoutes = require("./routes/learningPath.routes");
const progressRoutes = require("./routes/progress.routes");
const dailyQuestionRoutes = require("./routes/dailyQuestion.routes");
const errorHandler = require("./utils/errorHandler");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://lms-phi-pink.vercel.app",
        "https://lms-phi-pink.vercel.app/" // Add with trailing slash just in case
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Clean the origin to ensure no trailing slash issues for comparison
      const cleanOrigin = origin.replace(/\/$/, "");

      // Allow exact matches from list OR any vercel.app domain (for previews)
      const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, "") === cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS. Origin:", origin);
        callback(null, true); // TEMPORARY: Allow ALL to confirm if it's strictly a CORS issue
        // callback(new Error('Not allowed by CORS')); 
      }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/images", express.static("public/images"));

// mongoose.connect("mongodb://127.0.0.1:27017/Students")

const chatRoutes = require("./routes/chat.routes");
const discussionRoutes = require("./routes/discussion.routes");

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/messages", message); // Contact Us messages
app.use("/api/chat", chatRoutes); // Legacy/Private Chat
app.use("/api/community", discussionRoutes); // New Discussion Board
app.use("/api", courseRoutes);

// GFG-style routes
app.use("/api", articleRoutes);
app.use("/api", problemRoutes);
app.use("/api", learningPathRoutes);
app.use("/api/user", progressRoutes);

// Daily Question routes
app.use("/api/daily-question", dailyQuestionRoutes);

// Global error handler (must be after all routes)
app.use(errorHandler);

// Connect to DB (async)
connectDb();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Add a health check route
app.get("/", (req, res) => {
  res.send({ status: "running", message: "Backend is active. Check console for DB errors." });
});

// Initialize Cron Jobs (Daily Question Scheduler)
const initCronJobs = require('./services/scheduler.service');
initCronJobs();