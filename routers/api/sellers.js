const express = require("express");
const router = express.Router();

const Seller = require("../../controllers/sellers.controller.js");
const { imageUpload } = require("../../utils/multer.js");

//create sellers router
router.post("", imageUpload.array("images", 1), (req, res, next) => {
  Seller.CreateSeller(req, res, next);
});

//update sellers router
router.put("", imageUpload.array("images", 1), (req, res, next) => {
  Seller.UpdateSeller(req, res, next);
});

//get one sellers router
router.get("", Seller.GetOne);

//login sellers router
router.post("/login", Seller.Login);

//password reset sellers router
router.post("/password-reset", Seller.PassReset);

//password change sellers router
router.post("/password-change", Seller.PassChange);

module.exports = router;
