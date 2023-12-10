
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
    this.db.setCollection('user');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findManyTeacher(parameter, sortByfield) {
    if (parameter.search) {
      parameter.$or = [];
      parameter.$or[0] = { name: { $regex: new RegExp(parameter.search, 'i') } };
      delete parameter.search;
    }
    this.dbTeacher.setCollection('teachers');
    const recordset = await this.dbTeacher.findMany(parameter, sortByfield);
    return recordset;
  }

  async findManyCourse(parameter) {
    this.db.setCollection('course');
    const recordset = await this.db.findMany(parameter);
    return recordset;
  }

  async findPaginatedTeacher(meta, params, sortByfield = 'name') {

    if (params.search) {
      params.$or = [];
      params.$or[0] = { name: { $regex: new RegExp(params.search, 'i') } };
      delete params.search;
    }

    this.dbTeacher.setCollection('teachers');
    const recordset = await this.dbTeacher.findPaginated(sortByfield, meta.size, meta.page, params);
    return recordset;
  }

  async findOtp(parameter) {
    this.dbTeacher.setCollection('teacherOtp');
    return await this.dbTeacher.findMany(parameter, 'timeStamps', false);
  }

  async findStudentAggregate(params = {}){
    this.dbStudent.setCollection('student');
    const recordset = await this.dbStudent.aggregate(params);
    return recordset;
  }

  async findOneStudent(parameter) {
    this.dbTeacher.setCollection('student');
    const recordset = await this.dbTeacher.findOne(parameter);
    return recordset;
  }

  async findOtpNumber(parameter){
    this.otpdb.setCollection('verified_numbers');
    const recordset = await this.otpdb.findOne(parameter);
    return recordset;
  }

}

module.exports = Query;

