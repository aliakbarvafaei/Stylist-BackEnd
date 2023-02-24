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
//   const gender =
//     req.body.gender === "زن"
//       ? "WOMAN"
//       : req.body.gender === "مرد"
//       ? "MAN"
//       : undefined;
//   const age = req.body.age;

//   //chech uniqe email
//   let email_check = await db.User.findFirst({
//     where: {
//       email: email,
//     },
//   });

//   //chech uniqe phone number
//   let phone_check;
//   if (!phone) {
//     phone_check = null;
//   } else {
//     phone_check = await db.User.findFirst({
//       where: {
//         phone: phone,
//       },
//     });
//   }

//   if (!email_check && !phone_check) {
//     let newUser = await db.User.create({
//       data: {
//         firstName: firstname,
//         lastName: lastname,
//         address: address,
//         email: email,
//         phone: phone,
//         password: md5(password),
//         gender: gender,
//         age: age,
//       },
//     });
//     mailSignup(email, firstname, req.get("host") + "/logo.png");
//     return res.status(201).json( { message: ("ثبت نام با موفقیت انجام شد") } );
//   } else if (email_check) {
//     return res.status(409).json( { message: ("ایمیل تکراری می‌باشد") } );
//   } else if (phone_check) {
//     return res.status(409).json( { message: ("شماره تلفن تکراری می‌باشد") } );
//   }
// };

exports.update = async (req, res) => {
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
            return res.status(401).json({ message: "رمز قبلی اشتباه است" });
          }
        } else {
          return res.status(400).json({ message: "رمز قبلی باید ارسال شود" });
        }
      }
    } else {
      return res.status(404).json({ message: "کاربر با این شناسه وجود ندارد" });
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
    console.log(err);
    if (err.code && err.code === "P2025") {
      return res
        .status(404)
        .json({ message: "کاربری با این شناسه وجود ندارد" });
    }
    return res.status(400).json({ message: "عملیات با خطا مواجه شد" });
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
    console.log(err);
    if (err.code && err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "کاربری با این ایمیل یا شماره تلفن وجود دارد" });
    }
    if (err.code && err.code === "P2025") {
      return res
        .status(404)
        .json({ message: "کاربری با این شناسه وجود ندارد" });
    }
    return res.status(400).json({ message: "عملیات با خطا مواجه شد" });
  }
};

// exports.delete = async (req, res) => {
//   id = parseInt(req.params.userId);

//   try {
//     //delete user
//     let user = await db.User.delete({
//       where: {
//         id: id,
//       },
//     });
//     return res.status(200).json( { message: ("کاربر با موفقیت حذف شد") } );
//   } catch (err) { console.log(err);
//     return res.status(404).json( { message: ("کاربری با این شناسه وجود ندارد") } );
//   }
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
      cart: true,
      address: true,
    },
  });
  if (user) {
    return res
      .status(200)
      .json({
        data: {
          ...user,
          password: user.password && user.password != "" ? true : false,
        },
      });
  } else {
    return res.status(404).json({ message: "کاربری با این شناسه وجود ندارد" });
  }
};

// exports.getAll = async (req, res) => {
//   let users = await db.User.findMany({
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       address: true,
//       email: true,
//       phone: true,
//       gender: true,
//       age: true,
//     },
//   });
//   return res.status(200).json({
//     data: users,
//   });
// };

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
      return res.status(404).json({ message: "کاربر وجود ندارد" });
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
    //// send sms to phone number
    sendSms(phone, code);
    let user = await db.User.findFirst({
      where: {
        phone: phone,
      },
    });
    if (user) {
      return res.status(200).json({ message: "کاربر وجود دارد" });
    } else {
      return res.status(404).json({ message: "کاربر وجود ندارد" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "ارسال ایمیل یا شماره تلفن اجباری است" });
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
    return res.status(401).json({ message: "کد وارد شده اشتباه است" });
  } else {
    return res
      .status(404)
      .json({ message: "ابتدا باید درخواست کد فراموشی ارسال شود" });
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
      return res.status(401).json({ message: "رمزعبور اشتباه است" });
    } else {
      return res.status(404).json({ message: "کاربر وجود ندارد" });
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
      return res.status(401).json({ message: "رمزعبور اشتباه است" });
    } else {
      return res.status(404).json({ message: "کاربر وجود ندارد" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "ارسال ایمیل یا شماره تلفن اجباری است" });
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
      return res
        .status(404)
        .json({ message: "کاربری با این ایمیل وجود ندارد" });
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
      /////// send sms code
      sendSms(phone, code);
      return res.status(200).json({ message: "کد فراموشی رمزعبور ارسال شد" });
    } else {
      return res
        .status(404)
        .json({ message: "کاربری با این شماره وجود ندارد" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "ارسال ایمیل یا شماره تلفن اجباری است" });
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
      return res.status(401).json({ message: "کد فراموشی رمز اشتباه است" });
    } else {
      return res
        .status(404)
        .json({ message: "ابتدا باید درخواست کد فراموشی ارسال شود" });
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
      return res.status(401).json({ message: "کد فراموشی رمز اشتباه است" });
    } else {
      return res
        .status(404)
        .json({ message: "ابتدا باید درخواست کد فراموشی ارسال شود" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "ارسال ایمیل یا شماره تلفن اجباری است" });
  }
};
