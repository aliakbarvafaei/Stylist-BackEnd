const fs = require("fs");

exports.removeFiles = (files) => {
  files.forEach((item) => {
    fs.unlink(`public/images/${item.filename}`, (err) => {
      if (err) {
        throw err;
      }
    });
  });
};
