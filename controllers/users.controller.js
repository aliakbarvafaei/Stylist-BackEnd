const Schema = require("validate");
require("dotenv").config();
const User = require("../services/users");
const { BadRequestError, InternalServerError } = require("../utils/errors");

exports.Update = async (req, res, next) => {
  try {
    const user = new Schema({
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
      address: {
        type: String,
        message: {
          type: "آدرس باید به صورت رشته باشد",
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
      phone: {
        type: String,
        message: {
          type: "شماره تلفن باید به صورت رشته باشد",
        },
      },
      age: {
        type: Number,
        message: {
          type: "سن باید به صورت عددی باشد",
        },
      },
      gender: {
        type: String,
        enum: ["مرد", "زن"],
        message: {
          type: "جنسیت باید به صورت رشته باشد",
          enum: "جنسیت باید یکی از مقادیر زن یا مرد باشد",
        },
      },
      oldPassword: {
        type: String,
        length: { min: 8 },
        message: {
          type: "رمزعبورقبلی باید به صورت رشته باشد",
          length: "رمزعبورقبلی باید حداقل 8 حرف باشد",
        },
      },
      password: {
        type: String,
        length: { min: 8 },
        message: {
          type: "رمزعبور باید به صورت رشته باشد",
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
    await User.Update(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.GetOne = async (req, res, next) => {
  try {
    await User.GetOne(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.Login = async (req, res, next) => {
  try {
    const user = new Schema({
      email: {
        type: String,
        match: /^$|^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: {
          type: "ایمیل باید به صورت رشته باشد",
          match: "ساختار ایمیل نادرست است",
        },
      },
      phone: {
        type: String,
        message: {
          type: "شماره تلفن باید به صورت رشته باشد",
        },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await User.Login(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.LoginCode = async (req, res, next) => {
  try {
    const user = new Schema({
      phone: {
        type: String,
        required: true,
        message: {
          type: "شماره تلفن باید به صورت رشته باشد",
          required: "شماره تلفن اجباری است",
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
    await User.LoginCode(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.LoginPass = async (req, res, next) => {
  try {
    const user = new Schema({
      email: {
        type: String,
        match: /^$|^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: {
          type: "ایمیل باید به صورت رشته باشد",
          match: "ساختار ایمیل نادرست است",
        },
      },
      phone: {
        type: String,
        message: {
          type: "شماره تلفن باید به صورت رشته باشد",
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
    await User.LoginPass(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.PassReset = async (req, res, next) => {
  try {
    const user = new Schema({
      email: {
        type: String,
        match: /^$|^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: {
          type: "ایمیل باید به صورت رشته باشد",
          match: "ساختار ایمیل نادرست است",
        },
      },
      phone: {
        type: String,
        message: {
          type: "شماره باید به صورت رشته باشد",
        },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await User.PassReset(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.PassChange = async (req, res, next) => {
  try {
    const user = new Schema({
      email: {
        type: String,
        match: /^$|^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: {
          type: "ایمیل باید به صورت رشته باشد",
          match: "ساختار ایمیل نادرست است",
        },
      },
      phone: {
        type: String,
        message: {
          type: "شماره باید به صورت رشته باشد",
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
    await User.PassChange(req, res);
  } catch (err) {
    return next(err);
  }
};
