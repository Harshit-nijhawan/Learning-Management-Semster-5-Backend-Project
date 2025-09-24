const Course = require("../models/Course");

const createCourse = async (req, res) => {
  try {
    const { title, description, price, rating, studentsEnrolled } = req.body;
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User authentication required" });
    }
    const newCourse = await Course.create({
      title,
      description,
      image: req.file.filename,
      price: price || 0,
      rating: rating || 0,
      studentsEnrolled: studentsEnrolled || 0,
      instructor: req.user._id,
    });

    // Populate the instructor details before sending response
    const populatedCourse = await Course.findById(newCourse._id).populate(
      "instructor",
      "name email role"
    );

    console.log("Created course with instructor:", populatedCourse.instructor);

    res.status(201).json({
      message: "Course created successfully",
      course: populatedCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Error creating course" });
  }
};

const getCourses = async (req, res) => {
  try {
    console.log("Fetching all courses with instructor population...");
    const courses = await Course.find()
      .populate("instructor", "name email role")
      .sort({ createdAt: -1 });

    console.log("Courses fetched:", courses.length);
    console.log("Sample course with instructor:", courses[0]?.instructor);

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User authentication required" });
    }

    // Find the course first to check ownership
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is the instructor of this course or an admin
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access denied. You can only delete your own courses",
      });
    }

    const deleted = await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Error deleting course" });
  }
};

// Update course by ID
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User authentication required" });
    }

    // Find the course first to check ownership
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is the instructor of this course or an admin
    if (
      existingCourse.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access denied. You can only update your own courses",
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      rating: req.body.rating,
      studentsEnrolled: req.body.studentsEnrolled,
    };

    if (req.file && req.file.filename) {
      updateData.image = req.file.filename;
    }

    const updated = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("instructor", "name email role");

    res
      .status(200)
      .json({ message: "Course updated successfully", course: updated });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating course" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email role"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Error fetching course" });
  }
};

const getCoursesByInstructor = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User authentication required" });
    }
    const courses = await Course.find({ instructor: req.user._id })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

const getCoursesByInstructorId = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const courses = await Course.find({ instructor: instructorId })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by instructor ID:", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

module.exports = {
  createCourse,
  getCourses,
  deleteCourse,
  updateCourse,
  getCourseById,
  getCoursesByInstructor,
  getCoursesByInstructorId,
};
