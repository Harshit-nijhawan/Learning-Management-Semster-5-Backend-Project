const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");
const { ROLES } = require("../utils/roles");
const {
  getProblems,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
  submitSolution,
  toggleBookmarkProblem,
  getProblemHint,
  runCode,
  getAiCodeReview
} = require("../controllers/problem.controller");

// Public routes
router.get("/problems", getProblems);
router.get("/problems/:slug", getProblemBySlug);

// Protected routes
router.post(
  "/problems",
  authMiddleware,
  checkRole(ROLES.INSTRUCTOR),
  createProblem
);

router.put(
  "/problems/:id",
  authMiddleware,
  checkRole(ROLES.INSTRUCTOR),
  updateProblem
);

router.delete(
  "/problems/:id",
  authMiddleware,
  checkRole(ROLES.INSTRUCTOR),
  deleteProblem
);

router.post(
  "/problems/:id/submit",
  authMiddleware,
  submitSolution
);

router.post(
  "/problems/:id/run",
  authMiddleware,
  runCode
);

router.post(
  "/problems/:id/bookmark",
  authMiddleware,
  toggleBookmarkProblem
);

router.get(
  "/problems/:id/hint",
  authMiddleware,
  getProblemHint
);

router.post(
  "/problems/:id/audit",
  authMiddleware,
  getAiCodeReview
);

module.exports = router;
