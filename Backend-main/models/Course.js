const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, default: 0 },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  // GeeksforGeeks Style Curriculum
  curriculum: [
    {
      chapterTitle: { type: String, required: true },
      videoLink: { type: String, required: true }, // YouTube Embed URL
      content: { type: String, required: true }    // Reading Material/Notes
    }
  ],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  studentsEnrolled: { type: Number, default: 0, min: 0 },
}, { timestamps: true }); // Auto-manage createdAt and updatedAt

const CourseModel = mongoose.model("Course", courseSchema);
module.exports = CourseModel;