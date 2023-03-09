const fs = require("fs");

exports.removeFiles = async (files) => {
  files &&
    (await files.forEach((item) => {
      fs.unlink(`public/images/${item.filename}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }));
};
