const Course = require("../models/Course");

const createCourse = async (req, res) => {
  try {
    let { title, description, price, curriculum } = req.body;
    
    // Validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters" });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: "Description must be at least 10 characters" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    
    // Parse if sent as string (FormData limitation)
    if (typeof curriculum === 'string') {
        try {
            curriculum = JSON.parse(curriculum);
        } catch (e) {
            curriculum = [];
        }
    }

    const newCourse = await Course.create({
      title: title.trim(),
      description: description.trim(),
      image: req.file.filename,
      price: price || 0,
      instructor: req.user._id,
      curriculum: curriculum || []
    });

    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Error creating course" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) return res.status(404).json({ message: "Course not found" });
    
    // Authorization Check
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    let { title, description, price, curriculum } = req.body;

    // Handle curriculum parsing
    if (typeof curriculum === 'string') {
        try {
            curriculum = JSON.parse(curriculum);
        } catch (e) {
            // keep existing if parse fails
        }
    }

    const updateData = { title, description, price };
    if (curriculum) updateData.curriculum = curriculum;
    if (req.file) updateData.image = req.file.filename;

    const updated = await Course.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: "Updated successfully", course: updated });

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating course" });
  }
};

// ... Keep other functions (getCourses, deleteCourse, etc.) exactly as they were ...
// For brevity, I am including the exports you need
const getCourses = async (req, res) => {
    const courses = await Course.find().populate("instructor", "name email").sort({ createdAt: -1 });
    res.json(courses);
};
const getCoursesByInstructor = async (req, res) => {
    const courses = await Course.find({ instructor: req.user._id }).populate("instructor", "name email");
    res.json(courses);
};
const getCourseById = async (req, res) => {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if(!course) return res.status(404).json({message: "Not Found"});
    res.json(course);
};
const deleteCourse = async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);
    res.json({message: "Deleted"});
};
const getCoursesByInstructorId = async (req, res) => {
    const courses = await Course.find({ instructor: req.params.instructorId });
    res.json(courses);
}

module.exports = { createCourse, updateCourse, getCourses, getCoursesByInstructor, getCourseById, deleteCourse, getCoursesByInstructorId };