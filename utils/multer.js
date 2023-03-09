const multer = require("multer");
const path = require("path");

// config image save with multer
const imageStorage = multer.diskStorage({
  destination: "public/images", // Destination to store image
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image), path.extname get the uploaded file extension
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("فرمت عکس باید jpg یا png باشد"));
    }
    cb(undefined, true);
  },
});

module.exports = {
  imageStorage,
  imageUpload,
};
