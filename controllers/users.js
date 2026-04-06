const AppError = require("../utils/app-error");
const User = require("../models/users");

const getUser = async (req, res, next) => {
  console.log(req.user);
  const users = await User.find();
  res.status(200).json(users);
};

const getOneUser = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "user not found");
  }
  res.status(200).json(user);
};

const createUser = async (req, res) => {
  const body = req.body;
  const imageUrl = req.imagesUrl ? req.imagesUrl[0] : null;
  const user = await User.create({
    userName: body.userName,
    email: body.email,
    password: body.password,
    photo: imageUrl,
    role: "admin",
  });

  res.status(201).json({ massage: "user created", user });
};

const updateUser = async (req, res) => {
  const body = req.body;
  const userId = req.params.id;

  const user = await User.findByIdAndUpdate(userId, body, { new: true });
  if (!user) {
    throw new AppError(404, "user not found");
  }

  res.status(200).json({ massges: "user updated", user });
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError(404, "user not found");
  }

  res.status(200).json({ massage: "user deleted" });
};

module.exports = {
  getUser,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
};
