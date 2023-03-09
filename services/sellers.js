const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const mailSignup = require("../utils/email").mailSignup;
const mailResetPass = require("../utils/email").mailResetPass;
const sendSmsForget = require("../utils/sms").sendSmsForget;
const md5 = require("md5");
const { isAuthunticated } = require("../utils/auth");
const {
  NotFoundError,
} = require("../utils/errors");
const db = new PrismaClient();
const exclude = require("../utils/exclude").exclude;
require("dotenv").config();

// exports.create = async (req, res) => {
//   const firstname = req.body.firstname;
//   const lastname = req.body.lastname;
//   const address = req.body.address;
//   const shopname = req.body.shopname;
//   const email = req.body.email;
//   const phone = req.body.phone;
//   const password = req.body.password;

//   //chech uniqe email
//   let email_check = await db.Seller.findFirst({
//     where: {
//       email: email,
//     },
//   });

//   //chech uniqe phone number
//   let phone_check;
//   if (!phone) {
//     phone_check = null;
//   } else {
//     phone_check = await db.Seller.findFirst({
//       where: {
//         phone: phone,
//       },
//     });
//   }

//   if (!email_check && !phone_check) {
//     let newUser = await db.Seller.create({
//       data: {
//         firstName: firstname,
//         lastName: lastname,
//         address: address,
//         shopName: shopname,
//         email: email,
//         phone: phone,
//         password: md5(password),
//       },
//     });
//     mailSignup(email, firstname,req.get("host")+"/logo.png");
//     return res.status(201).json( { message: ("ثبت نام با موفقیت انجام شد") } );
//   } else if (email_check) {
// throw new ConflictError("ایمیل تکراری می‌باشد");
//   } else if (phone_check) {
// throw new ConflictError("شماره تلفن تکراری می‌باشد");
//   }
// };

// exports.update = async (req, res) => {
//   var id = await isAuthunticated(req, res);
//   const new_firstName = req.body.firstname;
//   const new_lastName = req.body.lastname;
//   const new_shopname = req.body.shopname;
//   const new_address = req.body.address;
//   const new_email = req.body.email;
//   const new_phone = req.body.phone;
//   const new_password = req.body.password;

//   try {
//     let updated_user = await db.Seller.update({
//       where: {
//         id: id,
//       },
//       data: {
//         firstName: new_firstName,
//         lastName: new_lastName,
//         address: new_address,
//         shopName: new_shopname,
//         email: new_email,
//         phone: new_phone,
//         password: md5(new_password),
//       },
//     });
//     return res.status(200).json( { message: ("به‌روز‌رسانی با موفقیت انجام شد") } );
//   } catch (err) {
//     if (err.code && err.code === "P2002") {
// throw new ConflictError("کاربری با این ایمیل یا شماره تلفن وجود دارد");
//     }
//     if (err.code && err.code === "P2025") {
// throw new NotFoundError("کاربری با این شناسه وجود ندارد");
//     }
// throw new InternalServerError("عملیات با خطا مواجه شد");
//   }
// };

// exports.delete = async (req, res) => {
//   id = parseInt(req.params.userId);
//   try {
//     //delete user
//     let user = await db.Seller.delete({
//       where: {
//         id: id,
//       },
//     });
//     return res.status(200).json( { message: ("کاربر با موفقیت حذف شد") } );
//   } catch (err) {
// throw new NotFoundError("کاربری با این شناسه وجود ندارد");
//   }
// };

// exports.getAll = async (req, res) => {
//   let users = await db.Seller.findMany({
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       shopName: true,
//       address: true,
//       email: true,
//       phone: true,
//     },
//   });
//   return res.status(200).json({
//     data: users,
//   });
// };

exports.GetOne = async (req, res) => {
  var id = await isAuthunticated(req, res);

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
      data: {
        ...exclude(user, ["password"]),
        hasPassword: user.password && user.password != "" ? true : false,
      },
    });
  } else {
    throw new NotFoundError("فروشنده‌ای با این شناسه وجود ندارد");
  }
};

exports.Login = async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;

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
    return res
      .status(200)
      .json({ data: jwt.sign(user_password, process.env.SECRET_TOKEN) });
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
  const phone = req.body.phone;
  const password = req.body.password;
  const code = req.body.code;

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
