const express = require("express");
const router = express.Router();

const Closet = require("../../controllers/closet.controller.js");
const { imageUpload } = require("../../utils/multer.js");

///////////////// All API for myclothes

// get all categories router
router.get("/myclothes/categories/:gender", Closet.ClothesCategories);

//create category router
router.post("/myclothes", Closet.ClothesCategoryCraete);

//get all categories of user router
router.get("/myclothes", Closet.ClothesCategoryGetAll);

//delete one category router
router.delete("/myclothes/:categoryId", Closet.ClothesCategoryDelete);

//update one category router
router.put("/myclothes/:categoryId", Closet.ClothesCategoryUpdate);

//add clothing to category router
router.post(
  "/myclothes/:categoryId",
  imageUpload.array("images", 5),
  (req, res, next) => Closet.ClothesClothingCreate(req, res, next)
);

//get all clothing in category router
router.get("/myclothes/:categoryId", Closet.ClothesClothingGetAll);

//update one clothing in category router
router.put("/myclothes/:categoryId/:clothingId", Closet.ClothesClothingUpdate);

//delete one clothing in category router
router.delete(
  "/myclothes/:categoryId/:clothingId",
  Closet.ClothesClothingDelete
);

//get one clothing in category router
router.get("/myclothes/:categoryId/:clothingId", Closet.ClothesClothingGetOne);

///////////////// All API for mysets

//create category router
router.post("/mysets", Closet.SetsCategoryCraete);

//get all category router
router.get("/mysets", Closet.SetsCategoryGetAll);

//delete one category router
router.delete("/mysets/:categoryId", Closet.SetsCategoryDelete);

//update one category router
router.put("/mysets/:categoryId", Closet.SetsCategoryUpdate);

//add set to category router
router.post(
  "/mysets/:categoryId",
  imageUpload.array("images", 5),
  (req, res, next) => Closet.SetsClothingCreate(req, res, next)
);

//get all set in category router
router.get("/mysets/:categoryId", Closet.SetsClothingGetAll);

// //update one set in category router
// router.put(
//   "/mysets/:categoryId/:setId",
//   vCloset.vSetsClothingUpdate,
//   cCloset.SetsClothingUpdate
// );

//delete one set in category router
router.delete("/mysets/:categoryId/:setId", Closet.SetsClothingDelete);

//get one set in category router
router.get("/mysets/:categoryId/:setId", Closet.SetsClothingGetOne);

module.exports = router;
