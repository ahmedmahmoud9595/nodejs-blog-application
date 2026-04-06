const Joi = require("joi");

const createPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  groupId: Joi.string().optional(),
});

module.exports = { createPostSchema };
