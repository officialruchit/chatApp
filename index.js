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

  client.on("disconnected", () => {
    console.log("user disconnected");
  });
});

const db = require("./config/db");
db();
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(port, () => {
  console.log("done");
});
