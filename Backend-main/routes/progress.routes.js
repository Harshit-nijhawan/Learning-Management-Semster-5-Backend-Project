const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
  getUserProgress,
  getUserStats,
  getUserBookmarks
} = require("../controllers/progress.controller");

// All routes require authentication
router.get("/progress", authMiddleware, getUserProgress);
router.get("/stats", authMiddleware, getUserStats);
router.get("/bookmarks", authMiddleware, getUserBookmarks);

module.exports = router;
