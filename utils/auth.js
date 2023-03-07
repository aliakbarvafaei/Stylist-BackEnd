const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("./errors");

function getJwtToken(req) {
  if (req.header("Authorization")) {
    return req.header("Authorization");
  }

  return null;
}

const isAuthunticated = (req, res) => {
  var id;
  try {
    id = jwt.verify(req.header("Authorization"), process.env.SECRET_TOKEN).id;
  } catch (err) {
    if (err.name === "TokenExpiredError")
      throw new UnauthorizedError("زمان ورود شما منقضی شده است");
    else if (err.name === "JsonWebTokenError") {
      throw new UnauthorizedError("توکن احراز هویت نامعتبر است");
    } else {
      throw new UnauthorizedError("خطای احراز هویت");
    }
  }
  return id;
};

module.exports = {
  getJwtToken,
  isAuthunticated,
};
