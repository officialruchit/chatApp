const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const bodyparser = require("body-parser");
app.use(bodyparser.json());
require("dotenv").config();
const port = process.env.PORT || 3333;

io.on("connection", (client) => {
  console.log("a user connected");

  client.on("join", ({ userId, username }) => {
    console.log(`User ${userId} joined as ${username}`);
    client.join(userId);
  });

  client.on("private_message", ({ receiverId, message }) => {
    console.log(
      `Private message to ${receiverId} from ${client.id}: ${message}`
    );
    client.to(receiverId).emit("private_message", {
      message,
      sender: client.id,
    });
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
