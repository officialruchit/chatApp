const model = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.signup = async (req, res) => {
  try {
    const { name, mail, password } = req.body;
    let user = await model.findOne({ mail });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new model({
      name,
      mail,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newuser.id }, process.env.JWT_SECRET, {
      expiresIn: "23h",
    });

    await newuser.save();
    res.status(201).json(token);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send("Server error: " + err.message);
  }
};

exports.signin = async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await model.findOne({ mail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ Message: "succeccfully login" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.alluser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const users = await model
      .find({ _id: { $ne: currentUserId } })
      .select("-password")
      .limit(parseInt(limit));

    const totalUsers = await model.countDocuments({
      _id: { $ne: currentUserId },
    });

    res.status(201).json({
      Page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.searchByName = async (req, res) => {
  try {
    const { query } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const user = await model
      .find({ name: { $regex: query, $options: "i" } })
      .select("name -_id")
      .limit(parseInt(limit));

    const totalCount = await model.countDocuments({
      name: { $regex: query, $options: "i" },
    });

    res.status(201).json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit),
      user,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.me = async (req, res) => {
  try {
    const user = await model.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
