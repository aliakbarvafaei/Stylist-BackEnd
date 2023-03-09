const Schema = require("validate");
require("dotenv").config();
const Seller = require("../services/sellers");
const { BadRequestError } = require("../utils/errors");
const { removeFiles } = require("../utils/rmFiles");

exports.Create = async (req, res, next) => {
  try {
    if (req.files.length == 0) {
      throw new BadRequestError("عکس اجباری است");
    }
    const user = new Schema({
      phone: {
        type: String,
        required: true,
        message: {
          type: "شماره باید به صورت رشته باشد",
          required: "شماره اجباری است",
        },
      },
      firstname: {
        type: String,
        message: {
          type: "نام باید به صورت رشته باشد",
        },
      },
      lastname: {
        type: String,
        message: {
          type: "نام‌خانوادگی باید به صورت رشته باشد",
        },
      },
      typeShop: {
        type: String,
        required: true,
        message: {
          type: "نوع فروشگاه باید به صورت رشته باشد",
          required: "نوع فروشگاه اجباری است",
        },
      },
      shopname: {
        type: String,
        required: true,
        message: {
          type: "نام فروشگاه باید به صورت رشته باشد",
          required: "نام فروشگاه اجباری است",
        },
      },
      province: {
        type: String,
        required: true,
        message: {
          type: "استان باید به صورت رشته باشد",
          required: "استان اجباری است",
        },
      },
      city: {
        type: String,
        required: true,
        message: {
          type: "شهر باید به صورت رشته باشد",
          required: "شهر اجباری است",
        },
      },
      address: {
        type: String,
        required: true,
        message: {
          type: "آدرس باید به صورت رشته باشد",
          required: "آدرس اجباری است",
        },
      },
      email: {
        type: String,
        match: /^$|^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: {
          type: "ایمیل باید به صورت رشته باشد",
          match: "ساختار ایمیل نادرست است",
        },
      },
      password: {
        type: String,
        required: true,
        length: { min: 8 },
        message: {
          type: "رمزعبور باید به صورت رشته باشد",
          required: "رمزعبور اجباری است",
          length: "رمزعبور باید حداقل 8 حرف باشد",
        },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Seller.Create(req, res);
  } catch (err) {
    await removeFiles(req.files);
    return next(err);
  }
};

exports.GetOne = async (req, res, next) => {
  try {
    await Seller.GetOne(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.Login = async (req, res, next) => {
  try {
    const user = new Schema({
      phone: {
        type: String,
        required: true,
        message: {
          type: "شماره باید به صورت رشته باشد",
          required: "شماره اجباری است",
        },
      },
      password: {
        type: String,
        required: true,
        length: { min: 8 },
        message: {
          type: "رمزعبور باید به صورت رشته باشد",
          required: "رمزعبور اجباری است",
          length: "رمزعبور باید حداقل 8 حرف باشد",
        },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Seller.Login(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.PassReset = async (req, res, next) => {
  try {
    const user = new Schema({
      phone: {
        type: String,
        required: true,
        message: {
          type: "شماره باید به صورت رشته باشد",
          required: "شماره اجباری است",
        },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Seller.PassReset(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.PassChange = async (req, res, next) => {
  try {
    const user = new Schema({
      phone: {
        type: String,
        required: true,
        message: {
          type: "شماره باید به صورت رشته باشد",
          required: "شماره اجباری است",
        },
      },
      password: {
        type: String,
        required: true,
        length: { min: 8 },
        message: {
          type: "رمزعبور باید به صورت رشته باشد",
          required: "رمزعبور اجباری است",
          length: "رمزعبور باید حداقل 8 حرف باشد",
        },
      },
      code: {
        type: Number,
        required: true,
        length: { min: 5, max: 5 },
        message: {
          type: "کد باید به صورت عدد باشد",
          required: "کد اجباری است",
          length: "کد باید 5 حرف باشد",
        },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Seller.PassChange(req, res);
  } catch (err) {
    return next(err);
  }
};
