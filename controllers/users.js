//config database for send query
const { PrismaClient } = require("@prisma/client");
const { add } = require("lodash");
var jwt = require("jsonwebtoken");
const db = new PrismaClient();
require("dotenv").config();
const SECRET = "secret";

exports.create = async (req, res) => {
  const firstname = req.body.firstName;
  const lastname = req.body.lastname;
  const address = req.body.address;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const gender = req.body.gender;
  const age = req.body.age;

  //chech uniqe email
  let email_check = (email_check = await db.User.findFirst({
    where: {
      email: email,
    },
  }));

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
        password: password,
        gender: gender,
        age: age,
      },
    });
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
      password: password,
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
  const id = parseInt(req.body.id);
  const new_username = req.body.username;
  const new_firstName = req.body.firstName;
  const new_lastName = req.body.lastName;
  const new_address = req.body.address;
  const new_email = req.body.email;
  const new_phone = req.body.phone;
  const new_password = req.body.password;

  let updated_user = await db.User.update({
    where: {
      id: id,
    },
    data: {
      username: new_username,
      first_name: new_firstName,
      lastName: new_lastName,
      address: new_address,
      email: new_email,
      phone: new_phone,
      password: new_password,
    },
  });
  if (updated_user) {
    return res.json({
      status: 200,
      msg: "به‌روز‌رسانی با موفقیت انجام شد",
    });
  } else {
    return res.json({
      status: -1,
      msg: "خطا: به‌روز رسانی انجام نشد",
    });
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
    return res.json({
      status: 200,
      msg: "کاربر با موفقیت حذف شد",
    });
  } else {
    return res.json({
      status: -1,
      msg: "خطا: حذف کاربر ناموفق انجام شد",
    });
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
    return res.json({
      status: 200,
      data: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        email: user.email,
        phone: user.phone,
      },
    });
  } else {
    return res.json({
      status: -1,
      msg: "کاربری با این آی‌دی وجود ندارد",
    });
  }
};

exports.getAll = async (req, res) => {
  let users = await db.User.findMany({
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      address: true,
      email: true,
      phone: true,
    },
  });
  return res.json({
    staus: 200,
    data: users,
  });
};
