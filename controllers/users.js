//config database for send query
const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const sendMail = require("../functions/email").sendMail;
const md5 = require("md5");
const db = new PrismaClient();
require("dotenv").config();
const SECRET = "secret";

exports.create = async (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const address = req.body.address;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const gender =
    req.body.gender === "زن"
      ? "WOMAN"
      : req.body.gender === "مرد"
      ? "MAN"
      : undefined;
  const age = req.body.age;

  //chech uniqe email
  let email_check = await db.User.findFirst({
    where: {
      email: email,
    },
  });

  //chech uniqe phone number
  let phone_check;
  if (!phone) {
    phone_check = null;
  } else {
    phone_check = await db.User.findFirst({
      where: {
        phone: phone,
      },
    });
  }

  if (!email_check && !phone_check) {
    let newUser = await db.User.create({
      data: {
        firstName: firstname,
        lastName: lastname,
        address: address,
        email: email,
        phone: phone,
        password: md5(password),
        gender: gender,
        age: age,
      },
    });
    sendMail(email, "ثبت نام", "<h3>به استایلیست خوش آمدید</h3>");
    return res.status(201).send("ثبت نام با موفقیت انجام شد");
  } else if (email_check) {
    return res.status(409).send("ایمیل تکراری می‌باشد");
  } else if (phone_check) {
    return res.status(409).send("شماره تلفن تکراری می‌باشد");
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //check email exist
  let user_email = await db.User.findFirst({
    where: {
      email: email,
    },
  });
  if (!user_email) {
    return res.status(404).send("شخصی با این ایمیل موجود نمی‌باشد");
  }

  //check password exist
  let user_password = await db.User.findFirst({
    where: {
      email: email,
      password: md5(password),
    },
  });
  if (!user_password) {
    return res.status(401).send("رمز عبور صحیح نمی‌باشد");
  } else {
    return res
      .status(200)
      .send(jwt.sign(user_password, SECRET, { expiresIn: "10m" }));
  }
};

exports.update = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
  const new_firstName = req.body.firstname;
  const new_lastName = req.body.lastname;
  const new_address = req.body.address;
  const new_email = req.body.email;
  const new_phone = req.body.phone;
  const new_password = req.body.password;
  const new_gender =
    req.body.gender === "زن"
      ? "WOMAN"
      : req.body.gender === "مرد"
      ? "MAN"
      : undefined;
  const new_age = req.body.age;

  let updated_user = await db.User.update({
    where: {
      id: id,
    },
    data: {
      firstName: new_firstName,
      lastName: new_lastName,
      address: new_address,
      email: new_email,
      phone: new_phone,
      password: md5(new_password),
      gender: new_gender,
      age: new_age,
    },
  });
  if (updated_user) {
    return res.status(200).send("به‌روز‌رسانی با موفقیت انجام شد");
  } else {
    return res.status(400).send("خطا: به‌روز رسانی انجام نشد");
  }
};

exports.delete = async (req, res) => {
  id = parseInt(req.params.userId);

  //delete user
  let user = await db.User.delete({
    where: {
      id: id,
    },
  });
  if (user) {
    return res.status(200).send("کاربر با موفقیت حذف شد");
  } else {
    return res.status(400).send("خطا: حذف کاربر ناموفق انجام شد");
  }
};

exports.getOne = async (req, res) => {
  id = parseInt(req.params.userId);
  let user = await db.User.findFirst({
    where: {
      id: id,
    },
  });
  if (user) {
    return res.status(200).send({
      data: {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        address: user.address,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
      },
    });
  } else {
    return res.status(404).send("کاربری با این آی‌دی وجود ندارد");
  }
};

exports.getAll = async (req, res) => {
  let users = await db.User.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      address: true,
      email: true,
      phone: true,
      gender: true,
      age: true,
    },
  });
  return res.status(200).send({
    data: users,
  });
};

exports.PassReset = async (req, res) => {
  const email = req.body.email;
  let user = await db.User.findFirst({
    where: {
      email: email,
    },
  });
  if (user) {
    const code = Math.floor(100000 + Math.random() * 900000);
    let row = await db.PassReset.findFirst({
      where: {
        email: email,
      },
    });
    if (row) {
      let updated_user = await db.PassReset.update({
        where: {
          email: email,
        },
        data: {
          code: code,
        },
      });
    } else {
      let newRow = await db.PassReset.create({
        data: {
          email: email,
          code: code,
        },
      });
    }
    sendMail(email, "بازیابی رمزعبور", `کد فراموشی رمز: ${code}`);
    return res.status(200).send("کد فراموشی رمزعبور ارسال شد");
  } else {
    return res.status(404).send("کاربری با این ایمیل وجود ندارد");
  }
};

exports.PassChange = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const code = req.body.code;
  let user = await db.PassReset.findFirst({
    where: {
      email: email,
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
    return res.status(200).send("رمزعبور با موفقیت تغییر کرد");
  } else if (user) {
    return res.status(401).send("کد فراموشی رمز اشتباه است");
  } else {
    return res.status(404).send("ابتدا باید درخواست کد فراموشی ارسال شود");
  }
};
