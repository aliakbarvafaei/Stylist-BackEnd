const { PrismaClient } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const db = new PrismaClient();
const fs = require("fs");
const { isAuthunticated } = require("../utils/auth");
const {
  InternalServerError,
  ConflictError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/errors");
const removeFiles = require("../utils/rmFiles").removeFiles;
require("dotenv").config();

// All category for myclothes

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
    throw new BadRequestError("جنسیت باید زن یا مرد باشد");
  }
};

// All controller for myclothes

exports.ClothesCategoryCreate = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
    if (err.code && err.code === "P2002") {
      throw new ConflictError("دسته‌بندی با این نام وجود دارد");
    } else if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.ClothesCategoryGetAll = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.ClothesCategoryDelete = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError("‌دسته‌بندی با این شناسه ایجاد کننده وجود ندارد");
    } else {
      throw new NotFoundError("‌دسته‌بندی با این شناسه وجود ندارد");
    }
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.ClothesCategoryUpdate = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new BadRequestError("شناسه ایجاد کننده دسته‌بندی اشتباه است");
    } else {
      throw new NotFoundError("دسته‌بندی با این شناسه وجود ندارد");
    }
  } catch (err) {
    if (err.code && err.code === "P2002") {
      throw new ConflictError("دسته‌بندی با این نام وجود دارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.ClothesClothingCreate = async (req, res) => {
  if (req.files.length == 0) {
    throw new BadRequestError("عکس اجباری است");
  }

  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
  }

  const categoryId = parseInt(req.params.categoryId);
  const { material, season, size } = req.body;
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
      throw new BadRequestError("شناسه ایجاد کننده دسته‌بندی اشتباه است");
    } else {
      await removeFiles(req.files);
      throw new NotFoundError("دسته‌بندی با این شناسه وجود ندارد");
    }
  } catch (err) {
    await removeFiles(req.files);

    if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربر یا دسته‌بندی با این شناسه وجود ندارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
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
    await removeFiles(req.files);

    if (err.code && err.code === "P2003") {
      throw new NotFoundError("لباسی با این شناسه وجود ندارد");
    } else if (err.code && err.code === "P2002") {
      throw new ConflictError("عکسی با این آدرس وجود دارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }

  return res.status(201).json({ message: "لباس با موفقیت اضافه شد" });
};

exports.ClothesClothingGetAll = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError("دسته‌بندی یا کاربری با این شناسه وجود ندارد");
    }
  } catch (err) {
    if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.ClothesClothingUpdate = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
  }

  const categoryId = parseInt(req.params.categoryId);
  const clothingId = parseInt(req.params.clothingId);
  const { material, season, size } = req.body;

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
      throw new NotFoundError(
        "لباسی با این شناسه یا شناسه ایجاد کننده یا شناسه دسته‌بندی وجود ندارد"
      );
    }
  } catch (err) {
    if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربر یا دسته‌بندی با این شناسه وجود ندارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.ClothesClothingDelete = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError(
        "لباسی با این شناسه یا شناسه ایجاد کننده یا شناسه دسته‌بندی وجود ندارد"
      );
    }
  } catch (err) {
    if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربر یا دسته‌بندی با این شناسه وجود ندارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
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
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }

  try {
    await db.Clothing.delete({
      where: {
        id: clothing.id,
      },
    });

    return res.status(200).json({ message: "لباس با موفقیت حذف شد" });
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.ClothesClothingGetOne = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError(
        "لباس یا دسته‌بندی یا کاربری با این شناسه وجود ندارد"
      );
    }
  } catch (err) {
    if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربر یا دسته‌بندی با این شناسه وجود ندارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

// All controller for mysets

exports.SetsCategoryCreate = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
    if (err.code && err.code === "P2002") {
      throw new ConflictError("دسته‌بندی با این نام وجود دارد");
    } else if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.SetsCategoryGetAll = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.SetsCategoryDelete = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError("‌دسته‌بندی با این شناسه ایجاد کننده وجود ندارد");
    } else {
      throw new NotFoundError("‌دسته‌بندی با این شناسه وجود ندارد");
    }
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.SetsCategoryUpdate = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new BadRequestError("شناسه ایجاد کننده دسته‌بندی اشتباه است");
    } else {
      throw new NotFoundError("دسته‌بندی با این شناسه وجود ندارد");
    }
  } catch (err) {
    if (err.code && err.code === "P2002") {
      throw new ConflictError("دسته‌بندی با این نام وجود دارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.SetsClothingCreate = async (req, res) => {
  if (req.files.length == 0) {
    throw new BadRequestError("عکس اجباری است");
  } else if (req.files.length > 1) {
    await removeFiles(req.files);
    throw new BadRequestError("یک عکس مجاز است");
  }

  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new BadRequestError("شناسه ایجاد کننده دسته‌بندی اشتباه است");
    } else {
      await removeFiles(req.files);
      throw new NotFoundError("دسته‌بندی با این شناسه وجود ندارد");
    }
  } catch (err) {
    await removeFiles(req.files);
    if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    } else if (err.code && err.code === "P2002") {
      throw new ConflictError("عکسی با این آدرس وجود دارد");
    }
    throw new InternalServerError("عملیات با خطا مواجه شد");
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
    if (err.code && err.code === "P2003") {
      throw new NotFoundError("ست یا محصولی با این شناسه وجود ندارد");
    }

    throw new NotFoundError("محصولی با این شناسه وجود ندارد");
  }
};

exports.SetsClothingGetAll = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError(
        "ستی با این شناسه دسته‌بندی یا ایجادکننده وجود ندارد"
      );
    }
  } catch (err) {
    if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربری با این شناسه وجود ندارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

// exports.SetsClothingUpdate = async (req, res) => {
//   var id = await isAuthunticated(req, res);
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
// throw new NotFoundError("لباسی با این شناسه یا شناسه ایجاد کننده یا شناسه دسته‌بندی وجود ندارد"
//         );
//     }
//   } catch (err) {
// throw new InternalServerError("عملیات با خطا مواجه شد");
//   }
// };

exports.SetsClothingDelete = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError(
        "ستی با این شناسه یا شناسه ایجاد کننده یا شناسه دسته‌بندی وجود ندارد"
      );
    }
  } catch (err) {
    if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربر یا دسته‌بندی با این شناسه وجود ندارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
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
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }

  try {
    await db.Set.delete({
      where: {
        id: set.id,
      },
    });

    return res.status(200).json({ message: "ست با موفقیت حذف شد" });
  } catch (err) {
    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};

exports.SetsClothingGetOne = async (req, res) => {
  var { id, type } = await isAuthunticated(req, res);
  if (type != "user") {
    throw new ForbiddenError("دسترسی این کار را ندارید");
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
      throw new NotFoundError(
        "ست یا دسته‌بندی یا کاربری با این شناسه وجود ندارد"
      );
    }
  } catch (err) {
    if (err.code && err.code === "P2003") {
      throw new NotFoundError("کاربر یا دسته‌بندی با این شناسه وجود ندارد");
    }

    throw new InternalServerError("عملیات با خطا مواجه شد");
  }
};
