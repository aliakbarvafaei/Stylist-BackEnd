const express = require("express");
const router = express.Router();

//create shop validation
const vShop = require("../validators/shop.js");
//create shop controller
const cShop = require("../controllers/shop.js");

// get all product
router.get("/products", vShop.vGetAll, cShop.getAll);

// get one product
router.get("/products/:idProduct", vShop.vGetOne, cShop.getOne);

// add new product
router.post("/products", vShop.vCreate, cShop.create);

// update one product
router.put("/products/:idProduct", vShop.vUpdate, cShop.update);

// delete one product
router.delete("/products/:idProduct", vShop.vDelete, cShop.delete);

module.exports = router;
