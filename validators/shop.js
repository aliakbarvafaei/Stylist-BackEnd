//config database for send query
const Schema = require("validate");
require("dotenv").config();

exports.vGetAll = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vGetOne = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vCreate = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vUpdate = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vDelete = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};
