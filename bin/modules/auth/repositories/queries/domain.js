
const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');

class Auth {

  constructor(redis){
    this.query = new Query(redis);
  }

  async getCached(cacheKey) {
    const result = await this.query.getCached(cacheKey);
    if (result.err) {
      logger.error(this.ctx, 'Failed to get user', 'getCached::query.getCached', result.err);
      return wrapper.error(result.err);
    }
    return wrapper.data(result.data);
  }

}

module.exports = Auth;
