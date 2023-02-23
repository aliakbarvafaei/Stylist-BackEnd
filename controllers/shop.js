//config database for send query
const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const db = new PrismaClient();
const exclude = require("../functions/exclude").exclude;
require("dotenv").config();

exports.getAll = async (req, res) => {
  try {
    let products = await db.Product.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        image_product: true,
      },
      take: 10,
    });
    return res.status(200).json({ data: products });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.getOne = async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    let product = await db.Product.findFirst({
      where: {
        id: productId,
      },
      include: {
        image_product: true,
      },
    });
    if (product) return res.status(200).json({ data: product });
    else
      return res.status(404).json({ message: "محصولی با این شناسه یافت نشد" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.getMyProduct = async (req, res) => {
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
  try {
    let seller = await db.Seller.findFirst({
      where: {
        id: id,
      },
      include: {
        product: {
          include: {
            image_product: true,
          },
        },
      },
    });
    if (seller) return res.status(200).json({ data: seller.product });
    else
      return res
        .status(404)
        .json({ message: "فروشنده‌ای با این شناسه یافت نشد" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.create = async (req, res) => {
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
};

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
};

exports.delete = async (req, res) => {
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
  const productId = parseInt(req.params.productId);
  try {
    let product = await db.Product.delete({
      where: {
        id: productId,
        sellerId: id,
      },
    });
    if (product)
      return res.status(200).json({ message: "محصول با موفقیت حذف شد" });
    else
      return res.status(404).json({ message: "محصولی با این شناسه یافت نشد" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};
