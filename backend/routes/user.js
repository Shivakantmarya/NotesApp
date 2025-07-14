const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const notesModel = require("../models/notes");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("profilePic"), async (req, res) => {
  const { name, email, password } = req.body;
  const profilePicPath = req.file ? req.file.path : "";

  try {
    //check existing user
    const existUser = await userModel.findOne({ email });
    if (existUser)
      return res.status(400).json({ message: "User Already Exist!" });

    //hashed password
    const hashedPass = await bcrypt.hash(password, 10);

    //save newUser
    const newUser = await new userModel({
      name,
      email,
      password: hashedPass,
      profilePic: profilePicPath,
    });

    await newUser.save();
    

    res.status(201).json({ message: "User Save Succefully!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

//login routes

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //find user by Email
    const isUser = await userModel.findOne({ email });
    if (!isUser) return res.json("User Not Exist!");

    //match password
    const isPass = await bcrypt.compare(password, isUser.password);
    if (!isPass) return res.json("Invalid Credentials!");

    //create jwt token
    const token = jwt.sign(
      { userId: isUser._id, email: isUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log("login successfull", token);
    return res.json({
      message: "Login Successful",
      token,
      user: {
        id: isUser._id,
        name: isUser.name,
        email: isUser.email,
        profilePic : isUser.profilePic
      },
    });
  } catch (err) {
    return res.json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
