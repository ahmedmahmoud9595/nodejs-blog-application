const Post = require("../models/posts");
const Group = require("../models/group");
const AppError = require("../utils/app-error");

const getPosts = async (req, res) => {
  const user = req.user;

  if (user && user.role === "superAdmin") {
    const posts = await Post.find()
      .populate("authorId")
      .populate("groupId")
      .sort("-createdAt");

    return res.json(posts);
  }

  const posts = await Post.find()
    .populate("authorId")
    .populate("groupId")
    .sort("-createdAt");

  const filteredPosts = posts.filter((post) => {
    if (!post.groupId) return true;

    const group = post.groupId;

    return group.members.some((id) => id.toString() === user._id.toString());
  });

  res.json(filteredPosts);
};

const getUserPosts = async (req, res) => {
  const posts = await Post.find({ authorId: req.params.userId })
    .populate("authorId")
    .populate("groupId")
    .sort("-createdAt");

  const user = req.user;

  if (user.role === "superAdmin") {
    return res.json(posts);
  }

  const filteredPosts = posts.filter((post) => {
    if (!post.groupId) return true;

    if (!post.groupId.members) return false;

    return post.groupId.members.some((member) => {
      if (!member) return false;

      return member._id.toString() === req.user._id.toString();
    });
  });

  res.json(filteredPosts);
};

const createPost = async (req, res) => {
  let group = null;

  if (req.body.groupId) {
    group = await Group.findById(req.body.groupId);

    if (!group) throw new AppError(404, "group not found");

    if (req.user.role !== "superAdmin") {
      const isMember = group.members.includes(req.user._id);
      if (!isMember) throw new AppError(403, "not group member");

      if (!group.permissions.canPost) {
        throw new AppError(403, "posting not allowed");
      }
    }
  }

  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    images: req.imagesUrl || [],
    authorId: req.user._id,
    groupId: req.body.groupId || null,
  });

  res.status(201).json(post);
};

const updatePost = async (req, res) => {
  Object.assign(req.post, req.body);
  await req.post.save();

  res.json(req.post);
};

const deletePost = async (req, res) => {
  await req.post.deleteOne();
  res.json({ message: "deleted" });
};

module.exports = {
  getPosts,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
};
