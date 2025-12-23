const Joi = require('joi');

exports.categorySchema = Joi.object({

  category_name: Joi.string()
    .required()
    .min(3)
    .max(30),
  library_id: Joi.string()
    .required(),
  admin_id: Joi.string()
  .required()

});


exports.updateCategorySchema = Joi.object({

  category_name: Joi.string()
    .min(3)
    .max(30),
  library_id: Joi.string(),
  admin_id: Joi.string()
});