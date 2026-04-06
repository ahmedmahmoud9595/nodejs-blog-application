const mongoose = require("mongoose");
const Group = require("../models/group");
const AppError = require("../utils/app-error");

const createGroup = async (req, res) => {
  const group = await Group.create({
    name: req.body.name,
    admins: [req.user._id],
    members: [req.user._id],
  });

  res.status(201).json(group);
};

const addUser = async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) throw new AppError(404, "group not found");

  if (!group.admins.includes(req.user._id))
    throw new AppError(403, "not admin");

  const { userId } = req.body;

  if (!userId) throw new AppError(400, "userId is required");

  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new AppError(400, "invalid userId");

  const alreadyMember = group.members.some((id) => id.toString() === userId);

  if (alreadyMember) throw new AppError(400, "user already in group");

  group.members.push(userId);

  await group.save();

  res.json({
    message: "user added successfully",
    group,
  });
};

const removeUser = async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) throw new AppError(404, "group not found");

  if (!group.admins.includes(req.user._id))
    throw new AppError(403, "not admin");

  const { userId } = req.body;

  if (!userId) throw new AppError(400, "userId is required");

  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new AppError(400, "invalid userId");

  const isMember = group.members.some((id) => id.toString() === userId);

  if (!isMember) throw new AppError(400, "user not in group");

  const isAdmin = group.admins.some((id) => id.toString() === userId);

  if (isAdmin) throw new AppError(400, "cannot remove admin");

  group.members = group.members.filter((id) => id.toString() !== userId);

  await group.save();

  res.json({
    message: "user removed successfully",
    group,
  });
};

module.exports = { createGroup, addUser, removeUser };
