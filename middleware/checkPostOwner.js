const Post = require("../models/posts");
const AppError = require("../utils/app-error");

const checkPostOwner = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) throw new AppError(404, "post not found");

  if (
    post.authorId.toString() !== req.user._id.toString() &&
    req.user.role !== "superAdmin"
  ) {
    throw new AppError(403, "not allowed");
  }

  req.post = post;
  next();
};

module.exports = checkPostOwner;
