const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const fs = require("fs");

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
//create images validation
const vImages = require("../validators/images.js");

//create images router
router.post(
  "/uploadBulkImage",
  (req, res, next) => vImages.vImagesCraete(req, res, next),
  imageUpload.array("images", 1),
  (req, res) => {
    var spawn = require("child_process").spawnSync;
    const pipInstall = spawn(
      "pip",
      ["install", "rembg"],
      {
        encoding: "utf-8",
      }
    );
    console.log(`pip install output: ${pipInstall.stdout}`);
    if (pipInstall.stderr)
      console.log(`pip install error: ${pipInstall.stderr}`);
    if (pipInstall.status === 0) {
      const process = spawn(
        "python",
        [
          `public/removeBg.py`,
          `public/images/${req.files[0].filename}`,
          `public/images/bg_${req.files[0].filename.split(".")[0]}.png`,
        ],
        {
          encoding: "utf-8",
        }
      );
      if (process.stderr) {
        console.log(`python run error: ${process.stderr}`);
        res.status(500).send(`python run error: ${process.stderr}`);
      } else {
        res.sendFile(
          path.resolve(
            `public/images/bg_${req.files[0].filename.split(".")[0]}.png`
          ),
          function (err) {
            if (err) {
              console.log(err);
            } else {
              fs.unlink(
                `public/images/bg_${req.files[0].filename.split(".")[0]}.png`,
                (err) => {
                  if (err) {
                    throw err;
                  }

                  console.log("Delete File bg successfully.");
                }
              );
            }
          }
        );
      }
    } else {
      res.status(500).send("can not pip install package");
    }
    fs.unlink(`public/images/${req.files[0].filename}`, (err) => {
      if (err) {
        throw err;
      }

      console.log("Delete File original successfully.");
    });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
