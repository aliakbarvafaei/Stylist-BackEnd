//config database for send query
const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const sendMail = require("../functions/email").sendMail;
const md5 = require("md5");
const db = new PrismaClient();
require("dotenv").config();
const SECRET = "secret";

///////////////// All controller for myclothes

exports.ClothesCategoryCreate = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
  const name = req.body.name;
  try {
    let newCategory = await db.Category_Clothing.create({
      data: {
        name: name,
        userId: id,
      },
    });
    return res.status(201).send("دسته‌بندی با موفقیت اضافه شد");
  } catch {
    let oldCategory = await db.Category_Clothing.findFirst({
      where: {
        name: name,
      },
    });
    if (oldCategory) {
      return res.status(409).send("دسته‌بندی با این نام وجود دارد");
    }
    let oldUser = await db.User.findFirst({
      where: {
        id: id,
      },
    });
    if (!oldUser) {
      return res.status(404).send("کاربری با این شناسه وجود ندارد");
    }
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
};

exports.ClothesCategoryGetAll = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
  try {
    let user = await db.User.findFirst({
      where: {
        id: id,
      },
      include: {
        category_clothing: true,
      },
    });
    if (user) {
      return res.status(200).send(user.category_clothing);
    } else {
      return res.status(404).send("کاربری با این شناسه وجود ندارد");
    }
  } catch {
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
};

exports.ClothesCategoryDelete = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
  const categoryId = parseInt(req.params.categoryId);
  try {
    let user = await db.Category_Clothing.delete({
      where: {
        id: categoryId,
        userId: id,
      },
    });
    return res.status(200).send("دسته‌بندی با موفقیت حذف شد");
  } catch {
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
};

exports.ClothesCategoryUpdate = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
  const categoryId = parseInt(req.params.categoryId);
  const name = req.body.name;
  try {
    let user = await db.Category_Clothing.update({
      where: {
        id: categoryId,
        userId: id,
      },
      data: {
        name: name,
      },
    });
    return res.status(200).send("دسته‌بندی با موفقیت ویرایش شد");
  } catch {
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
};

exports.ClothesClothingCreate = async (req, res) => {
  if (req.files.length == 0) {
    return res.status(400).send("عکس اجباری است");
  }
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
  const categoryId = parseInt(req.params.categoryId);
  const material = req.body.material;
  const season = req.body.season;
  const size = req.body.size;
  var newClothing;
  try {
    newClothing = await db.Clothing.create({
      data: {
        category_clothingId: categoryId,
        userId: id,
        material: material,
        season: season,
        size: size,
      },
    });
  } catch {
    return res.status(500).send("عملیات با خطا مواجه شد");
  }
  req.files.forEach(async (item) => {
    let newImage = await db.Image_Clothing.create({
      data: {
        clothingId: newClothing.id,
        url: req.get("host") + `/images/${item.filename}`,
      },
    });
  });
  return res.status(201).send("لباس با موفقیت اضافه شد");
};

exports.ClothesClothingGetAll = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.ClothesClothingUpdate = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.ClothesClothingDelete = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.ClothesClothingGetOne = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

///////////////// All controller for mysets

exports.SetsCategoryCreate = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.SetsCategoryGetAll = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.SetsCategoryDelete = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.SetsCategoryUpdate = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.SetsClothingCreate = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.SetsClothingGetAll = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.SetsClothingUpdate = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.SetsClothingDelete = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};

exports.SetsClothingGetOne = async (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), SECRET).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).send("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).send("توکن احراز هویت نامعتبر است");
    } else {
      return res.status(400).send("خطای احراز هویت");
    }
  }
};
