const express = require("express");
const route = express.Router();
const user = require("../controllers/userController");
const { auth } = require("../middleware/auth");
route.get("/all/:id", auth, user.alluser);
route.post("/signin", user.signin);
route.post("/signup", user.signup);
route.get("/search", auth, user.searchByName);
module.exports = route;
