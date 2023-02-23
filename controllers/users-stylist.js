//config database for send query
const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const mailSignup = require("../functions/email").mailSignup;
const mailResetPass = require("../functions/email").mailResetPass;
const sendSms = require("../functions/sms").sendSms;
const md5 = require("md5");
const db = new PrismaClient();
const exclude = require("../functions/exclude").exclude;
require("dotenv").config();

// exports.create = async (req, res) => {
//   const firstname = req.body.firstname;
//   const lastname = req.body.lastname;
//   const address = req.body.address;
//   const email = req.body.email;
//   const phone = req.body.phone;
//   const password = req.body.password;

//   //chech uniqe email
//   let email_check = await db.User_Stylist.findFirst({
//     where: {
//       email: email,
//     },
//   });

//   //chech uniqe phone number
//   let phone_check;
//   if (!phone) {
//     phone_check = null;
//   } else {
//     phone_check = await db.User_Stylist.findFirst({
//       where: {
//         phone: phone,
//       },
//     });
//   }

//   if (!email_check && !phone_check) {
//     let newUser = await db.User_Stylist.create({
//       data: {
//         firstName: firstname,
//         lastName: lastname,
//         address: address,
//         email: email,
//         phone: phone,
//         password: md5(password),
//       },
//     });
//     mailSignup(email, firstname,req.get("host")+"/logo.png");
//     return res.status(201).json( { message: ("ثبت نام با موفقیت انجام شد") } );
//   } else if (email_check) {
//     return res.status(409).json( { message: ("ایمیل تکراری می‌باشد") } );
//   } else if (phone_check) {
//     return res.status(409).json( { message: ("شماره تلفن تکراری می‌باشد") } );
//   }
// };

// exports.update = async (req, res) => {
//   var id;
//   try {
//     id = jwt.verify(req.header("Authorization"), process.env.SECRET_TOKEN).id;
//   } catch (err) { console.log(err);
//     if (err.name === "TokenExpiredError")
//       return res.status(400).json( { message: ("زمان ورود شما منقضی شده است") } );
//     else if (err.name === "JsonWebTokenError") {
//       return res.status(400).json( { message: ("توکن احراز هویت نامعتبر است") } );
//     } else {
//       return res.status(400).json( { message: ("خطای احراز هویت") } );
//     }
//   }
//   const new_firstName = req.body.firstname;
//   const new_lastName = req.body.lastname;
//   const new_address = req.body.address;
//   const new_email = req.body.email;
//   const new_phone = req.body.phone;
//   const new_password = req.body.password;

//   try {
//     let updated_user = await db.User_Stylist.update({
//       where: {
//         id: id,
//       },
//       data: {
//         firstName: new_firstName,
//         lastName: new_lastName,
//         address: new_address,
//         email: new_email,
//         phone: new_phone,
//         password: md5(new_password),
//       },
//     });
//     return res.status(200).json( { message: ("به‌روز‌رسانی با موفقیت انجام شد") } );
//   } catch (err) { console.log(err);
//     if (err.code && err.code === "P2002") {
//       return res
//         .status(409)
//         .json( { message: ("کاربری با این ایمیل یا شماره تلفن وجود دارد") } );
//     }
//     if (err.code && err.code === "P2025") {
//       return res.status(404).json( { message: ("کاربری با این شناسه وجود ندارد") } );
//     }
//     return res.status(400).json( { message: ("عملیات با خطا مواجه شد") } );
//   }
// };

// exports.delete = async (req, res) => {
//   id = parseInt(req.params.userId);
//   try {
//     //delete user
//     let user = await db.User_Stylist.delete({
//       where: {
//         id: id,
//       },
//     });
//     return res.status(200).json( { message: ("کاربر با موفقیت حذف شد") } );
//   } catch (err) { console.log(err);
//     return res.status(404).json( { message: ("کاربری با این شناسه وجود ندارد") } );
//   }
// };

// exports.getAll = async (req, res) => {
//   let users = await db.User_Stylist.findMany({
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       address: true,
//       email: true,
//       phone: true,
//     },
//   });
//   return res.status(200).json({
//     data: users,
//   });
// };

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
    return res.status(200).json({ data: exclude(user, ["password"]) });
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
    sendSms(phone, code);
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
