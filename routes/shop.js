const express = require("express");
const router = express.Router();

//create shop validation
const vShop = require("../validators/shop.js");
//create shop controller
const cShop = require("../controllers/shop.js");

// get all product
router.get("/products", vShop.vGetAll, cShop.getAll);

// get one product
router.get("/products/:productId", vShop.vGetOne, cShop.getOne);

// get my products for sellers
router.get("/myproducts", vShop.vGetMyProduct, cShop.getMyProduct);

// add new product
router.post("/products", vShop.vCreate, cShop.create);

// update one product
router.put("/products/:productId", vShop.vUpdate, cShop.update);

// delete one product
router.delete("/products/:productId", vShop.vDelete, cShop.delete);

module.exports = router;
