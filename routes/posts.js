const express = require("express");
const router = express.Router();

const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
} = require("../controllers/posts");

const auth = require("../middleware/auth");
const checkPostOwner = require("../middleware/checkPostOwner");

const { uploadCDN } = require("../middleware/upload-middleware");
const uploadImageKit = require("../middleware/image-kit-middleware");
const validate = require("../middleware/joi-validation-middleware");
const { createPostSchema } = require("../utils/validation/post");

router.get("/", auth, getPosts);
router.get("/user/:userId", auth, getUserPosts);

router.post(
  "/",
  auth,
  validate(createPostSchema),
  uploadCDN.array("images"),
  uploadImageKit(true, "posts"),
  createPost,
);

router.patch("/:id", auth, checkPostOwner, updatePost);
router.delete("/:id", auth, checkPostOwner, deletePost);

module.exports = router;
