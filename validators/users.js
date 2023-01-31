//config database for send query
const { PrismaClient } = require("@prisma/client");
const Schema = require("validate");
const { add } = require("lodash");
const db = new PrismaClient();
var jwt = require("jsonwebtoken");
require("dotenv").config();

//lodash
const { parseInt } = require("lodash");
const _ = require("lodash");
const SECRET = "secret";

exports.vUserCraete = (req, res, next) => {
  try {
    const user = new Schema({
      firstname: {
        type: String,
        message: {
          type: 'نام باید به صورت رشته باشد.'
        }
      },
      lastname: {
        type: String,
        message: {
          type: 'نام‌خانوادگی باید به صورت رشته باشد.'
        }
      },
      email: {
        type: String,
        required: true,
        message: {
          type: 'ایمیل باید به صورت رشته باشد.',
          required: 'ایمیل اجباری است.'
        }
      },
      phone: {
        type: Number,
        message: {
          type: 'شماره تلفن باید به صورت عددی باشد.'
        }
      },
      age: {
        type: Number,
        required: true,
        message: {
          type: 'سن باید به صورت عددی باشد.',
          required: 'سن اجباری است.'
        }
      },
      gender: {
        type: String,
        enum: ["مرد", "زن"],
        required: true,
        message: {
          type: 'جنسیت باید به صورت رشته باشد.',
          enum: 'جنسیت باید یکی از مقادیر زن یا مرد باشد.',
          required: 'جنسیت اجباری است.'
        }
      },
      password: {
        type: String,
        required: true,
        length: { min: 8 },
        message: {
          type: 'رمزعبور باید به صورت رشته باشد.',
          required: 'رمزعبور اجباری است.',
          length: 'رمزعبور باید حداقل 8 حرف باشد.'
        }
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).send(res_data);
    const email_validation = require("email-validator");
    if (!email_validation.validate(req.body.email)) {
      return res.status(400).send("ساختار ایمیل نادرست است.");
    }
    // console.log(req.header("Authorization"));
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
};

exports.vUserLogin = (req, res, next) => {
  try {
    const user = new Schema({
      email: {
        type: String,
        required: true,
        message: {
          type: 'ایمیل باید به صورت رشته باشد.',
          required: 'ایمیل اجباری است.'
        }
      },
      password: {
        type: String,
        required: true,
        length: { min: 8 },
        message: {
          type: 'رمزعبور باید به صورت رشته باشد.',
          required: 'رمزعبور اجباری است.',
          length: 'رمزعبور باید حداقل 8 حرف باشد.'
        }
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).send(res_data);
    const email_validation = require("email-validator");
    if (!email_validation.validate(req.body.email)) {
      return res.status(400).send("ساختار ایمیل نادرست است.");
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
};

exports.vUserUpdate = async (req, res, next) => {
  try {
    const user = new Schema({
      firstname: {
        type: String,
        message: {
          type: 'نام باید به صورت رشته باشد.'
        }
      },
      lastname: {
        type: String,
        message: {
          type: 'نام‌خانوادگی باید به صورت رشته باشد.'
        }
      },
      email: {
        type: String,
        message: {
          type: 'ایمیل باید به صورت رشته باشد.'
        }
      },
      phone: {
        type: Number,
        message: {
          type: 'شماره تلفن باید به صورت عددی باشد.'
        }
      },
      age: {
        type: Number,
        message: {
          type: 'سن باید به صورت عددی باشد.'
        }
      },
      gender: {
        type: String,
        enum: ["مرد", "زن"],
        message: {
          type: 'جنسیت باید به صورت رشته باشد.',
          enum: 'جنسیت باید یکی از مقادیر زن یا مرد باشد.'
        }
      },
      password: {
        type: String,
        length: { min: 8 },
        message: {
          type: 'رمزعبور باید به صورت رشته باشد.',
          length: 'رمزعبور باید حداقل 8 حرف باشد.'
        }
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).send(res_data);
    const email_validation = require("email-validator");
    if (req.body.email && !email_validation.validate(req.body.email)) {
      return res.status(400).send("ساختار ایمیل نادرست است.");
    }
    try {
      jwt.verify(req.header("Authorization"), SECRET);
    } catch {
      return res.status(400).send("توکن احراز هویت نامعتبر است.");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
};

exports.vUserDelete = async (req, res, next) => {
  try {
    try {
      jwt.verify(req.header("Authorization"), SECRET);
    } catch {
      return res.status(400).send("توکن احراز هویت نامعتبر است.");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
};

exports.vGetOne = (req, res, next) => {
  try {
    try {
      jwt.verify(req.header("Authorization"), SECRET);
    } catch {
      return res.status(400).send("توکن احراز هویت نامعتبر است.");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
};
