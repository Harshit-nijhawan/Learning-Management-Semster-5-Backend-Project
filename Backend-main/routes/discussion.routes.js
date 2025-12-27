const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussion.controller");
const protect = require("../middlewares/auth.middleware");

// Public routes (read-only could be public, but for now we protect all for simplicity or user context)
// Actually, let's allow reading without auth later if needed, but for now require login.
router.use(protect);

// Discussion Routes
router.post("/", discussionController.createDiscussion);
router.get("/", discussionController.getDiscussions);
router.get("/:id", discussionController.getDiscussionById);
router.put("/:id/vote", discussionController.voteDiscussion);

// Comment Routes
router.post("/:id/comment", discussionController.addComment);
router.get("/:id/comments", discussionController.getComments);
router.put("/comment/:id/vote", discussionController.voteComment);

module.exports = router;
