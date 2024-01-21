
// const ObjectId = require('mongodb').ObjectId;

class Query {

  constructor(db) {
    /**
       * @typedef {import('../../../../helpers/databases/mongodb/db')} DB
       * @type {DB}
       */
    this.db = db;
  }

  async findData(parameter) {
    this.db.setCollection('degreeHistory');
    const recordset = await this.db.findMany(parameter, {screatedAt:-1});
    return recordset;
  }

}

module.exports = Query;

