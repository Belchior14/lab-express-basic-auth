const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const async = require("hbs/lib/async");
const { route } = require("../app");
const {isLoggedIn} = require("../middlewares/guard")

const saltRounds = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signin", (req, res) => {
  res.render("user/signin");
});

router.post("/signin", async (req, res) => {
  const user = new User();
  user.username = req.body.username;
  const hash = await bcrypt.hash(req.body.password, saltRounds);
  user.password = hash;
  try {
    await user.save();
    res.redirect("/");
  } catch (error) {
    ("Error somewhere");
  }
});

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordCorrect) {
      req.session.currentUser = user;
      res.redirect("/main");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/main", (req, res) => {
  res.render("main");
});

router.get("/private", isLoggedIn ,(req, res) => {
  res.render("private");
});

module.exports = router;
