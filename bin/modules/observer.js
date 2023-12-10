const logger = require('../helpers/utils/logger');
const assesmentEventHandler = require('./assesment/handlers/event_handler');

const init = () => {
  logger.info('info', 'Observer is running', 'myEmmiter.init', 'Kafka');
  assesmentEventHandler.generateResultAssesment();
};

module.exports = {
  init
};
