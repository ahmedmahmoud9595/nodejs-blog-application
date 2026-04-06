const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/auth");

const { uploadCDN } = require("../middleware/upload-middleware");
const uploadImageKit = require("../middleware/image-kit-middleware");
const validate = require("../middleware/joi-validation-middleware");
const { CreateUserSchema } = require("../utils/validation/user");

router.post("/login", login);

router.post(
  "/register",
  validate(CreateUserSchema),
  uploadCDN.single("img"),
  uploadImageKit(false, "users"),
  register,
);

module.exports = router;
