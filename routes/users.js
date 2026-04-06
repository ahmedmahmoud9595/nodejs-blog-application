const express = require("express");
const {
  getUser,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const validate = require("../middleware/joi-validation-middleware");
const {
  CreateUserSchema,
  updateUserSchema,
} = require("../utils/validation/user");
const router = express.Router();
const { uploadLocal, uploadCDN } = require("../middleware/upload-middleware");
const uploadImageKit = require("../middleware/image-kit-middleware");
const auth = require("../middleware/auth");
const restrictTo = require("../middleware/restrictTo");
router.get("/", auth, getUser);
router.get("/:id", auth, getOneUser);

router.post(
  "/",
  validate(CreateUserSchema),
  uploadCDN.single("img"),
  uploadImageKit(false, "users"),
  createUser,
);

router.patch("/:id", validate(updateUserSchema), updateUser);

router.delete("/:id", auth, restrictTo("admin", "superAdmin"), deleteUser);

module.exports = router;
