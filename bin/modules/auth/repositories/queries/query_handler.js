
const Auth = require('./domain');
const Redis = require('../../../../helpers/cache/redis/common');
const config = require('../../../../infra/configs/global_config');
const redis = new Redis(config.get('/redisConfig'));
const auth = new Auth(redis);

const getCached = async (cacheKey) => {
  const getData = async () => await auth.getCached(cacheKey);
  return await getData();
};

module.exports = {
  getCached
};
