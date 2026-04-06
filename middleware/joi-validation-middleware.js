const AppError = require("../utils/app-error");

const validate = (schema) => {
  return (req, res, next) => {
    const body = req.body;
    const { error } = schema.validate(body, { abortEarly: false });
    if (error) {
      throw new AppError(
        400,
        error.details.map((err) => err.message).join(", "),
      );
    }
    next();
  };
};

module.exports = validate;
