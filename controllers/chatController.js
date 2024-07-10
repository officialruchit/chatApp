const Chat = require("../models/chat");

exports.getMessages = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const userId = req.user.id;
    const chat = await Chat.findOne({
      participants: { $all: [userId, recipientId] },
    }).populate("messages.sender", "name");
    if (!chat) {
      return res.status(404).json({ message: "No chat found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
