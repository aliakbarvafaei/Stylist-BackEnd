const Schema = require("validate");
const removeFiles = require("../utils/rmFiles").removeFiles;
require("dotenv").config();
const Closet = require("../services/closet");
const { BadRequestError } = require("../utils/errors");

exports.ClothesCategories = async (req, res, next) => {
  try {
    await Closet.ClothesCategories(req, res);
  } catch (err) {
    return next(err);
  }
};

// myclothes

exports.ClothesCategoryCraete = async (req, res, next) => {
  try {
    const category = new Schema({
      name: {
        type: String,
        required: true,
        message: {
          type: "نام باید به صورت رشته باشد",
          required: "نام اجباری است",
        },
      },
    });
    var res_data = [];
    const errors = category.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Closet.ClothesCategoryCreate(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.ClothesCategoryGetAll = async (req, res, next) => {
  try {
    await Closet.ClothesCategoryGetAll(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.ClothesCategoryDelete = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    await Closet.ClothesCategoryDelete(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.ClothesCategoryUpdate = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    const category = new Schema({
      name: {
        type: String,
        message: {
          type: "نام باید به صورت رشته باشد",
        },
      },
    });
    var res_data = [];
    const errors = category.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Closet.ClothesCategoryUpdate(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.ClothesClothingCreate = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId))) {
      removeFiles(req.files);
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    }
    const clothing = new Schema({
      material: {
        type: String,
        required: true,
        message: {
          type: "جنس باید به صورت رشته باشد",
          required: "جنس اجباری است",
        },
      },
      season: {
        type: String,
        message: {
          type: "فصل باید به صورت رشته باشد",
        },
      },
      size: {
        type: String,
        message: {
          type: "سایز باید به صورت رشته باشد",
        },
      },
    });
    var res_data = [];
    const errors = clothing.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) {
      removeFiles(req.files);
      throw new BadRequestError(res_data);
    }
    await Closet.ClothesClothingCreate(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.ClothesClothingGetAll = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    await Closet.ClothesClothingGetAll(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.ClothesClothingUpdate = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    if (!(req.params.clothingId == parseInt(req.params.clothingId)))
      throw new BadRequestError("شناسه لباس باید عدد باشد");
    const clothing = new Schema({
      material: {
        type: String,
        message: {
          type: "جنس باید به صورت رشته باشد",
        },
      },
      season: {
        type: String,
        message: {
          type: "فصل باید به صورت رشته باشد",
        },
      },
      size: {
        type: String,
        message: {
          type: "سایز باید به صورت رشته باشد",
        },
      },
    });
    var res_data = [];
    const errors = clothing.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Closet.ClothesClothingUpdate(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.ClothesClothingDelete = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    if (!(req.params.clothingId == parseInt(req.params.clothingId)))
      throw new BadRequestError("شناسه لباس باید عدد باشد");
    await Closet.ClothesClothingDelete(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.ClothesClothingGetOne = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    if (!(req.params.clothingId == parseInt(req.params.clothingId)))
      throw new BadRequestError("شناسه لباس باید عدد باشد");
    await Closet.ClothesClothingGetOne(req, res);
  } catch (err) {
    return next(err);
  }
};

// mysets

exports.SetsCategoryCraete = async (req, res, next) => {
  try {
    const category = new Schema({
      name: {
        type: String,
        required: true,
        message: {
          type: "نام باید به صورت رشته باشد",
          required: "نام اجباری است",
        },
      },
    });
    var res_data = [];
    const errors = category.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Closet.SetsCategoryCreate(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.SetsCategoryGetAll = async (req, res, next) => {
  try {
    await Closet.SetsCategoryGetAll(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.SetsCategoryDelete = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    await Closet.SetsCategoryDelete(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.SetsCategoryUpdate = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    const category = new Schema({
      name: {
        type: String,
        message: {
          type: "نام باید به صورت رشته باشد",
        },
      },
    });
    var res_data = [];
    const errors = category.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) throw new BadRequestError(res_data);
    await Closet.SetsCategoryUpdate(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.SetsClothingCreate = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId))) {
      removeFiles(req.files);
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    }
    const set = new Schema({
      products: [
        {
          type: Number,
          message: {
            type: "شناسه محصول باید به صورت عدد باشد",
          },
        },
      ],
    });
    var res_data = [];
    const errors = set.validate(req.body);
    errors.forEach((element) => {
      res_data.push(element.message);
    });
    if (res_data.length > 0) {
      removeFiles(req.files);
      throw new BadRequestError(res_data);
    }
    await Closet.SetsClothingCreate(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.SetsClothingGetAll = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    await Closet.SetsClothingGetAll(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.SetsClothingDelete = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    if (!(req.params.setId == parseInt(req.params.setId)))
      throw new BadRequestError("شناسه ست باید عدد باشد");
    await Closet.SetsClothingDelete(req, res);
  } catch (err) {
    return next(err);
  }
};

exports.SetsClothingGetOne = async (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      throw new BadRequestError("شناسه دسته‌بندی باید عدد باشد");
    if (!(req.params.setId == parseInt(req.params.setId)))
      throw new BadRequestError("شناسه ست باید عدد باشد");
    await Closet.SetsClothingGetOne(req, res);
  } catch (err) {
    return next(err);
  }
};
