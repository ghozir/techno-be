class Command {

  constructor(redis, db, service) {
    // /**
    //  * @typedef {import('../../../../helpers/components/axios/http')} Http
    //  * @type {Http}
    //  */
    // this.http = http;
    /**
     * @typedef {import('../../../../helpers/cache/redis/common')} Redis
     * @type {Redis}
     */
    this.redis = redis;
    /**
     * @typedef {import('../../../../helpers/databases/mongodb/db')} MongoDB
     * @type {MongoDB}
     */
    this.db = db;

    this.emailService = service;
  }

  async setCache(key, value, expires = 3600) {
    const setCache = this.redis.setex(key, value, expires);
    return setCache;
  }

  async unsetCache(key) {
    const unsetCache = this.redis.del(key);
    return unsetCache;
  }

  async updatePass(id, params){
    this.db.setCollection('teachers');
    const res = await this.db.updateOne(id, params);
    return res;
  }

  async insertOneAdmin(document) {
    this.db.setCollection('users');
    const result = await this.db.insertOne(document);
    return result;
  }

  async sendEmail(document){
    const res = await this.emailService.sendEmail(document);
    return res;
  }

}

module.exports = Command;
