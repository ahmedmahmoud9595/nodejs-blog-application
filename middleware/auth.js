const AppError = require("../utils/app-error");
const util = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const jwtVerify = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new AppError(401, "no token provided");
  }

  const token = req.headers.authorization.split(" ")[1];

  const payload = await jwtVerify(token, process.env.JWT_SECRET);

  const user = await User.findById(payload.sub);

  if (!user) {
    throw new AppError(404, "user not found");
  }

  req.user = user;

  next();
};

module.exports = auth;
