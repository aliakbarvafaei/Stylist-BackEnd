//config database for send query
const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const db = new PrismaClient();
const exclude = require("../functions/exclude").exclude;
require("dotenv").config();

/// for users

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

exports.addToCart = async (req, res) => {
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
  const quantity = req.body.quantity;
  const productId = req.body.productId;

  try {
    const cart_item = await db.Cart_Item.create({
      data: {
        userId: id,
        productId: productId,
        quantity: quantity,
      },
    });
    return res.status(200).json({ message: "محصول به سبد خرید اضافه شد" });
  } catch (err) {
    if (err.code && err.code === "P2002") {
      if (quantity > 0) {
        const cart_item = await db.Cart_Item.update({
          where: {
            userId_productId: { userId: id, productId: productId },
          },
          data: {
            quantity: quantity,
          },
        });
        return res
          .status(200)
          .json({ message: "تعداد محصول با موفقیت ویرایش شد" });
      } else {
        const cart_item = await db.Cart_Item.delete({
          where: {
            userId_productId: { userId: id, productId: productId },
          },
        });
        return res
          .status(200)
          .json({ message: "محصول با موفقیت از سبد خرید حذف شد" });
      }
    } else if (err.code && err.code === "P2003") {
      console.log(err);
      return res
        .status(404)
        .json({ message: "محصولی با این شناسه وجود ندارد" });
    }
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.getCart = async (req, res) => {
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
    const user = await db.User.findFirst({
      where: {
        id: id,
      },
      include: {
        cart_items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (user) {
      return res.status(200).json({ data: user.cart_items });
    } else {
      return res
        .status(404)
        .json({ message: "کاربری با این شناسه وجود ندارد" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

/// for sellers

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
