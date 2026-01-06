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



exports.lendingUpdateValidationSchema = Joi.object({
  book_id: Joi.string()
    .required(),
  quantity: Joi.number()
    .required(),
  return_date: Joi.date()
    .required(),
  status: Joi.string()
    .required()
    .validate("BORROWED", "RETURNED", "OVERDUE"),
});