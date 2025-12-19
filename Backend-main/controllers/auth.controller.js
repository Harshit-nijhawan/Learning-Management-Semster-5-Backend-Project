const StudentModel = require("../models/Students");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await StudentModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "No record found" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (isMatch) {
      const token = generateToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.json({
        message: "Success",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
};

const register = async (req, res) => {
  try {
    console.log("Registration request body:", req.body);
    const { name, email, password, number, role } = req.body;

    const errors = {};
    if (!name || name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid email is required";
    if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!number || !/^\d{10,}$/.test(number)) errors.number = "Valid phone number is required (10+ digits)";
    if (!role || !["student", "instructor"].includes(role))
      errors.role = "Role must be student or instructor";

    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const existingUser = await StudentModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newStudent = await StudentModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      number,
      role,
    });

    const token = generateToken(newStudent._id);
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        role: newStudent.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};


module.exports = { login, register };
