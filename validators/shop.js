//config database for send query
const Schema = require("validate");
require("dotenv").config();

exports.vGetAll = (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vGetOne = (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      return res.status(400).json({ message: "شناسه محصول باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vAddToCart = (req, res, next) => {
  try {
    const addCart = new Schema({
      productId: {
        type: Number,
        required: true,
        message: {
          type: "شناسه محصول باید به صورت عددی باشد",
          required: "شناسه محصول اجباری است",
        },
      },
      quantity: {
        type: Number,
        required: true,
        message: {
          type: "تعداد محصول باید به صورت عددی باشد",
          required: "تعداد محصول اجباری است",
        },
      },
    });
    var res_data = [];
    const errors = addCart.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).json({ message: res_data });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vGetCart = (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vGetMyProduct = (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vCreate = (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vUpdate = (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      return res.status(400).json({ message: "شناسه محصول باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vDelete = (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      return res.status(400).json({ message: "شناسه محصول باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};
