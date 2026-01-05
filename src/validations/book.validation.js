const Joi = require('joi');

exports.bookSchema = Joi.object({

  title: Joi.string()
    .min(3)
    .max(30)
    .required(),
  category_id: Joi.string()
    .required(),
  author: Joi.string()
    .min(3)
    .max(30)
    .required(),
  quantity: Joi.number()
    .min(0)
    .integer()
    .required()
});


exports.updateBookSchema = Joi.object({

  title: Joi.string()
    .min(3)
    .max(30),
  category_id: Joi.string(),
  author: Joi.string()
    .min(3)
    .max(30),
  quantity: Joi.number()
    .integer()
    .min(0),
  damaged: Joi.number()
    .integer()
    .min(0),
});