const Schema = require("validate");
require("dotenv").config();
const Shop = require("../services/shop");
const { BadRequestError } = require("../utils/errors");

exports.GetAll = async (req, res, next) => {
  try {
    await Shop.GetAll(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.GetOne = async (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      throw new BadRequestError("شناسه محصول باید عدد باشد");
    await Shop.GetOne(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.AddToCart = async (req, res, next) => {
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
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Shop.AddToCart(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.GetCart = async (req, res, next) => {
  try {
    await Shop.GetCart(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.GetMyProduct = async (req, res, next) => {
  try {
    await Shop.GetMyProduct(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.Create = async (req, res, next) => {
  try {
    await Shop.Create(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.Update = async (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      throw new BadRequestError("شناسه محصول باید عدد باشد");
    await Shop.Update(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.Delete = async (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      throw new BadRequestError("شناسه محصول باید عدد باشد");
    await Shop.Delete(req, res);
  } catch (err) {
    return next(err);
  }
};
