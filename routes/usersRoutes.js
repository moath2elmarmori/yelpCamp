const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const usersControllers = require("../controllers/usersControllers");

// @desc Rendering Register Form
// @route GET /register
// @access public
router.get("/register", usersControllers.renderRegisterForm);

// @desc Registering New User
// @route POST /register
// @access public
router.post("/register", catchAsync(usersControllers.registerUser));

// @desc Rendering Login Form
// @route GET /login
// @access public
router.get("/login", usersControllers.renderLoginForm);

// @desc Logging User In
// @route POST /login
// @access public
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  usersControllers.loginUser
);

// @desc Logging User Out
// @route GET /logout
// @access public
router.get("/logout", usersControllers.logoutUser);

module.exports = router;
