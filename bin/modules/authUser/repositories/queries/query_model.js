const Joi = require('joi');

const getData = Joi.object({
  startDate: Joi.date().optional().default(null),
  endDate: Joi.date().optional().default(null)
});


module.exports = {
  getData
};
