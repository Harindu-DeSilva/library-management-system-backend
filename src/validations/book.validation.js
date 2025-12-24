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
    status: Joi.string()
      .valid('available', 'borrowed', 'damaged')
});