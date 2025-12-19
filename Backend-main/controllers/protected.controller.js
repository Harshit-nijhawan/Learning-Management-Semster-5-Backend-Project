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
    const userId = req.user._id;
    console.log("Fetching courses for user:", userId);

    const student = await StudentModel.findById(userId).populate({
      path: "purchasedCourses",
      populate: {
        path: "instructor",
        select: "name email",
      },
      // Ensure 'curriculum' is selected
      select: "title description image price rating instructor curriculum" 
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

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
    const studentId = req.params.id;
    const { courseIds } = req.body;

    // Validate input
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: "Invalid courseIds: must be a non-empty array" });
    }

    const student = await StudentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fix: Proper ObjectId comparison
    const newCourses = courseIds.filter(
      (id) => !student.purchasedCourses.some(purchasedId => purchasedId.toString() === id.toString())
    );

    student.purchasedCourses.push(...newCourses);

    // Fix: Proper ObjectId comparison for cart filtering
    student.cart = student.cart.filter(
      (cartItemId) => cartItemId && !courseIds.some(courseId => courseId.toString() === cartItemId.toString())
    );

    await student.save();

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

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    await StudentModel.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

const testAuth = async (req, res) => {
  try {
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
    res.status(500).json({ message: "Error in testAuth", error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const student = await StudentModel.findById(userId).populate("cart");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student.cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const student = await StudentModel.findById(userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fix: Proper ObjectId comparison
    if (student.cart.some(id => id.toString() === courseId.toString())) {
      return res.status(400).json({ message: "Course already in cart" });
    }

    if (student.purchasedCourses.some(id => id.toString() === courseId.toString())) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    student.cart.push(courseId);
    await student.save();

    const updatedStudent = await StudentModel.findById(userId).populate("cart");

    res.status(200).json({
      message: "Course added to cart",
      cart: updatedStudent.cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message });
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

    const updatedStudent = await StudentModel.findById(userId).populate("cart");
    res.status(200).json({
      message: "Course removed from cart",
      cart: updatedStudent.cart,
    });
  } catch (error) {
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