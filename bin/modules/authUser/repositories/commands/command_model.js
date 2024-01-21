const Joi = require('joi');

const messages = {
  any: {
    required: '{{#label}} wajib diisi'
  },
  boolean: {
    base: '{{#label}} harus berupa boolean (true/false)',
  },
  string: {
    base: '{{#label}} harus berupa string',
    min: '{{#label}} harus berisi minimal {{#limit}} karakter',
  },
  custom: {
    subdomain: {
      pattern: '{{#label}} harus memiliki format yang benar'
    }
  }
};

const login = Joi.object({
  username: Joi.string().required().min(6).messages({
    'any.required': messages.any.required,
    'string.base': messages.string.base,
  }),
  password: Joi.string().trim().required().min(6).messages({
    'any.required': messages.any.required,
    'string.base': messages.string.base,
  }),
  remember: Joi.boolean().default(false).messages({
    'boolean.base': messages.boolean.base,
  }),
});

const insertData = Joi.object({
  temp: Joi.number().required()
});

const injectAdmin = Joi.object({
  username: Joi.string().required().min(6).messages({
    'any.required': messages.any.required,
    'string.base': messages.string.base,
  }),
  password: Joi.string().trim().required().min(6).messages({
    'any.required': messages.any.required,
    'string.base': messages.string.base,
  })
});

const changePass = Joi.object({
  email: Joi.string().trim().required().min(6).messages({
    'any.required': messages.any.required,
    'string.base': messages.string.base,
  }),
  token: Joi.string().required(),
  password: Joi.string().required().min(6).max(20),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({'any.only': 'confirmPassword must be same with password'})
});

const forgetPass = Joi.object({
  email: Joi.string().trim().required().min(6).messages({
    'any.required': messages.any.required,
    'string.base': messages.string.base,
  }),
  role: Joi.boolean().default('student').allow('student','admin'),
});

module.exports = {
  login,
  forgetPass,
  changePass,
  injectAdmin,
  insertData
};
