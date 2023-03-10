const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const mailSignup = require("../utils/email").mailSignup;
const mailResetPass = require("../utils/email").mailResetPass;
const sendSmsForget = require("../utils/sms").sendSmsForget;
const md5 = require("md5");
const fs = require("fs");
const { isAuthunticated } = require("../utils/auth");
const {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} = require("../utils/errors");
const db = new PrismaClient();
const exclude = require("../utils/exclude").exclude;
require("dotenv").config();

exports.CreateSeller = async (req, res) => {
  const {
    firstname,
    lastname,
    typeShop,
    shopname,
    province,
    city,
    address,
    email,
    phone,
    password,
  } = req.body;

  try {
    const seller = await db.Seller.create({
      data: {
        firstName: firstname,
        lastName: lastname,
        typeShop: typeShop,
        shopName: shopname,
        logoUrl: req.get("host") + `/images/${req.files[0].filename}`,
        email: email,
        phone: phone,
        password: md5(password),
        address: {
          create: {
            province: province,
            city: city,
            address: address,
          },
        },
      },
    });
    return res.status(201).json({ message: "فروشنده با موفقیت ایجاد شد" });
  } catch (err) {
    if (err.code && err.code === "P2002") {
      throw new ConflictError("فروشنده‌ای با این شماره تلفن وجود دارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.UpdateSeller = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "seller") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
  }

  const firstname = req.body.firstname === "" ? undefined : req.body.firstname;
  const lastname = req.body.lastname === "" ? undefined : req.body.lastname;
  const typeShop = req.body.typeShop === "" ? undefined : req.body.typeShop;
  const shopname = req.body.shopname === "" ? undefined : req.body.shopname;
  const province = req.body.province === "" ? undefined : req.body.province;
  const city = req.body.city === "" ? undefined : req.body.city;
  const address = req.body.address === "" ? undefined : req.body.address;
  const email = req.body.email === "" ? undefined : req.body.email;
  const phone = req.body.phone === "" ? undefined : req.body.phone;
  const old_password = req.body.oldPassword;
  var new_password = req.body.password;

  var oldLogo = undefined;

  if (new_password && new_password !== "") {
    let user = await db.Seller.findFirst({
      where: {
        id: id,
      },
    });
    oldLogo = user.logoUrl;
    if (user) {
      if (user.password && user.password !== "") {
        if (old_password) {
          if (user.password !== md5(old_password)) {
            throw new UnauthorizedError("رمز قبلی اشتباه است");
          }
        } else {
          throw new BadRequestError("رمز قبلی باید ارسال شود");
        }
      }
    } else {
      throw new NotFoundError("کاربر با این شناسه وجود ندارد");
    }
  } else {
    let user = await db.Seller.findFirst({
      where: {
        id: id,
      },
    });
    oldLogo = user.logoUrl;
  }

  try {
    const seller = await db.Seller.update({
      where: {
        id: id,
      },
      data: {
        firstName: firstname,
        lastName: lastname,
        typeShop: typeShop,
        shopName: shopname,
        logoUrl:
          req.files.length === 1
            ? req.get("host") + `/images/${req.files[0].filename}`
            : undefined,
        email: email,
        phone: phone,
        password: new_password === undefined ? undefined : md5(new_password),
      },
    });
    if (province || city || address) {
      const addresss = await db.Address_Seller.update({
        where: {
          sellerId: seller.id,
        },
        data: {
          province: province,
          city: city,
          address: address,
        },
      });
    }
    if (req.files.length === 1) {
      fs.unlink(
        `public/images/${oldLogo.split("/")[oldLogo.split("/").length - 1]}`,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    return res.status(200).json({ message: "ویرایش با موفقیت انجام شد" });
  } catch (err) {
    if (err.code && err.code === "P2002") {
      throw new ConflictError("فروشنده‌ای با این شماره تلفن وجود دارد");
    } else if (err.code && err.code === "P2003") {
      throw new NotFoundError("محصولی با این شناسه وجود ندارد");
    } else if (err && err.code === "P2025") {
      throw new NotFoundError("فروشنده‌ای با این شناسه وجود ندارد");
    }
    console.log(err);
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.GetOne = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "seller") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
  }

  let user = await db.Seller.findFirst({
    where: {
      id: id,
    },
    include: {
      product: true,
    },
  });

  if (user) {
    return res.status(200).json({
      data: exclude(user, ["password"]),
    });
  } else {
    throw new NotFoundError("فروشنده‌ای با این شناسه وجود ندارد");
  }
};

exports.Login = async (req, res) => {
  const { phone, password } = req.body;

  //check phone exist
  let user_phone = await db.Seller.findFirst({
    where: {
      phone: phone,
    },
  });
  if (!user_phone) {
    throw new NotFoundError("فروشنده‌ای با این شماره موجود نمی‌باشد");
  }

  //check password exist
  let user_password = await db.Seller.findFirst({
    where: {
      phone: phone,
      password: md5(password),
    },
  });
  if (!user_password) {
    throw new UnauthorizedError("رمز عبور صحیح نمی‌باشد");
  } else {
    if (user_password.active)
      return res.status(200).json({
        data: jwt.sign(
          { ...user_password, type: "seller" },
          process.env.SECRET_TOKEN
        ),
      });
    else throw new UnauthorizedError("حساب شما تایید نشده است");
  }
};

exports.PassReset = async (req, res) => {
  const phone = req.body.phone;

  let user = await db.Seller.findFirst({
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
    throw new NotFoundError("فروشنده‌ای با این شماره وجود ندارد");
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
    let updated_user = await db.Seller.update({
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
