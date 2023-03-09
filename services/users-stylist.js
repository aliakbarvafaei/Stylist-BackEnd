const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const mailSignup = require("../utils/email").mailSignup;
const mailResetPass = require("../utils/email").mailResetPass;
const sendSmsForget = require("../utils/sms").sendSmsForget;
const md5 = require("md5");
const { isAuthunticated } = require("../utils/auth");
const { NotFoundError } = require("../utils/errors");
const db = new PrismaClient();
const exclude = require("../utils/exclude").exclude;
require("dotenv").config();

exports.GetOne = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "stylist") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
  }

  let user = await db.User_Stylist.findFirst({
    where: {
      id: id,
    },
    include: {
      counseling: true,
    },
  });

  if (user) {
    return res.status(200).json({
      ...exclude(user, ["password"]),
      hasPassword: user.password && user.password != "" ? true : false,
    });
  } else {
    throw new NotFoundError("کاربری با این شناسه وجود ندارد");
  }
};

exports.Login = async (req, res) => {
  const { phone, password } = req.body;

  //check phone exist
  let user_phone = await db.User_Stylist.findFirst({
    where: {
      phone: phone,
    },
  });
  if (!user_phone) {
    throw new NotFoundError("شخصی با این شماره موجود نمی‌باشد");
  }

  //check password exist
  let user_password = await db.User_Stylist.findFirst({
    where: {
      phone: phone,
      password: md5(password),
    },
  });

  if (!user_password) {
    throw new UnauthorizedError("رمز عبور صحیح نمی‌باشد");
  } else {
    return res.status(200).json({
      data: jwt.sign(
        { ...user_password, type: "stylist" },
        process.env.SECRET_TOKEN
      ),
    });
  }
};

exports.PassReset = async (req, res) => {
  const phone = req.body.phone;

  let user = await db.User_Stylist.findFirst({
    where: {
      phone: phone,
    },
  });

  if (user) {
    const code = Math.floor(10000 + Math.random() * 90000);

    let row = await db.PassReset.findFirst({
      where: {
        user: phone,
      },
    });

    if (row) {
      let updated_user = await db.PassReset.update({
        where: {
          user: phone,
        },
        data: {
          code: code,
        },
      });
    } else {
      let newRow = await db.PassReset.create({
        data: {
          user: phone,
          code: code,
        },
      });
    }
    // send sms to phone number
    sendSmsForget(phone, code);

    return res.status(200).json({ message: "کد فراموشی رمزعبور ارسال شد" });
  } else {
    throw new NotFoundError("کاربری با این شماره وجود ندارد");
  }
};

exports.PassChange = async (req, res) => {
  const { phone, password, code } = req.body;

  let user = await db.PassReset.findFirst({
    where: {
      user: phone,
    },
  });

  if (user && user.code === code) {
    let updated_user = await db.User_Stylist.update({
      where: {
        phone: phone,
      },
      data: {
        password: md5(password),
      },
    });

    return res.status(200).json({ message: "رمزعبور با موفقیت تغییر کرد" });
  } else if (user) {
    throw new UnauthorizedError("کد فراموشی رمز اشتباه است");
  } else {
    throw new NotFoundError("ابتدا باید درخواست کد فراموشی ارسال شود");
  }
};
