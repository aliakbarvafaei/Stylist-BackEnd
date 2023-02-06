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
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

//create user validation
const vCloset = require("../validators/closet.js");
//create user controller
const cCloset = require("../controllers/closet.js");

///////////////// All API for myclothes

// get all categories router
router.get(
  "/myclothes/categories/:gender",
  vCloset.vClothesCategories,
  cCloset.ClothesCategories
);

//create category router
router.post(
  "/myclothes",
  vCloset.vClothesCategoryCraete,
  cCloset.ClothesCategoryCreate
);

//get all categories of user router
router.get(
  "/myclothes",
  vCloset.vClothesCategoryGetAll,
  cCloset.ClothesCategoryGetAll
);

//delete one category router
router.delete(
  "/myclothes/:categoryId",
  vCloset.vClothesCategoryDelete,
  cCloset.ClothesCategoryDelete
);

//update one category router
router.put(
  "/myclothes/:categoryId",
  vCloset.vClothesCategoryUpdate,
  cCloset.ClothesCategoryUpdate
);

//add clothing to category router
router.post(
  "/myclothes/:categoryId",
  imageUpload.array("images", 5),
  (req, res, next) => vCloset.vClothesClothingCreate(req, res, next),
  (req, res) => cCloset.ClothesClothingCreate(req, res)
);

//get all clothing in category router
router.get(
  "/myclothes/:categoryId",
  vCloset.vClothesClothingGetAll,
  cCloset.ClothesClothingGetAll
);

//update one clothing in category router
router.put(
  "/myclothes/:categoryId/:clothingId",
  vCloset.vClothesClothingUpdate,
  cCloset.ClothesClothingUpdate
);

//delete one clothing in category router
router.delete(
  "/myclothes/:categoryId/:clothingId",
  vCloset.vClothesClothingDelete,
  cCloset.ClothesClothingDelete
);

//get one clothing in category router
router.get(
  "/myclothes/:categoryId/:clothingId",
  vCloset.vClothesClothingGetOne,
  cCloset.ClothesClothingGetOne
);

///////////////// All API for mysets

//create category router
router.post("/mysets", vCloset.vSetsCategoryCraete, cCloset.SetsCategoryCreate);

//get all category router
router.get("/mysets", vCloset.vSetsCategoryGetAll, cCloset.SetsCategoryGetAll);

//delete one category router
router.delete(
  "/mysets/:categoryId",
  vCloset.vSetsCategoryDelete,
  cCloset.SetsCategoryDelete
);

//update one category router
router.put(
  "/mysets/:categoryId",
  vCloset.vSetsCategoryUpdate,
  cCloset.SetsCategoryUpdate
);

//add set to category router
router.post(
  "/mysets/:categoryId",
  imageUpload.array("images", 5),
  (req, res, next) => vCloset.vSetsClothingCreate(req, res, next),
  (req, res) => cCloset.SetsClothingCreate(req, res)
);

//get all set in category router
router.get(
  "/mysets/:categoryId",
  vCloset.vSetsClothingGetAll,
  cCloset.SetsClothingGetAll
);

// //update one set in category router
// router.put(
//   "/mysets/:categoryId/:setId",
//   vCloset.vSetsClothingUpdate,
//   cCloset.SetsClothingUpdate
// );

//delete one set in category router
router.delete(
  "/mysets/:categoryId/:setId",
  vCloset.vSetsClothingDelete,
  cCloset.SetsClothingDelete
);

//get one set in category router
router.get(
  "/mysets/:categoryId/:setId",
  vCloset.vSetsClothingGetOne,
  cCloset.SetsClothingGetOne
);

module.exports = router;
