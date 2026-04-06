const AppError = require("../utils/app-error");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const util = require("util");
const jwt = require("jsonwebtoken");

const jwtSign = util.promisify(jwt.sign);

const register = async (req, res) => {
  const imageUrl = req.imagesUrl ? req.imagesUrl[0] : null;

  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    photo: imageUrl,
  });

  user.password = undefined;

  res.status(201).json({ message: "user created", user });
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }, null, {
    includePassword: true,
  });

  if (!user) throw new AppError(400, "invalid credentials");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) throw new AppError(400, "invalid credentials");

  const token = await jwtSign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXP,
  });

  user.password = undefined;

  res.json({ token, user });
};

module.exports = { register, login };
