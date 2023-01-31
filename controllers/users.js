//config database for send query
const { PrismaClient } = require("@prisma/client");
const { add } = require("lodash");
const db = new PrismaClient();
require("dotenv").config();

exports.create = async (req, res) => {
  const username = req.body.username;
  const firstname = req.body.firstName;
  const lastname = req.body.lastname;
  const address = req.body.address;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const gender = req.body.gender;
  const age = req.body.age;
  //chech uniqe username
  let username_check = await db.User.findFirst({
    where: {
      username: username,
    },
  });

  //chech uniqe email
  let email_check;
  if (!email) {
    email_check = null;
  } else {
    email_check = await db.User.findFirst({
      where: {
        email: email,
      },
    });
  }

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

  if (!username_check && !email_check && !phone_check) {
    let newUser = await db.User.create({
      data: {
        username: username,
        firstname: firstname,
        lastname: lastname,
        address: address,
        email: email,
        phone: phone,
        password: password,
        gender: gender,
        age: age,
      },
    });
    return res.json({
      staus: 200,
      msg: "ثبت نام با موفقیت انجام شد",
      data: newUser,
    });
  } else if (username_check) {
    return res.json({
      staus: -1,
      msg: "نام کاربری تکراری می‌باشد",
    });
  } else if (email_check) {
    return res.json({
      staus: -1,
      msg: "ایمیل تکراری می‌باشد",
    });
  } else if (phone_check) {
    return res.json({
      staus: -1,
      msg: "شماره تلفن تکراری می‌باشد",
    });
  }
};

exports.login = async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  //check username exist
  let user_username = await db.User.findFirst({
    where: {
      username: username,
    },
  });
  if (!user_username) {
    return res.json({
      status: -1,
      msg: "شخصی با این نام کاربری موجود نمی‌باشد",
    });
  }

  //check password exist
  let user_password = await db.User.findFirst({
    where: {
      username: username,
      password: password,
    },
  });
  if (!user_password) {
    return res.json({
      status: -1,
      msg: "رمز عبور صحیح نمی‌باشد",
    });
  }

  //check user in database by all require information
  let user_all_option = await db.User.findFirst({
    where: {
      username: username,
      email: email,
      phone: phone,
      password: password,
    },
  });

  //check user in database without email
  let user_no_email = await db.User.findFirst({
    where: {
      username: username,
      phone: phone,
      password: password,
    },
  });

  //check user in database without phone number
  let user_no_phone = await db.User.findFirst({
    where: {
      username: username,
      email: email,
      password: password,
    },
  });

  if (email && phone && !user_all_option) {
    return res.json({
      staus: -1,
      msg: "کاربری با این شماره تلفن یا ایمیل وجود ندارد",
    });
  } else if (!email && !user_no_email) {
    return res.json({
      staus: -1,
      msg: "کاربری با این شماره تلفن وجود ندارد",
    });
  } else if (!phone && !user_no_phone) {
    return res.json({
      staus: -1,
      msg: "کاربری با این ایمیل وجود ندارد",
    });
  } else {
    return res.json({
      status: 200,
      msg: "ورود با موفقیت انجام شد",
    });
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
