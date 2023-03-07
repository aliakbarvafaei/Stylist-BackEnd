const Schema = require("validate");
require("dotenv").config();
const UserStylist = require("../services/users-stylist");
const { BadRequestError } = require("../utils/errors");

exports.GetOne = async (req, res, next) => {
  try {
    await UserStylist.getOne(req, res);
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
    await UserStylist.login(req, res);
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
    await UserStylist.PassReset(req, res);
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
    await UserStylist.PassChange(req, res);
  } catch (err) {
    return next(err);
  }
};
