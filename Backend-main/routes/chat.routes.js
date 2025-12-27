const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const protect = require("../middlewares/auth.middleware");

// Apply auth middleware to all chat routes
router.use(protect);

router.post("/send", chatController.sendMessage);
router.get("/conversations", chatController.getConversations);
router.get("/contacts", chatController.getContacts);
router.get("/:userId", chatController.getMessages);

module.exports = router;
