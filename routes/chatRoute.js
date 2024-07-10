const express = require("express");
const { getMessages } = require("../controllers/chatController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/chat/:recipientId", auth, getMessages);

module.exports = router;
