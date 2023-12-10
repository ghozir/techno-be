const _ = require('lodash');
const { UnprocessableEntityError } = require('../error');
const logger = require('./logger');
const wrapper = require('./wrapper');

const isValidPayload = (payload, schema) => {
  const { value, error } = schema.validate(payload);
  if (!_.isEmpty(error)) {
    logger.error('Util::validator', error.message, 'Joi::schama.validate', error);
    return wrapper.error(new UnprocessableEntityError(error.message));
  }
  return wrapper.data(value);
};

module.exports = {
  isValidPayload
};
