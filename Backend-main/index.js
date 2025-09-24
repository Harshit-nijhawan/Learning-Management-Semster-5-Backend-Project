const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const StudentModel = require("./models/Students");
const { hashPassword, comparePassword } = require("./utils/passwordUtils");
const authRoutes = require("./routes/auth.routes");
const message = require("./routes/contactUs.routes");
const dotenv = require("dotenv");
const connectDb = require("./utils/db");
const protectedRoutes = require("./routes/protected.routes");
const courseRoutes = require("./routes/course.route");
dotenv.config();

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
connectDb().then(() => {
  app.listen(3001, () => {
    console.log("Server is running");
  });
});
