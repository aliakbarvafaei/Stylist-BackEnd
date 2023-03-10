const Schema = require("validate");
require("dotenv").config();
const Shop = require("../services/shop");
const { BadRequestError } = require("../utils/errors");
const { removeFiles } = require("../utils/rmFiles");

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

exports.CreateProduct = async (req, res, next) => {
  try {
    const product = new Schema({
      title: {
        type: String,
        required: true,
        message: {
          type: "عنوان آگهی باید به صورت رشته باشد",
          required: "عنوان آگهی اجباری است",
        },
      },
      detail: {
        type: String,
        message: {
          type: "جزئیات آگهی باید به صورت رشته باشد",
        },
      },
      price: {
        type: String,
        required: true,
        message: {
          type: "قیمت آگهی باید به صورت عددی باشد",
          required: "قیمت آگهی اجباری است",
        },
      },
      quantity: {
        type: String,
        required: true,
        message: {
          type: "موجودی آگهی باید به صورت عددی باشد",
          required: "موجودی آگهی اجباری است",
        },
      },
      discount: {
        type: String,
        message: {
          type: "درصد تخفیف آگهی باید به صورت عددی باشد",
        },
      },
    });
    var res_data = [];
    const errors = product.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });

    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Shop.CreateProduct(req, res);
  } catch (err) {
    await removeFiles(req.files);
    return next(err);
  }
};

exports.UpdateProduct = async (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      throw new BadRequestError("شناسه محصول باید عدد باشد");

    const product = new Schema({
      title: {
        type: String,
        message: {
          type: "عنوان آگهی باید به صورت رشته باشد",
        },
      },
      detail: {
        type: String,
        message: {
          type: "جزئیات آگهی باید به صورت رشته باشد",
        },
      },
      price: {
        type: String,
        message: {
          type: "قیمت آگهی باید به صورت عددی باشد",
        },
      },
      quantity: {
        type: String,
        message: {
          type: "موجودی آگهی باید به صورت عددی باشد",
        },
      },
      discount: {
        type: String,
        message: {
          type: "درصد تخفیف آگهی باید به صورت عددی باشد",
        },
      },
    });
    var res_data = [];
    const errors = product.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });

    if (res_data.length > 0) throw new BadRequestError(res_data);

    await Shop.UpdateProduct(req, res);
  } catch (err) {
    await removeFiles(req.files);
    return next(err);
  }
};

exports.DeleteProduct = async (req, res, next) => {
  try {
    if (!(req.params.productId == parseInt(req.params.productId)))
      throw new BadRequestError("شناسه محصول باید عدد باشد");
    await Shop.DeleteProduct(req, res);
  } catch (err) {
    return next(err);
  }
};
