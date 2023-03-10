const express = require("express");
const router = express.Router();

//create shop controller
const Shop = require("../../controllers/shop.controller.js");
const { imageUpload } = require("../../utils/multer.js");

/// for users

// get all product
router.get("/products", Shop.GetAll);

// get one product
router.get("/products/:productId", Shop.GetOne);

// add to cart
router.post("/cart", Shop.AddToCart);

// get cart
router.get("/cart", Shop.GetCart);

/// for sellers

// get my products for sellers
router.get("/myproducts", Shop.GetMyProduct);

// add new product
router.post("/products", imageUpload.array("images", 5), (req, res, next) => {
  Shop.CreateProduct(req, res, next);
});

// update one product
router.put(
  "/products/:productId",
  imageUpload.array("images", 5),
  (req, res, next) => {
    Shop.UpdateProduct(req, res, next);
  }
);

// delete one product
router.delete("/products/:productId", Shop.DeleteProduct);

module.exports = router;
