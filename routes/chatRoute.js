const express = require("express");
const {
  getMessages,
  getMessagesByRecipientName,
} = require("../controllers/chatController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/chat/:recipientId", auth, getMessages);
router.get("/messages/:recipientName", auth, getMessagesByRecipientName);
module.exports = router;
