require("dotenv").config();

exports.ImagesCraete = (req, res, next) => {
  try {
    next();
  } catch (err) {
    return next(err);
  }
};
