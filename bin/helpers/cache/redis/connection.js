const Redis = require('redis');
const logger = require('../../utils/logger');


const createClient = (config) => {
  if (config.host) {
    const client = Redis.createClient({
      ...config
    });

    client.on('error', (err) => {
      logger.log('connection-createClient', err, 'redis-error');
    });

    return client;
  }

  logger.log('connection-createClient', 'Redis Configuration Error', 'redis-error');
  return null;
};

module.exports = {
  createClient
};


