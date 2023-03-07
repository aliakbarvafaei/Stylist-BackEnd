const { PrismaClient } = require("@prisma/client");
const { isAuthunticated } = require("../utils/auth");
const { InternalServerError, NotFoundError } = require("../utils/errors");
const db = new PrismaClient();
require("dotenv").config();

// for users

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
    throw new InternalServerError("عملیات با خطا مواجه شد");
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
    else throw new NotFoundError("محصولی با این شناسه یافت نشد");
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.addToCart = async (req, res) => {
  var id = await isAuthunticated(req, res);

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
      throw new NotFoundError("محصولی با این شناسه وجود ندارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.getCart = async (req, res) => {
  var id = await isAuthunticated(req, res);

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
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

// for sellers

exports.getMyProduct = async (req, res) => {
  var id = await isAuthunticated(req, res);

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
    else throw new NotFoundError("فروشنده‌ای با این شناسه یافت نشد");
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.create = async (req, res) => {
  var id = await isAuthunticated(req, res);
};

exports.update = async (req, res) => {
  var id = await isAuthunticated(req, res);
};

exports.delete = async (req, res) => {
  var id = await isAuthunticated(req, res);

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
    else throw new NotFoundError("محصولی با این شناسه یافت نشد");
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};
