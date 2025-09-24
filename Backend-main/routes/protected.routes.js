const express = require("express");
const router = express.Router();
const { checkRole } = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const { ROLES } = require("../utils/roles");
const {
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
} = require("../controllers/protected.controller");

router.get("/users", authMiddleware, checkRole(ROLES.ADMIN), getAllUsers);
router.get("/students", studentList);
router.get("/instructors", instructorList);
router.delete("/users/:id", authMiddleware, checkRole(ROLES.ADMIN), deleteUser);
router.put(
  "/users/role",
  authMiddleware,
  checkRole(ROLES.ADMIN),
  updateUserRole
);

router.post("/courses", authMiddleware, checkRole(ROLES.INSTRUCTOR), createCourse
);
router.get(
  "/instructor/courses", authMiddleware, checkRole(ROLES.INSTRUCTOR), getMyCourses
);

router.post(
  "/courses/:courseId/enroll", authMiddleware, checkRole(ROLES.STUDENT), enrollInCourse
);
router.get("/student/courses", authMiddleware, checkRole(ROLES.STUDENT), getEnrolledCourses
);
router.get("/user/:id", getUserById);

router.post("/user/:id/purchase", authMiddleware, addPurchasedCourses);

// router.get("/test-auth", authMiddleware, testAuth);
router.get("/cart", authMiddleware, checkRole(ROLES.STUDENT), getCart);
router.post("/cart", authMiddleware, checkRole(ROLES.STUDENT), addToCart);
router.delete(
  "/cart/:courseId",
  authMiddleware,
  checkRole(ROLES.STUDENT),
  removeFromCart
);

module.exports = router;
