const StudentModel = require("../models/Students");
const CourseModel = require("../models/Course");
const { ROLES } = require("../utils/roles");

const getAllUsers = async (req, res) => {
  try {
    const users = await StudentModel.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const studentList = async (req, res) => {
  try {
    const students = await StudentModel.find({ role: "student" });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student list" });
  }
};

const instructorList = async (req, res) => {
  try {
    const instructors = await StudentModel.find({ role: "instructor" });
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching instructor list" });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    if (!Object.values(ROLES).includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await StudentModel.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user role" });
  }
};

const createCourse = async (req, res) => {
  res.json({ message: "Course creation endpoint" });
};

const getMyCourses = async (req, res) => {
  res.json({ message: "Get instructor courses endpoint" });
};

const enrollInCourse = async (req, res) => {
  res.json({ message: "Course enrollment endpoint" });
};

const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from auth middleware (MongoDB uses _id)
    console.log("Fetching courses for user:", userId);

    const student = await StudentModel.findById(userId).populate({
      path: "purchasedCourses",
      populate: {
        path: "instructor",
        select: "name email", // Only get instructor name and email
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log(
      "Found student with purchased courses:",
      student.purchasedCourses.length
    );
    res.status(200).json(student.purchasedCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({
      message: "Error fetching enrolled courses",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await StudentModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

const addPurchasedCourses = async (req, res) => {
  try {
    console.log("addPurchasedCourses called");
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("User from auth:", req.user);

    const studentId = req.params.id;
    const { courseIds } = req.body;

    console.log("Student ID:", studentId);
    console.log("Course IDs to purchase:", courseIds);

    const student = await StudentModel.findById(studentId);
    if (!student) {
      console.log("Student not found for ID:", studentId);
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Student found:", student.name);
    console.log("Current purchased courses:", student.purchasedCourses);
    console.log("Current cart:", student.cart);

    // Avoid duplicates
    const newCourses = courseIds.filter(
      (id) => !student.purchasedCourses.includes(id)
    );
    console.log("New courses to add:", newCourses);

    student.purchasedCourses.push(...newCourses);

    // Remove purchased courses from cart
    const originalCartLength = student.cart.length;
    student.cart = student.cart.filter(
      (cartItemId) => cartItemId && !courseIds.includes(cartItemId.toString())
    );
    console.log(
      "Cart before save - removed",
      originalCartLength - student.cart.length,
      "items"
    );
    console.log("Cart after removal:", student.cart);

    await student.save();
    console.log("Student saved successfully");

    res.status(200).json({
      message: "Courses purchased and removed from cart",
      purchasedCourses: student.purchasedCourses,
    });
  } catch (error) {
    console.error("Error in addPurchasedCourses:", error);
    res
      .status(500)
      .json({ message: "Error adding courses", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await StudentModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deletion of admin users
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    await StudentModel.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Cart management functions
const testAuth = async (req, res) => {
  try {
    console.log("testAuth called");
    console.log("req.user:", req.user);
    console.log("req.user._id:", req.user._id);
    res.status(200).json({
      message: "Authentication working",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Error in testAuth:", error);
    res
      .status(500)
      .json({ message: "Error in testAuth", error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    console.log("getCart called, req.user:", req.user);
    const userId = req.user._id;
    console.log("Fetching cart for userId:", userId);

    const student = await StudentModel.findById(userId).populate("cart");
    console.log("Student found:", student ? "Yes" : "No");
    console.log("Cart items:", student?.cart?.length || 0);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    console.log("addToCart called, req.user:", req.user);
    console.log("addToCart body:", req.body);

    const userId = req.user._id;
    const { courseId } = req.body;

    console.log("Adding course", courseId, "to cart for user", userId);

    const student = await StudentModel.findById(userId);
    if (!student) {
      console.log("Student not found for userId:", userId);
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Student found, current cart:", student.cart);
    console.log("Student purchased courses:", student.purchasedCourses);

    // Check if course is already in cart
    if (student.cart.includes(courseId)) {
      return res.status(400).json({ message: "Course already in cart" });
    }

    // Check if course is already purchased
    if (student.purchasedCourses.includes(courseId)) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    student.cart.push(courseId);
    await student.save();
    console.log("Course added to cart, new cart:", student.cart);

    // Return populated cart
    const updatedStudent = await StudentModel.findById(userId).populate("cart");
    console.log("Populated cart:", updatedStudent.cart);

    res.status(200).json({
      message: "Course added to cart",
      cart: updatedStudent.cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const student = await StudentModel.findById(userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.cart = student.cart.filter((id) => id.toString() !== courseId);
    await student.save();

    // Return populated cart
    const updatedStudent = await StudentModel.findById(userId).populate("cart");
    res.status(200).json({
      message: "Course removed from cart",
      cart: updatedStudent.cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart" });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  createCourse,
  getMyCourses,
  enrollInCourse,
  getEnrolledCourses,
  studentList,
  instructorList,
  getUserById,
  addPurchasedCourses,
  deleteUser,
  testAuth,
  getCart,
  addToCart,
  removeFromCart,
};
