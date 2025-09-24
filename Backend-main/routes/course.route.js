const express = require("express");
const router = express.Router();
const CourseModel = require("../models/Course");
const upload = require("../middlewares/upload.middleware");
const {
  createCourse,
  getCourses,
  deleteCourse,
  updateCourse,
  getCourseById,
  getCoursesByInstructor,
  getCoursesByInstructorId,
} = require("../controllers/course.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/courses", authMiddleware, upload.single("image"), createCourse);
router.get("/allCourses", getCourses);
router.get("/my-courses", authMiddleware, getCoursesByInstructor);
router.get("/courses/instructor/:instructorId", getCoursesByInstructorId);
router.delete("/courses/:id", authMiddleware, deleteCourse);
router.put(
  "/courses/:id",
  authMiddleware,
  upload.single("image"),
  updateCourse
);
router.get("/courses/:id", getCourseById);

module.exports = router;
