const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const bodyparser = require("body-parser");
app.use(bodyparser.json());
const Chat = require("./models/chat");
require("dotenv").config();
const port = process.env.PORT || 3333;

io.on("connection", (client) => {
  console.log("a user connected");

  client.on("sendMessage", async (data) => {
    const { recipientId, text, senderId } = data;
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
    });
    if (!chat) {
      chat = new Chat({ participants: [senderId, recipientId] });
    }
    chat.messages.push({ sender: senderId, text });
    await chat.save();
  });

  client.on("disconnected", () => {
    console.log("user disconnected");
  });
});

const db = require("./config/db");
db();
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
app.use("/", chatRoute);
app.use("/", userRoute);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(port, () => {
  console.log("done");
});
