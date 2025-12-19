const Joi = require('joi');


exports.signupSchema = Joi.object({

  name: Joi.string()
    .min(3)
    .max(50)
    .required(),
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,30}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain uppercase, lowercase, and a number'
  }),

  role: Joi.string()
    .valid('superAdmin', 'admin', 'user')
    .required(),
  library_id: Joi.when('role', {
    is: 'superAdmin',
    then: Joi.forbidden(),
    otherwise: Joi.string().required()
  })


});


exports.loginSchema = Joi.object({

  email: Joi.string()
    .required()
    .email()
    .lowercase(),
  password: Joi.string()
    .required()

});