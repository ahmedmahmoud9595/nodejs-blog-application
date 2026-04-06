const Joi = require("joi");

const CreateUserSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(10).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(8).required(),
});
const updateUserSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(10).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(3).max(8).optional(),
});

module.exports = {
  CreateUserSchema,
  updateUserSchema,
};
