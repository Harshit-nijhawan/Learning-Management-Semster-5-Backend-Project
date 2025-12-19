const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");
const { ROLES } = require("../utils/roles");
const {
  getLearningPaths,
  getLearningPathBySlug,
  createLearningPath,
  enrollInPath
} = require("../controllers/learningPath.controller");

// Public routes
router.get("/paths", getLearningPaths);
router.get("/paths/:slug", getLearningPathBySlug);

// Protected routes
router.post(
  "/paths",
  authMiddleware,
  checkRole(ROLES.INSTRUCTOR),
  createLearningPath
);

router.post(
  "/paths/:id/enroll",
  authMiddleware,
  enrollInPath
);

module.exports = router;
