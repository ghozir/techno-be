class Query {

  constructor(redis) {
    /**
     * @typedef {import('../../../../helpers/cache/redis/common')} Redis
     * @type {Redis}
     */
    this.redis = redis;
  }

  async getCached(key) {
    const cachedData = await this.redis.get(key);
    return cachedData;
  }
}

module.exports = Query;
