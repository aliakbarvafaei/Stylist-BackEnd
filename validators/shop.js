//config database for send query
const Schema = require("validate");
require("dotenv").config();

exports.vGetAll = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vGetOne = (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      return res.status(400).json({ message: "شناسه محصول باید عدد باشد" });
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vGetMyProduct = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vCreate = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vUpdate = (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      return res.status(400).json({ message: "شناسه محصول باید عدد باشد" });
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vDelete = (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      return res.status(400).json({ message: "شناسه محصول باید عدد باشد" });
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};
