const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");
const { ROLES } = require("../utils/roles");
const {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLikeArticle,
  toggleBookmarkArticle,
  markArticleCompleted,
  getFeaturedArticles
} = require("../controllers/article.controller");

// Public routes
router.get("/articles", getArticles);
router.get("/articles/featured", getFeaturedArticles);
router.get("/articles/:slug", getArticleBySlug);

// Protected routes
router.post(
  "/articles",
  authMiddleware,
  checkRole(ROLES.INSTRUCTOR),
  createArticle
);

router.put(
  "/articles/:id",
  authMiddleware,
  checkRole(ROLES.INSTRUCTOR),
  updateArticle
);

router.delete(
  "/articles/:id",
  authMiddleware,
  checkRole(ROLES.INSTRUCTOR),
  deleteArticle
);

router.post(
  "/articles/:id/like",
  authMiddleware,
  toggleLikeArticle
);

router.post(
  "/articles/:id/bookmark",
  authMiddleware,
  toggleBookmarkArticle
);

router.post(
  "/articles/:id/complete",
  authMiddleware,
  markArticleCompleted
);

module.exports = router;
