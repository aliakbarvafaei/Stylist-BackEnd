//config database for send query
const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const db = new PrismaClient();
const exclude = require("../functions/exclude").exclude;
require("dotenv").config();

exports.getAll = async (req, res) => {};

exports.getOne = async (req, res) => {};

exports.getMyProduct = async (req, res) => {};

exports.create = async (req, res) => {};

exports.update = async (req, res) => {};

exports.delete = async (req, res) => {};
