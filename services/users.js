const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const mailSignup = require("../utils/email").mailSignup;
const mailResetPass = require("../utils/email").mailResetPass;
const { sendSmsLogin, sendSmsForget } = require("../utils/sms");
const md5 = require("md5");
const { isAuthunticated } = require("../utils/auth");
const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ConflictError,
} = require("../utils/errors");
const db = new PrismaClient();
const exclude = require("../utils/exclude").exclude;

require("dotenv").config();

exports.update = async (req, res) => {
  var id = await isAuthunticated(req, res);

  const new_firstName = req.body.firstname;
  const new_lastName = req.body.lastname;
  const new_address = req.body.address;
  const new_email = req.body.email;
  const new_phone = req.body.phone;
  const old_password = req.body.oldPassword;
  var new_password = req.body.password;
  const new_gender =
    req.body.gender === "زن"
      ? "WOMAN"
      : req.body.gender === "مرد"
      ? "MAN"
      : undefined;
  const new_age = req.body.age;

  if (new_password && new_password !== "") {
    let user = await db.User.findFirst({
      where: {
        id: id,
      },
    });

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
  }

  try {
    if (new_address && new_address !== "") {
      let newAddress = await db.Address.create({
        data: {
          address: new_address,
          userId: id,
        },
      });
    }
  } catch (err) {
    if (err.code && err.code === "P2025") {
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }

  try {
    if (new_password) {
      new_password = md5(new_password);
    }

    let updated_user = await db.User.update({
      where: {
        id: id,
      },
      data: {
        firstName: new_firstName,
        lastName: new_lastName,
        email: new_email,
        phone: new_phone,
        password: new_password,
        gender: new_gender,
        age: new_age,
      },
    });

    return res.status(200).json({ message: "به‌روز‌رسانی با موفقیت انجام شد" });
  } catch (err) {
    if (err.code && err.code === "P2002") {
      throw new ConflictError("کاربری با این ایمیل یا شماره تلفن وجود دارد");
    }
    if (err.code && err.code === "P2025") {
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.getOne = async (req, res) => {
  var id = await isAuthunticated(req, res);

  let user = await db.User.findFirst({
    where: {
      id: id,
    },
    include: {
      clothing: true,
      category_clothing: true,
      set: true,
      category_set: true,
      counseling: true,
      transaction: true,
      order: true,
      cart_items: true,
      address: true,
    },
  });

  if (user) {
    return res.status(200).json({
      data: {
        ...exclude(user, ["password"]),
        hasPassword: user.password && user.password != "" ? true : false,
      },
    });
  } else {
    throw new NotFoundError("کاربری با این شناسه وجود ندارد");
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const phone = req.body.phone;

  if (email && email !== "") {
    let user = await db.User.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.status(200).json({ message: "کاربر وجود دارد" });
    } else {
      throw new NotFoundError("کاربر وجود ندارد");
    }
  } else if (phone && phone !== "") {
    const code = Math.floor(10000 + Math.random() * 90000);

    let row = await db.LoginCode.findFirst({
      where: {
        phone: phone,
      },
    });

    if (row) {
      await db.LoginCode.update({
        where: {
          phone: phone,
        },
        data: {
          code: code,
        },
      });
    } else {
      await db.LoginCode.create({
        data: {
          phone: phone,
          code: code,
        },
      });
    }
    // send sms to phone number
    sendSmsLogin(phone, code);

    let user = await db.User.findFirst({
      where: {
        phone: phone,
      },
    });

    if (user) {
      return res.status(200).json({ message: "کاربر وجود دارد" });
    } else {
      throw new NotFoundError("کاربر وجود ندارد");
    }
  } else {
    throw new BadRequestError("ارسال ایمیل یا شماره تلفن اجباری است");
  }
};

exports.loginCode = async (req, res) => {
  const code = req.body.code;
  const phone = req.body.phone;

  let logincode = await db.LoginCode.findFirst({
    where: {
      phone: phone,
    },
  });

  if (logincode && logincode.code === code) {
    let user = await db.User.findFirst({
      where: {
        phone: phone,
      },
    });

    if (user) {
      return res
        .status(200)
        .json({ data: jwt.sign(user, process.env.SECRET_TOKEN) });
    } else {
      let newUser = await db.User.create({
        data: {
          phone: phone,
        },
      });

      return res
        .status(201)
        .json({ data: jwt.sign(newUser, process.env.SECRET_TOKEN) });
    }
  } else if (logincode) {
    throw new UnauthorizedError("کد وارد شده اشتباه است");
  } else {
    throw new NotFoundError("ابتدا باید درخواست کد فراموشی ارسال شود");
  }
};

exports.loginPass = async (req, res) => {
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  if (email && email !== "") {
    let user = await db.User.findFirst({
      where: {
        email: email,
      },
    });

    if (user && user.password === md5(password)) {
      return res
        .status(200)
        .json({ data: jwt.sign(user, process.env.SECRET_TOKEN) });
    } else if (user) {
      throw new UnauthorizedError("رمزعبور اشتباه است");
    } else {
      throw new NotFoundError("کاربر وجود ندارد");
    }
  } else if (phone && phone !== "") {
    let user = await db.User.findFirst({
      where: {
        phone: phone,
      },
    });

    if (user && user.password === md5(password)) {
      return res
        .status(200)
        .json({ data: jwt.sign(user, process.env.SECRET_TOKEN) });
    } else if (user) {
      throw new UnauthorizedError("رمزعبور اشتباه است");
    } else {
      throw new NotFoundError("کاربر وجود ندارد");
    }
  } else {
    throw new BadRequestError("ارسال ایمیل یا شماره تلفن اجباری است");
  }
};

exports.PassReset = async (req, res) => {
  const email = req.body.email;
  const phone = req.body.phone;
  if (email && email !== "") {
    let user = await db.User.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      const code = Math.floor(10000 + Math.random() * 90000);
      let row = await db.PassReset.findFirst({
        where: {
          user: email,
        },
      });

      if (row) {
        await db.PassReset.update({
          where: {
            user: email,
          },
          data: {
            code: code,
          },
        });
      } else {
        await db.PassReset.create({
          data: {
            user: email,
            code: code,
          },
        });
      }
      mailResetPass(email, code, req.get("host") + "/logo.png");

      return res.status(200).json({ message: "کد فراموشی رمزعبور ارسال شد" });
    } else {
      throw new NotFoundError("کاربری با این ایمیل وجود ندارد");
    }
  } else if (phone && phone !== "") {
    let user = await db.User.findFirst({
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
        await db.PassReset.update({
          where: {
            user: phone,
          },
          data: {
            code: code,
          },
        });
      } else {
        await db.PassReset.create({
          data: {
            user: phone,
            code: code,
          },
        });
      }
      // send sms code
      sendSmsForget(phone, code);

      return res.status(200).json({ message: "کد فراموشی رمزعبور ارسال شد" });
    } else {
      throw new NotFoundError("کاربری با این شماره وجود ندارد");
    }
  } else {
    throw new BadRequestError("ارسال ایمیل یا شماره تلفن اجباری است");
  }
};

exports.PassChange = async (req, res) => {
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const code = req.body.code;

  if (email && email !== "") {
    let user = await db.PassReset.findFirst({
      where: {
        user: email,
      },
    });

    if (user && user.code === code) {
      let updated_user = await db.User.update({
        where: {
          email: email,
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
  } else if (phone && phone !== "") {
    let user = await db.PassReset.findFirst({
      where: {
        user: phone,
      },
    });

    if (user && user.code === code) {
      let updated_user = await db.User.update({
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
  } else {
    throw new BadRequestError("ارسال ایمیل یا شماره تلفن اجباری است");
  }
};
