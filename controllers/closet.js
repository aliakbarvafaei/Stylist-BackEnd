//config database for send query
const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const db = new PrismaClient();
const fs = require("fs");
const removeFiles = require("../functions/rmFiles").removeFiles;
require("dotenv").config();

///////////////// All category for myclothes
let categories = {
  مرد: [
    "کت",
    "پالتو و کاپشن",
    "هودی",
    "سوئی شرت",
    "جلیقه",
    "پیراهن",
    "بلوز",
    "تیشرت",
    "پولوور",
    "لباس زیر",
    "پیژامه و لباس راحتی",
    "شلوار",
    "شلوارک",
    "کت و شلوار",
    "ست 3 تکه(جلیقه،کت،شلوار)",
    "ست ورزشی",
    "کلاه",
    "عینک",
    "کروات",
    "کیف",
    "دستکش",
    "کمربند",
    "انواع جوراب",
    "کفش",
    "دست بند و گردن بند ودیگر ملحقات",
  ],
  زن: [
    "پالتو و کاپشن",
    "سوئی شرت و هودی",
    "مانتو",
    "شنل و پانچو",
    "جلیقه",
    "تیشرت",
    "نیم تنه و تاپ",
    "پیراهن",
    "بلوز",
    "پولوور",
    "پیراهن مجلسی",
    "سارافون",
    "لباس خواب",
    "لباس زیر",
    "لباس بارداری",
    "پیژامه و لباس راحتی",
    "شلوار",
    "دامن",
    "لگ و ساپورت",
    "جامپسوت و سرهمی",
    "کت و شلوار",
    "کت و دامن",
    "ست ورزشی",
    "کلاه",
    "عینک",
    "شال و روسری",
    "کیف",
    "دستکش",
    "کمربند",
    "انواع جوراب",
    "کفش",
    "دست بند و گردن بند ودیگر ملحقات",
  ],
};
exports.ClothesCategories = async (req, res) => {
  const gender = req.params.gender;
  if (gender === "زن") {
    return res.status(200).json({ data: categories.زن });
  } else if (gender === "مرد") {
    return res.status(200).json({ data: categories.مرد });
  } else {
    return res.status(400).json({ message: "جنسیت باید زن یا مرد باشد" });
  }
};
///////////////// All controller for myclothes

