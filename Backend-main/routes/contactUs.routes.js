const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/contactUs.controller");

router.post("/contactUs", getMessages);

module.exports = router;
