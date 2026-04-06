const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    permissions: {
      canPost: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true },
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
