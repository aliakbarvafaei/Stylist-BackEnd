const router = require("express").Router();

router.use("/closet", require("./closet"));

router.use("/images", require("./images"));

router.use("/sellers", require("./sellers"));

router.use("/shop", require("./shop"));

router.use("/users", require("./users"));

router.use("/users-stylist", require("./users-stylist"));

module.exports = router;
