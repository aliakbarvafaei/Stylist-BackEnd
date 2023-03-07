const express = require("express");
const router = express.Router();
const User = require("../../controllers/users.controller.js");

// //create user router
// router.post('', vUser.vUserCraete, cUser.create)

//update user router
router.put("", User.Update);

// //delete user router
// router.delete('/:userId', vUser.vUserDelete, cUser.delete)

//get one user router
router.get("", User.GetOne);

// //get all user router
// router.get('', User.getAll)

//login user router
router.post("/login", User.Login);

//login with code user router
router.post("/login-code", User.LoginCode);

//login with pass user router
router.post("/login-pass", User.LoginPass);

//password reset user router
router.post("/password-reset", User.PassReset);

//password change user router
router.post("/password-change", User.PassChange);

module.exports = router;
