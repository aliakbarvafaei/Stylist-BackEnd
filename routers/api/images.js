const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const Images = require("../../controllers/images.controller.js");
const {
  BadRequestError,
  InternalServerError,
} = require("../../utils/errors.js");
const { imageUpload } = require("../../utils/multer.js");

//create images router
router.post(
  "/uploadBulkImage",
  (req, res, next) => Images.ImagesCraete(req, res, next),
  imageUpload.array("images", 1),
  (req, res) => {
    var spawn = require("child_process").spawnSync;
    const pipInstall = spawn("pip", ["install", "rembg"], {
      encoding: "utf-8",
    });
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
        throw new InternalServerError(`python run error: ${process.stderr}`);
      } else {
        res.sendFile(
          path.resolve(
            `public/images/bg_${req.files[0].filename.split(".")[0]}.png`
          ),
          function (err) {
            if (err) {
              throw new InternalServerError("عملیات با خطا مواجه شد");
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
      throw new InternalServerError("can not pip install package");
    }
    fs.unlink(`public/images/${req.files[0].filename}`, (err) => {
      if (err) {
        throw err;
      }

      console.log("Delete File original successfully.");
    });
  },
  (error, req, res, next) => {
    next(error);
  }
);

module.exports = router;
