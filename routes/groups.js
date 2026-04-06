const express = require("express");
const router = express.Router();

const { createGroup, addUser, removeUser } = require("../controllers/groups");

const auth = require("../middleware/auth");

router.post("/", auth, createGroup);
router.post("/:id/add-user", auth, addUser);
router.post("/:id/remove-user", auth, removeUser);

module.exports = router;
