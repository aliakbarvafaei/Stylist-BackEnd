//config database for send query
const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const mailSignup = require("../functions/email").mailSignup;
const mailResetPass = require("../functions/email").mailResetPass;
const sendSmsForget = require("../functions/sms").sendSmsForget;
const md5 = require("md5");
const db = new PrismaClient();
const exclude = require("../functions/exclude").exclude;
require("dotenv").config();

exports.getOne = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), process.env.SECRET_TOKEN).id;
  } catch (err) {
    console.log(err);
    if (err.name === "TokenExpiredError")
      return res.status(400).json({ message: "زمان ورود شما منقضی شده است" });
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "توکن احراز هویت نامعتبر است" });
    } else {
      return res.status(400).json({ message: "خطای احراز هویت" });
    }
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
    return res.status(404).json({ message: "کاربری با این شناسه وجود ندارد" });
  }
};

exports.login = async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;

  //check phone exist
  let user_phone = await db.User_Stylist.findFirst({
    where: {
      phone: phone,
    },
  });
  if (!user_phone) {
    return res
      .status(404)
      .json({ message: "شخصی با این شماره موجود نمی‌باشد" });
  }

  //check password exist
  let user_password = await db.User_Stylist.findFirst({
    where: {
      phone: phone,
      password: md5(password),
    },
  });
  if (!user_password) {
    return res.status(401).json({ message: "رمز عبور صحیح نمی‌باشد" });
  } else {
    return res
      .status(200)
      .json({ data: jwt.sign(user_password, process.env.SECRET_TOKEN) });
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
    //// send sms to phone number
    sendSmsForget(phone, code);
    return res.status(200).json({ message: "کد فراموشی رمزعبور ارسال شد" });
  } else {
    return res.status(404).json({ message: "کاربری با این شماره وجود ندارد" });
  }
};

exports.PassChange = async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;
  const code = req.body.code;
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
    return res.status(401).json({ message: "کد فراموشی رمز اشتباه است" });
  } else {
    return res
      .status(404)
      .json({ message: "ابتدا باید درخواست کد فراموشی ارسال شود" });
  }
};
