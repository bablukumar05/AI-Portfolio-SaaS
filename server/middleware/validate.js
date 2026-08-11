const logger = require("../utils/logger");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    logger.warn(`Validation failed for ${req.originalUrl}: ${errorMessages.join(", ")}`);
    return res.status(400).json({
      success: false,
      msg: errorMessages[0], // Use 'msg' to match frontend expected key
      errors: errorMessages
    });
  }
  next();
};


module.exports = validate;