exports.ClothesCategoryCreate = async (req, res) => {
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
  const name = req.body.name;
  try {
    let newCategory = await db.Category_Clothing.create({
      data: {
        name: name,
        userId: id,
      },
    });
    return res.status(201).json({ message: "دسته‌بندی با موفقیت اضافه شد" });
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "دسته‌بندی با این نام وجود دارد" });
    } else if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربری با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.ClothesCategoryGetAll = async (req, res) => {
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
    let user = await db.User.findFirst({
      where: {
        id: id,
      },
      include: {
        category_clothing: true,
      },
    });
    if (user) {
      return res.status(200).json({ data: user.category_clothing });
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

exports.ClothesCategoryDelete = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  try {
    let category = await db.Category_Clothing.findFirst({
      where: {
        id: categoryId,
      },
    });
    if (category && category.userId === id) {
      await db.Category_Clothing.delete({
        where: {
          id: categoryId,
        },
      });
      return res.status(200).json({ message: "دسته‌بندی با موفقیت حذف شد" });
    } else if (category) {
      return res
        .status(404)
        .json({ message: "‌دسته‌بندی با این شناسه ایجاد کننده وجود ندارد" });
    } else {
      return res
        .status(404)
        .json({ message: "‌دسته‌بندی با این شناسه وجود ندارد" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.ClothesCategoryUpdate = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  const name = req.body.name;
  try {
    let category = await db.Category_Clothing.findFirst({
      where: {
        id: categoryId,
      },
    });
    if (category && category.userId === id) {
      await db.Category_Clothing.update({
        where: {
          id: categoryId,
        },
        data: {
          name: name,
        },
      });
      return res.status(200).json({ message: "دسته‌بندی با موفقیت ویرایش شد" });
    } else if (category) {
      return res
        .status(400)
        .json({ message: "شناسه ایجاد کننده دسته‌بندی اشتباه است" });
    } else {
      return res
        .status(404)
        .json({ message: "دسته‌بندی با این شناسه وجود ندارد" });
    }
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "دسته‌بندی با این نام وجود دارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.ClothesClothingCreate = async (req, res) => {
  if (req.files.length == 0) {
    return res.status(400).json({ message: "عکس اجباری است" });
  }
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), process.env.SECRET_TOKEN).id;
  } catch (err) {
    console.log(err);
    await removeFiles(req.files);
    if (err.name === "TokenExpiredError")
      return res.status(400).json({ message: "زمان ورود شما منقضی شده است" });
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "توکن احراز هویت نامعتبر است" });
    } else {
      return res.status(400).json({ message: "خطای احراز هویت" });
    }
  }
  const categoryId = parseInt(req.params.categoryId);
  const material = req.body.material;
  const season = req.body.season;
  const size = req.body.size;
  var newClothing;
  try {
    let category = await db.Category_Clothing.findFirst({
      where: {
        id: categoryId,
      },
    });
    if (category && category.userId === id) {
      newClothing = await db.Clothing.create({
        data: {
          category_clothingId: categoryId,
          userId: id,
          material: material,
          season: season,
          size: size,
        },
      });
    } else if (category) {
      await removeFiles(req.files);
      return res
        .status(400)
        .json({ message: "شناسه ایجاد کننده دسته‌بندی اشتباه است" });
    } else {
      await removeFiles(req.files);
      return res
        .status(404)
        .json({ message: "دسته‌بندی با این شناسه وجود ندارد" });
    }
  } catch (err) {
    console.log(err);
    await removeFiles(req.files);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربر یا دسته‌بندی با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
  try {
    req.files.forEach(async (item) => {
      let newImage = await db.Image_Clothing.create({
        data: {
          clothingId: newClothing.id,
          url: req.get("host") + `/images/${item.filename}`,
        },
      });
    });
  } catch (err) {
    console.log(err);
    await removeFiles(req.files);
    if (err.code && err.code === "P2003") {
      return res.status(404).json({ message: "لباسی با این شناسه وجود ندارد" });
    } else if (err.code && err.code === "P2002") {
      return res.status(404).json({ message: "عکسی با این آدرس وجود دارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
  return res.status(201).json({ message: "لباس با موفقیت اضافه شد" });
};

exports.ClothesClothingGetAll = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  try {
    let category = await db.Category_Clothing.findFirst({
      where: {
        id: categoryId,
        userId: id,
      },
      include: {
        clothing: true,
      },
    });
    if (category) {
      return res.status(200).json({ data: category.clothing });
    } else {
      return res
        .status(404)
        .json({ message: "دسته‌بندی یا کاربری با این شناسه وجود ندارد" });
    }
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربری با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.ClothesClothingUpdate = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  const clothingId = parseInt(req.params.clothingId);
  const material = req.body.material;
  const season = req.body.season;
  const size = req.body.size;
  try {
    let clothing = await db.Clothing.findFirst({
      where: {
        id: clothingId,
        userId: id,
        category_clothingId: categoryId,
      },
    });
    if (clothing) {
      await db.Clothing.update({
        where: {
          id: clothingId,
        },
        data: {
          material: material,
          season: season,
          size: size,
        },
      });
      return res.status(200).json({ message: "لباس با موفقیت ویرایش شد" });
    } else {
      return res.status(404).json({
        message:
          "لباسی با این شناسه یا شناسه ایجاد کننده یا شناسه دسته‌بندی وجود ندارد",
      });
    }
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربر یا دسته‌بندی با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.ClothesClothingDelete = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  const clothingId = parseInt(req.params.clothingId);
  var clothing = null;
  try {
    clothing = await db.Clothing.findFirst({
      where: {
        id: clothingId,
        userId: id,
        category_clothingId: categoryId,
      },
      include: {
        images_clothing: true,
      },
    });
    if (!clothing) {
      return res.status(404).json({
        message:
          "لباسی با این شناسه یا شناسه ایجاد کننده یا شناسه دسته‌بندی وجود ندارد",
      });
    }
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربر یا دسته‌بندی با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
  try {
    if (clothing) {
      clothing.images_clothing.forEach(async (item) => {
        fs.unlink(
          `public/images/${
            item.url.split("/")[item.url.split("/").length - 1]
          }`,
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
  try {
    await db.Clothing.delete({
      where: {
        id: clothing.id,
      },
    });
    return res.status(200).json({ message: "لباس با موفقیت حذف شد" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.ClothesClothingGetOne = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  const clothingId = parseInt(req.params.clothingId);
  try {
    let clothing = await db.Clothing.findFirst({
      where: {
        id: clothingId,
        userId: id,
        category_clothingId: categoryId,
      },
      include: {
        images_clothing: true,
      },
    });
    if (clothing) {
      return res.status(200).json({ data: clothing });
    } else {
      return res.status(404).json({
        message: "لباس یا دسته‌بندی یا کاربری با این شناسه وجود ندارد",
      });
    }
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربر یا دسته‌بندی با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

///////////////// All controller for mysets

exports.SetsCategoryCreate = async (req, res) => {
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
  const name = req.body.name;
  try {
    let newCategory = await db.Category_Set.create({
      data: {
        name: name,
        userId: id,
      },
    });
    return res.status(201).json({ message: "دسته‌بندی با موفقیت اضافه شد" });
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "دسته‌بندی با این نام وجود دارد" });
    } else if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربری با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.SetsCategoryGetAll = async (req, res) => {
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
    let user = await db.User.findFirst({
      where: {
        id: id,
      },
      include: {
        category_set: true,
      },
    });
    if (user) {
      return res.status(200).json({ data: user.category_set });
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

exports.SetsCategoryDelete = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  try {
    let category = await db.Category_Set.findFirst({
      where: {
        id: categoryId,
      },
    });
    if (category && category.userId === id) {
      await db.Category_Set.delete({
        where: {
          id: categoryId,
        },
      });
      return res.status(200).json({ message: "دسته‌بندی با موفقیت حذف شد" });
    } else if (category) {
      return res
        .status(404)
        .json({ message: "‌دسته‌بندی با این شناسه ایجاد کننده وجود ندارد" });
    } else {
      return res
        .status(404)
        .json({ message: "‌دسته‌بندی با این شناسه وجود ندارد" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.SetsCategoryUpdate = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  const name = req.body.name;
  try {
    let category = await db.Category_Set.findFirst({
      where: {
        id: categoryId,
      },
    });
    if (category && category.userId === id) {
      await db.Category_Set.update({
        where: {
          id: categoryId,
        },
        data: {
          name: name,
        },
      });
      return res.status(200).json({ message: "دسته‌بندی با موفقیت ویرایش شد" });
    } else if (category) {
      return res
        .status(400)
        .json({ message: "شناسه ایجاد کننده دسته‌بندی اشتباه است" });
    } else {
      return res
        .status(404)
        .json({ message: "دسته‌بندی با این شناسه وجود ندارد" });
    }
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "دسته‌بندی با این نام وجود دارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.SetsClothingCreate = async (req, res) => {
  if (req.files.length == 0) {
    return res.status(400).json({ message: "عکس اجباری است" });
  } else if (req.files.length > 1) {
    await removeFiles(req.files);
    return res.status(400).json({ message: "یک عکس مجاز است" });
  }
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), process.env.SECRET_TOKEN).id;
  } catch (err) {
    console.log(err);
    await removeFiles(req.files);
    if (err.name === "TokenExpiredError")
      return res.status(400).json({ message: "زمان ورود شما منقضی شده است" });
    else if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "توکن احراز هویت نامعتبر است" });
    } else {
      return res.status(400).json({ message: "خطای احراز هویت" });
    }
  }
  const categoryId = parseInt(req.params.categoryId);
  const products = req.body.products;
  var newClothing;
  try {
    let category = await db.Category_Set.findFirst({
      where: {
        id: categoryId,
      },
    });
    if (category && category.userId === id) {
      newClothing = await db.Set.create({
        data: {
          category_setId: categoryId,
          userId: id,
          image_set: req.get("host") + `/images/${req.files[0].filename}`,
        },
      });
    } else if (category) {
      await removeFiles(req.files);
      return res
        .status(400)
        .json({ message: "شناسه ایجاد کننده دسته‌بندی اشتباه است" });
    } else {
      await removeFiles(req.files);
      return res
        .status(404)
        .json({ message: "دسته‌بندی با این شناسه وجود ندارد" });
    }
  } catch (err) {
    console.log(err);
    await removeFiles(req.files);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربری با این شناسه وجود ندارد" });
    } else if (err.code && err.code === "P2002") {
      return res.status(409).json({ message: "عکسی با این آدرس وجود دارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
  try {
    products &&
      JSON.parse(products).forEach(async (item) => {
        await db.Set_Product.create({
          data: {
            setId: newClothing.id,
            productId: item,
          },
        });
      });
    return res.status(201).json({ message: "ست با موفقیت اضافه شد" });
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "ست یا محصولی با این شناسه وجود ندارد" });
    }
    return res.status(404).json({ message: "محصولی با این شناسه وجود ندارد" });
  }
};

exports.SetsClothingGetAll = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  try {
    let sets = await db.Set.findMany({
      where: {
        category_setId: categoryId,
        userId: id,
      },
      include: {
        set_product: true,
      },
    });
    if (sets.length > 0) {
      return res.status(200).json({ data: sets });
    } else {
      return res.status(404).json({
        message: "ستی با این شناسه دسته‌بندی یا ایجادکننده وجود ندارد",
      });
    }
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربری با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

// exports.SetsClothingUpdate = async (req, res) => {
//   var id;
//   try {
//     id = jwt.verify(req.header("Authorization"), process.env.SECRET_TOKEN).id;
//   } catch (err) { 
//     console.log(err);
//     if (err.name === "TokenExpiredError")
//       return res.status(400).json( { message: ("زمان ورود شما منقضی شده است") } );
//     else if (err.name === "JsonWebTokenError") {
//       return res.status(400).json( { message: ("توکن احراز هویت نامعتبر است") } );
//     } else {
//       return res.status(400).json( { message: ("خطای احراز هویت") } );
//     }
//   }
//   const categoryId = parseInt(req.params.categoryId);
//   const setId = parseInt(req.params.setId);
//   try {
//     let clothing = await db.Clothing.findFirst({
//       where: {
//         id: clothingId,
//         userId: id,
//         category_clothingId: categoryId,
//       },
//     });
//     if (clothing) {
//       await db.Clothing.update({
//         where: {
//           id: clothingId,
//         },
//         data: {
//           material: material,
//           season: season,
//           size: size,
//         },
//       });
//       return res.status(200).json( { message: ("لباس با موفقیت ویرایش شد") } );
//     } else {
//       return res
//         .status(404)
//         .json({ message:
//           "لباسی با این شناسه یا شناسه ایجاد کننده یا شناسه دسته‌بندی وجود ندارد"
//         );
//     }
//   } catch (err) { 
//     console.log(err);
//     return res.status(500).json( { message: ("عملیات با خطا مواجه شد") } );
//   }
// };

exports.SetsClothingDelete = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  const setId = parseInt(req.params.setId);
  var set = null;
  try {
    set = await db.Set.findFirst({
      where: {
        id: setId,
        userId: id,
        category_setId: categoryId,
      },
    });
    if (!set) {
      return res.status(404).json({
        message:
          "ستی با این شناسه یا شناسه ایجاد کننده یا شناسه دسته‌بندی وجود ندارد",
      });
    }
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربر یا دسته‌بندی با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
  try {
    if (set) {
      fs.unlink(
        `public/images/${
          set.image_set.split("/")[set.image_set.split("/").length - 1]
        }`,
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
  try {
    await db.Set.delete({
      where: {
        id: set.id,
      },
    });
    return res.status(200).json({ message: "ست با موفقیت حذف شد" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.SetsClothingGetOne = async (req, res) => {
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
  const categoryId = parseInt(req.params.categoryId);
  const setId = parseInt(req.params.setId);
  try {
    let set = await db.Set.findFirst({
      where: {
        id: setId,
        userId: id,
        category_setId: categoryId,
      },
      include: {
        set_product: true,
      },
    });
    if (set) {
      return res.status(200).json({ data: set });
    } else {
      return res
        .status(404)
        .json({ message: "ست یا دسته‌بندی یا کاربری با این شناسه وجود ندارد" });
    }
  } catch (err) {
    console.log(err);
    if (err.code && err.code === "P2003") {
      return res
        .status(404)
        .json({ message: "کاربر یا دسته‌بندی با این شناسه وجود ندارد" });
    }
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};
