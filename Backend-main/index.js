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
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/images", express.static("public/images"));

// mongoose.connect("mongodb://127.0.0.1:27017/Students")

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/messages", message);
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

connectDb().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});