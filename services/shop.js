const { PrismaClient } = require("@prisma/client");
const { isAuthunticated } = require("../utils/auth");
const fs = require("fs");
const {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors");
const db = new PrismaClient();
require("dotenv").config();

// for users

exports.GetAll = async (req, res) => {
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

exports.GetOne = async (req, res) => {
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

exports.AddToCart = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
  }

  const { quantity, productId } = req.body;

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

exports.GetCart = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

// for sellers

exports.GetMyProduct = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "seller") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
    else throw new NotFoundError("فروشنده‌ای با این شناسه یافت نشد");
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.CreateProduct = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "seller") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
  }

  const { title, detail, quantity, discount, price } = req.body;

  try {
    const product = await db.Product.create({
      data: {
        title: title,
        detail: detail,
        discount: Number(discount),
        price: Number(price),
        quantity: Number(quantity),
        sellerId: id,
        image_product: {
          create: req.files.map((element) => {
            return {
              url: req.get("host") + `/images/${element.filename}`,
            };
          }),
        },
      },
      include: {
        image_product: true,
      },
    });

    return res
      .status(201)
      .json({ data: product, message: "محصول با موفقیت اضافه شد" });
  } catch (err) {
    if (err.code && err.code === "P2002") {
      throw new ConflictError("محصولی با این عنوان وجود دارد");
    } else if (err.code && err.code === "P2003") {
      throw new NotFoundError("فروشنده‌ای با این شناسه وجود ندارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.UpdateProduct = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "seller") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
  }

  const { title, detail, quantity, discount, price } = req.body;

  try {
    const urls = await db.Image_Product.findMany({
      where: {
        productId: parseInt(req.params.productId),
      },
    });

    urls.length > 0 &&
      (await db.Image_Product.deleteMany({
        where: {
          productId: parseInt(req.params.productId),
        },
      }));

    urls &&
      urls.forEach(async (item) => {
        item &&
          fs.unlink(
            `public/images/${
              item.url.split("/")[item.url.split("/").length - 1]
            }`,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
      });

    const product = await db.Product.update({
      where: {
        id: parseInt(req.params.productId),
      },
      data: {
        title: title,
        detail: detail,
        discount:
          discount === undefined || discount === ""
            ? undefined
            : Number(discount),
        price: price === undefined || price === "" ? undefined : Number(price),
        quantity:
          quantity === undefined || quantity === ""
            ? undefined
            : Number(quantity),
        image_product: {
          create: req.files.map((element) => {
            return {
              url: req.get("host") + `/images/${element.filename}`,
            };
          }),
        },
      },
      include: {
        image_product: true,
      },
    });

    return res
      .status(200)
      .json({ data: product, message: "محصول با موفقیت ویرایش شد" });
  } catch (err) {
    if (err.code && err.code === "P2002") {
      throw new ConflictError("محصولی با این عنوان وجود دارد");
    } else if (err.code && err.code === "P2003") {
      throw new NotFoundError("فروشنده‌ای با این شناسه وجود ندارد");
    } else if (err && err.code === "P2025") {
      throw new NotFoundError("محصولی با این شناسه وجود ندارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.DeleteProduct = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "seller") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
  }

  const productId = parseInt(req.params.productId);

  try {
    let product = await db.Product.delete({
      where: {
        id: productId,
      },
    });

    return res.status(200).json({ message: "محصول با موفقیت حذف شد" });
  } catch (err) {
    if (err && err.code === "P2025") {
      throw new NotFoundError("محصولی با این شناسه وجود ندارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};
