const Joi = require('joi');

exports.lendingCreateValidationSchema = Joi.object({
  lend_user_id: Joi.string()
    .required(),
  book_id: Joi.string()
    .required(),
  quantity: Joi.number()
    .required(),
  category_id: Joi.string()
    .required(),
  library_id: Joi.string()
    .required(),
  due_date: Joi.date()
    .required()
});