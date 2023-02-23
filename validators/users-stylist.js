//config database for send query
const Schema = require("validate");
require("dotenv").config();

// exports.vUserCraete = (req, res, next) => {
//   try {
//     const user = new Schema({
//       firstname: {
//         type: String,
//         message: {
//           type: "نام باید به صورت رشته باشد",
//         },
//       },
//       lastname: {
//         type: String,
//         message: {
//           type: "نام‌خانوادگی باید به صورت رشته باشد",
//         },
//       },
//       address: {
//         type: String,
//         message: {
//           type: "آدرس باید به صورت رشته باشد",
//         },
//       },
//       email: {
//         type: String,
//         required: true,
//         message: {
//           type: "ایمیل باید به صورت رشته باشد",
//           required: "ایمیل اجباری است",
//         },
//       },
//       phone: {
//         type: String,
//         message: {
//           type: "شماره تلفن باید به صورت رشته باشد",
//         },
//       },
//       password: {
//         type: String,
//         required: true,
//         length: { min: 8 },
//         message: {
//           type: "رمزعبور باید به صورت رشته باشد",
//           required: "رمزعبور اجباری است",
//           length: "رمزعبور باید حداقل 8 حرف باشد",
//         },
//       },
//     });
//     var res_data = [];
//     const errors = user.validate(req.body);
//     errors.forEach((element) => {
//       res_data.push(element.message);
//     });
//     if (res_data.length > 0) return res.status(400).json( { message: (res_data) } )
//     const email_validation = require("email-validator");
//     if (!email_validation.validate(req.body.email)) {
//       return res.status(400).json( { message: ("ساختار ایمیل نادرست است") } );
//     }
//     next();
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json( { message: ("عملیات با خطا مواجه شد") } );
//   }
// };

// exports.vUserUpdate = async (req, res, next) => {
//   try {
//     const user = new Schema({
//       firstname: {
//         type: String,
//         message: {
//           type: "نام باید به صورت رشته باشد",
//         },
//       },
//       lastname: {
//         type: String,
//         message: {
//           type: "نام‌خانوادگی باید به صورت رشته باشد",
//         },
//       },
//       address: {
//         type: String,
//         message: {
//           type: "آدرس باید به صورت رشته باشد",
//         },
//       },
//       email: {
//         type: String,
//         message: {
//           type: "ایمیل باید به صورت رشته باشد",
//         },
//       },
//       phone: {
//         type: String,
//         message: {
//           type: "شماره تلفن باید به صورت رشته باشد",
//         },
//       },
//       password: {
//         type: String,
//         length: { min: 8 },
//         message: {
//           type: "رمزعبور باید به صورت رشته باشد",
//           length: "رمزعبور باید حداقل 8 حرف باشد",
//         },
//       },
//     });
//     var res_data = [];
//     const errors = user.validate(req.body);
//     errors.forEach((element) => {
//       res_data.push(element.message);
//     });
//     if (res_data.length > 0) return res.status(400).json( { message: (res_data) } )
//     const email_validation = require("email-validator");
//     if (req.body.email && !email_validation.validate(req.body.email)) {
//       return res.status(400).json( { message: ("ساختار ایمیل نادرست است") } );
//     }
//     next();
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json( { message: ("عملیات با خطا مواجه شد") } );
//   }
// };

// exports.vUserDelete = async (req, res, next) => {
//   try {
//     next();
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json( { message: ("عملیات با خطا مواجه شد") } );
//   }
// };

exports.vGetOne = (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vUserLogin = (req, res, next) => {
  try {
    const user = new Schema({
      phone: {
        type: String,
        required: true,
        message: {
          type: "شماره باید به صورت رشته باشد",
          required: "شماره اجباری است",
        },
      },
      password: {
        type: String,
        required: true,
        length: { min: 8 },
        message: {
          type: "رمزعبور باید به صورت رشته باشد",
          required: "رمزعبور اجباری است",
          length: "رمزعبور باید حداقل 8 حرف باشد",
        },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).json({ message: res_data });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vPassReset = (req, res, next) => {
  try {
    const user = new Schema({
      phone: {
        type: String,
        required: true,
        message: {
          type: "شماره باید به صورت رشته باشد",
          required: "شماره اجباری است",
        },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).json({ message: res_data });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vPassChange = (req, res, next) => {
  try {
    const user = new Schema({
      phone: {
        type: String,
        required: true,
        message: {
          type: "شماره باید به صورت رشته باشد",
          required: "شماره اجباری است",
        },
      },
      password: {
        type: String,
        required: true,
        length: { min: 8 },
        message: {
          type: "رمزعبور باید به صورت رشته باشد",
          required: "رمزعبور اجباری است",
          length: "رمزعبور باید حداقل 8 حرف باشد",
        },
      },
      code: {
        type: Number,
        required: true,
        length: { min: 5, max: 5 },
        message: {
          type: "کد باید به صورت عدد باشد",
          required: "کد اجباری است",
          length: "کد باید 5 حرف باشد",
        },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).json({ message: res_data });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};
