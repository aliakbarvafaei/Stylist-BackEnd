//config database for send query
const Schema = require("validate");
const removeFiles = require("../functions/rmFiles").removeFiles;
require("dotenv").config();

exports.vClothesCategories = (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

///////////////// All validator for myclothes

exports.vClothesCategoryCraete = (req, res, next) => {
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
    if (res_data.length > 0) return res.status(400).json({ message: res_data });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vClothesCategoryGetAll = (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vClothesCategoryDelete = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vClothesCategoryUpdate = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
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
    if (res_data.length > 0) return res.status(400).json({ message: res_data });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vClothesClothingCreate = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId))) {
      removeFiles(req.files);
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
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
      return res.status(400).json({ message: res_data });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vClothesClothingGetAll = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vClothesClothingUpdate = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
    if (!(req.params.clothingId == parseInt(req.params.clothingId)))
      return res.status(400).json({ message: "شناسه لباس باید عدد باشد" });
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
    if (res_data.length > 0) return res.status(400).json({ message: res_data });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vClothesClothingDelete = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
    if (!(req.params.clothingId == parseInt(req.params.clothingId)))
      return res.status(400).json({ message: "شناسه لباس باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vClothesClothingGetOne = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
    if (!(req.params.clothingId == parseInt(req.params.clothingId)))
      return res.status(400).json({ message: "شناسه لباس باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

///////////////// All validator for mysets

exports.vSetsCategoryCraete = (req, res, next) => {
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
    if (res_data.length > 0) return res.status(400).json({ message: res_data });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vSetsCategoryGetAll = (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vSetsCategoryDelete = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vSetsCategoryUpdate = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
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
    if (res_data.length > 0) return res.status(400).json({ message: res_data });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vSetsClothingCreate = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId))) {
      removeFiles(req.files);
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
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
      return res.status(400).json({ message: res_data });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vSetsClothingGetAll = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

// exports.vSetsClothingUpdate = (req, res, next) => {
//   try {
//     next();
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json( { message: ("عملیات با خطا مواجه شد") } );
//   }
// };

exports.vSetsClothingDelete = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
    if (!(req.params.setId == parseInt(req.params.setId)))
      return res.status(400).json({ message: "شناسه ست باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};

exports.vSetsClothingGetOne = (req, res, next) => {
  try {
    if (!(req.params.categoryId == parseInt(req.params.categoryId)))
      return res.status(400).json({ message: "شناسه دسته‌بندی باید عدد باشد" });
    if (!(req.params.setId == parseInt(req.params.setId)))
      return res.status(400).json({ message: "شناسه ست باید عدد باشد" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "عملیات با خطا مواجه شد" });
  }
};
