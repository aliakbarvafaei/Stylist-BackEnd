const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// config image save with multer
const imageStorage = multer.diskStorage({
  destination: "public/images", // Destination to store image
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image), path.extname get the uploaded file extension
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("فرمت عکس باید jpg یا png باشد"));
    }
    cb(undefined, true);
  },
});

//create sellers controller
const Seller = require("../../controllers/sellers.controller.js");

//create sellers router
router.post("", imageUpload.array("images", 1), (req, res, next) => {
  Seller.CreateSeller(req, res, next);
});

//update sellers router
router.put("", imageUpload.array("images", 1), (req, res, next) => {
  Seller.UpdateSeller(req, res, next);
});

// //get all sellers router
// router.get('', cUser.getAll)

// //update sellers router
// router.put('', vUser.vUserUpdate, cUser.update)

// //delete sellers router
// router.delete('/:userId', vUser.vUserDelete, cUser.delete)

//get one sellers router
router.get("", Seller.GetOne);

//login sellers router
router.post("/login", Seller.Login);

//password reset sellers router
router.post("/password-reset", Seller.PassReset);

//password change sellers router
router.post("/password-change", Seller.PassChange);

module.exports = router;
