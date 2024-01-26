
// const ObjectId = require('mongodb').ObjectId;

class Query {

  constructor(redis, db) {
    /**
       * @typedef {import('../../../../helpers/databases/mongodb/db')} DB
       * @type {DB}
       */
    this.db = db;

    /**
   * @typedef {import('../../../../helpers/cache/redis/common')} Redis
   * @type {Redis}
   */
    this.redis = redis;

  }

  async findData(parameter) {
    this.db.setCollection('degreeHistory');
    const recordset = await this.db.findMany(parameter, {createdAt:-1});
    return recordset;
  }

  async getCached(key) {
    const cachedData = this.redis.get(key);
    return cachedData;
  }
  async getKeys(key) {
    const keys = this.redis.getKey(key);
    return keys;
  }
  async getTTL(key) {
    const ttl = this.redis.ttl(key);
    return ttl;
  }
  async findOneAdmin(parameter) {
    this.db.setCollection('users');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

}

module.exports = Query;

