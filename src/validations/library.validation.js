const Joi = require('joi');


exports.librarySchema = Joi.object({

  name:Joi.string()
    .required()
    .min(3)
    .max(50),
  address: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  email: Joi.string()
    .email()
    .required()
    
});

exports.updateLibrarySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30),
  address: Joi.string()
    .min(3)
    .max(100),
  email: Joi.string()
    .email()
});