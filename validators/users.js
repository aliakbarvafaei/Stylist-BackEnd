//config database for send query
const { PrismaClient } = require("@prisma/client");
const Schema = require("validate");
const { add } = require("lodash");
const db = new PrismaClient();
var jwt = require("jsonwebtoken");
require("dotenv").config();

//lodash
const { parseInt } = require("lodash");
const _ = require("lodash");
const SECRET = "secret";

exports.vUserCraete = (req, res, next) => {
  try {
    const user = new Schema({
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
      },
      age: {
        type: Number,
        required: true,
      },
      gender: {
        type: String,
        enum: ["MAN", "WOMAN"],
        required: true,
      },
      password: {
        type: String,
        required: true,
        length: { min: 8 },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).send(res_data);
    const email_validation = require("email-validator");
    if (!email_validation.validate(req.body.email)) {
      return res.status(400).send("invalid email");
    }
    // console.log(req.header("Authorization"));
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.vUserLogin = (req, res, next) => {
  try {
    const user = new Schema({
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
        length: { min: 8 },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).send(res_data);
    const email_validation = require("email-validator");
    if (!email_validation.validate(req.body.email)) {
      return res.status(400).send("invalid email");
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.vUserUpdate = async (req, res, next) => {
  try {
    const user = new Schema({
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: Number,
      },
      age: {
        type: Number,
      },
      gender: {
        type: String,
        enum: ["MAN", "WOMAN"],
      },
      password: {
        type: String,
        length: { min: 8 },
      },
    });
    var res_data = [];
    const errors = user.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) return res.status(400).send(res_data);
    const email_validation = require("email-validator");
    if (req.body.email && !email_validation.validate(req.body.email)) {
      return res.status(400).send("invalid email");
    }
    try {
      jwt.verify(req.header("Authorization"), SECRET);
    } catch {
      return res.status(400).send("invalid token.");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.vUserDelete = async (req, res, next) => {
  try {
    try {
      jwt.verify(req.header("Authorization"), SECRET);
    } catch {
      return res.status(400).send("invalid token.");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.vGetOne = (req, res, next) => {
  try {
    try {
      jwt.verify(req.header("Authorization"), SECRET);
    } catch {
      return res.status(400).send("invalid token.");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
