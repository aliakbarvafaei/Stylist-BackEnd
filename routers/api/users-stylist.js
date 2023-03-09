const express = require("express");
const router = express.Router();

const User = require("../../controllers/users-stylist.controller.js");

//get one user-stylist router
router.get("", User.GetOne);

//login user-stylist router
router.post("/login", User.Login);

//password reset user-stylist router
router.post("/password-reset", User.PassReset);

//password change user-stylist router
router.post("/password-change", User.PassChange);

module.exports = router;
