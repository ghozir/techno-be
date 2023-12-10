const sinon = require('sinon');
const assert = require('assert');

const Mongo = require('../../../../../bin/helpers/databases/mongodb/db');
const mongoConnection = require('../../../../../bin/helpers/databases/mongodb/connection');
const logger = require('../../../../../bin/helpers/utils/logger');

describe('Mongodb', () => {
  let stubMongoConn, stubGetDatabase, stubDb;
  beforeEach(async () => {
    stubGetDatabase = sinon.stub(Mongo.prototype, 'getDatabase');
    stubGetDatabase.resolves('test');
    stubMongoConn = sinon.stub(mongoConnection, 'getConnection');
    stubMongoConn.resolves({
      err: null,
      data: {
        db: {
          db: () => {
            return 'test';
          }
        }
      }
    });
    let tmp = await mongoConnection.getConnection();
    stubDb = sinon.stub(tmp.data.db, 'db');
    sinon.stub(logger, 'log');
  });
  afterEach(() => {
    stubMongoConn.restore();
    stubGetDatabase.restore();
    logger.log.restore();
  });

  describe('class', () => {
    it('should cover class', () => {
      Mongo.prototype.getDatabase.restore();
      const mongo = new Mongo('mongodb://localhost:27017/test');
      mongo.setCollection('tes');
      mongo.getDatabase();
    });
  });

  describe('findOne', () => {
    it('should return wrapper error when get connection error', async () => {
      stubMongoConn.resolves({
        err: {
          message: 'error'
        }
      });
      const res = await Mongo.prototype.findOne({});
      assert.strictEqual(res.err.message, 'error');
    });
    it('should return wrapper error when db function is error', async () => {
      stubMongoConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      const res = await Mongo.prototype.findOne({});
      assert.notStrictEqual(res.err, null);
    });
    it('should return empty wrapper data when findOne success with no data found', async () => {
      stubDb.returns({
        collection : () => {
          return {
            findOne: sinon.stub().callsFake(() => {
              return Promise.resolve({});
            })
          };
        }
      });
      const res = await Mongo.prototype.findOne({});
      assert.strictEqual(res.data, null);
      stubDb.restore();
    });
    it('should return wrapper data when findOne success', async () => {
      stubDb.returns({
        collection : () => {
          return {
            findOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ 'ok': true });
            })
          };
        }
      });
      const res = await Mongo.prototype.findOne({});
      assert.strictEqual(res.data.ok, true);
      stubDb.restore();
    });
  });

  describe('findMany', () => {
    it('should return wrapper error when get connection error', async () => {
      stubMongoConn.resolves({
        err: {
          message: 'error'
        }
      });
      const res = await Mongo.prototype.findMany({});
      assert.strictEqual(res.err.message, 'error');
    });
    it('should return wrapper error when db function is error', async () => {
      stubMongoConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      const res = await Mongo.prototype.findMany({});
      assert.notStrictEqual(res.err, null);
    });
    it('should return empty wrapper data when findMany success with no data found', async () => {
      stubDb.returns({
        collection : () => {
          return {
            find: sinon.stub().callsFake(() => {
              return {
                sort: sinon.stub().callsFake(() => {
                  return {
                    toArray: () => {
                      return Promise.resolve([]);
                    }
                  };
                })
              };
            })
          };
        }
      });
      const res = await Mongo.prototype.findMany({});
      assert.deepStrictEqual(res.data, []);
      stubDb.restore();
    });
    it('should return wrapper data when findMany success', async () => {
      stubDb.returns({
        collection : () => {
          return {
            find: sinon.stub().callsFake(() => {
              return {
                sort: sinon.stub().callsFake(() => {
                  return {
                    toArray: () => {
                      return Promise.resolve([{ 'ok': true }, { 'ok': false }]);
                    }
                  };
                })
              };
            })
          };
        }
      });
      const res = await Mongo.prototype.findMany({});
      assert.strictEqual(res.data[0].ok, true);
      stubDb.restore();
    });
  });

  describe('findPaginated', () => {
    it('should return wrapper error when get connection error', async () => {
      stubMongoConn.resolves({
        err: {
          message: 'error'
        }
      });
      const res = await Mongo.prototype.findPaginated({});
      assert.strictEqual(res.err.message, 'error');
    });
    it('should return wrapper error when db function is error', async () => {
      stubMongoConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      const res = await Mongo.prototype.findPaginated({});
      assert.notStrictEqual(res.err, null);
    });
    it('should return wrapper data when findPaginated success with no data found', async () => {
      sinon.stub(Mongo.prototype, 'countAll').resolves({
        data: 0
      });
      class MockCursor {
        skip() {
          return new MockCursor();
        }
        limit() {
          return new MockCursor();
        }
        sort() {
          return new MockCursor();
        }
        toArray() {
          return Promise.resolve([]);
        }
      }
      stubDb.returns({
        collection : () => {
          return {
            find: sinon.stub().callsFake(() => {
              return new MockCursor();
            })
          };
        }
      });
      const res = await Mongo.prototype.findPaginated({});
      assert.deepStrictEqual(res.data, []);
      assert.deepStrictEqual(res.meta, { totalData: 0, totalPage: 1 });
      stubDb.restore();
      Mongo.prototype.countAll.restore();
    });
    it('should return wrapper data when findPaginated success', async () => {
      sinon.stub(Mongo.prototype, 'countAll').resolves({
        data: 2
      });
      class MockCursor {
        skip() {
          return new MockCursor();
        }
        limit() {
          return new MockCursor();
        }
        sort() {
          return new MockCursor();
        }
        toArray() {
          return Promise.resolve([{ 'ok': true }, { 'ok': false }]);
        }
      }
      stubDb.returns({
        collection : () => {
          return {
            find: sinon.stub().callsFake(() => {
              return new MockCursor();
            })
          };
        }
      });
      const res = await Mongo.prototype.findPaginated({}, 1, 1);
      assert.deepStrictEqual(res.data[0], { 'ok': true });
      assert.deepStrictEqual(res.meta, { totalData: 2, totalPage: 2 });
      stubDb.restore();
      Mongo.prototype.countAll.restore();
    });
  });

  describe('insertOne', () => {
    it('should return wrapper error when get connection error', async () => {
      stubMongoConn.resolves({
        err: {
          message: 'error'
        }
      });
      const res = await Mongo.prototype.insertOne({});
      assert.strictEqual(res.err.message, 'error');
    });
    it('should return wrapper error when db function is error', async () => {
      stubMongoConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      const res = await Mongo.prototype.insertOne({});
      assert.notStrictEqual(res.err, null);
    });
    it('should return wrapper data when insertOne not success', async () => {
      stubDb.returns({
        collection : () => {
          return {
            insertOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ insertedCount: 0 });
            })
          };
        }
      });
      const res = await Mongo.prototype.insertOne({});
      assert.strictEqual(res.err, 'Failed Inserting Data to Database');
      stubDb.restore();
    });
    it('should return wrapper data when insertOne success', async () => {
      stubDb.returns({
        collection : () => {
          return {
            insertOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ insertedCount: 1 });
            })
          };
        }
      });
      const res = await Mongo.prototype.insertOne({});
      assert.notStrictEqual(res.data, null);
      stubDb.restore();
    });
  });

  describe('insertMany', () => {
    it('should return wrapper error when get connection error', async () => {
      stubMongoConn.resolves({
        err: {
          message: 'error'
        }
      });
      const res = await Mongo.prototype.insertMany({});
      assert.strictEqual(res.err.message, 'error');
    });
    it('should return wrapper error when db function is error', async () => {
      stubMongoConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      const res = await Mongo.prototype.insertMany({});
      assert.notStrictEqual(res.err, null);
    });
    it('should return wrapper data when insertMany not success', async () => {
      stubDb.returns({
        collection : () => {
          return {
            insertMany: sinon.stub().callsFake(() => {
              return Promise.resolve({ insertedCount: 0 });
            })
          };
        }
      });
      const res = await Mongo.prototype.insertMany({});
      assert.strictEqual(res.err, 'Failed Inserting Data to Database');
      stubDb.restore();
    });
    it('should return wrapper data when insertMany success', async () => {
      stubDb.returns({
        collection : () => {
          return {
            insertMany: sinon.stub().callsFake(() => {
              return Promise.resolve({ insertedCount: 1 });
            })
          };
        }
      });
      const res = await Mongo.prototype.insertMany({});
      assert.notStrictEqual(res.data, null);
      stubDb.restore();
    });
  });

  describe('updateOne', () => {
    it('should return wrapper error when get connection error', async () => {
      stubMongoConn.resolves({
        err: {
          message: 'error'
        }
      });
      const res = await Mongo.prototype.updateOne({});
      assert.strictEqual(res.err.message, 'error');
    });
    it('should return wrapper error when db function is error', async () => {
      stubMongoConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      const res = await Mongo.prototype.updateOne({});
      assert.notStrictEqual(res.err, null);
    });
    it('should return wrapper data when update failed', async () => {
      stubDb.returns({
        collection : () => {
          return {
            updateOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ modifiedCount: -1 });
            })
          };
        }
      });
      const res = await Mongo.prototype.updateOne({data: 'data'});
      assert.strictEqual(res.err, 'Failed updating data');
      stubDb.restore();
    });
    it('should return wrapper data when updateOne success', async () => {
      sinon.stub(Mongo.prototype, 'findOne').resolves({
        data: 'data'
      });
      stubDb.returns({
        collection : () => {
          return {
            updateOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ modifiedCount: 1 });
            })
          };
        }
      });
      const res = await Mongo.prototype.updateOne({ data: 'data' });
      assert.deepStrictEqual(res.data, 'data');
      stubDb.restore();
      Mongo.prototype.findOne.restore();
    });
  });

  describe('upsertOne', () => {
    it('should return wrapper error when get connection error', async () => {
      stubMongoConn.resolves({
        err: {
          message: 'error'
        }
      });
      const res = await Mongo.prototype.upsertOne({});
      assert.strictEqual(res.err.message, 'error');
    });
    it('should return wrapper error when db function is error', async () => {
      stubMongoConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      const res = await Mongo.prototype.upsertOne({});
      assert.notStrictEqual(res.err, null);
    });
    it('should return wrapper data when upsert failed', async () => {
      stubDb.returns({
        collection : () => {
          return {
            updateOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ upsertedCount: -1 });
            })
          };
        }
      });
      const res = await Mongo.prototype.upsertOne({data: 'data'});
      assert.strictEqual(res.err, 'Failed upserting data');
      stubDb.restore();
    });
    it('should return wrapper data when upsertOne success', async () => {
      sinon.stub(Mongo.prototype, 'findOne').resolves({
        data: 'data'
      });
      stubDb.returns({
        collection : () => {
          return {
            updateOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ upsertedCount: 1 });
            })
          };
        }
      });
      const res = await Mongo.prototype.upsertOne({ data: 'data' });
      assert.deepStrictEqual(res.data, 'data');
      stubDb.restore();
      Mongo.prototype.findOne.restore();
    });
  });

  describe('deleteOne', () => {
    it('should return wrapper error when get connection error', async () => {
      stubMongoConn.resolves({
        err: {
          message: 'error'
        }
      });
      const res = await Mongo.prototype.deleteOne({});
      assert.strictEqual(res.err.message, 'error');
    });
    it('should return wrapper error when db function is error', async () => {
      stubMongoConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      const res = await Mongo.prototype.deleteOne({});
      assert.notStrictEqual(res.err, null);
    });
    it('should return wrapper data when delete failed', async () => {
      stubDb.returns({
        collection: () => {
          return {
            deleteOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ deletedCount: -1 });
            })
          };
        }
      });
      const res = await Mongo.prototype.deleteOne({ data: 'data' });
      assert.strictEqual(res.err, 'Failed deleting data');
      stubDb.restore();
    });
    it('should return wrapper data when deleteOne success', async () => {
      stubDb.returns({
        collection: () => {
          return {
            deleteOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ deletedCount: 1 });
            })
          };
        }
      });
      const res = await Mongo.prototype.deleteOne({ data: 'data' });
      assert.strictEqual(res.data, true);
      stubDb.restore();
    });
  });

  describe('countAll', () => {
    it('should return wrapper error when get connection error', async () => {
      stubMongoConn.resolves({
        err: {
          message: 'error'
        }
      });
      const res = await Mongo.prototype.countAll({});
      assert.strictEqual(res.err.message, 'error');
    });
    it('should return wrapper error when db function is error', async () => {
      stubMongoConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      const res = await Mongo.prototype.countAll({});
      assert.notStrictEqual(res.err, null);
    });
    it('should return wrapper data when countAll success with no data found', async () => {
      stubDb.returns({
        collection : () => {
          return {
            countDocuments: sinon.stub().callsFake(() => {
              return Promise.resolve(0);
            })
          };
        }
      });
      const res = await Mongo.prototype.countAll({});
      assert.strictEqual(res.data, 0);
      stubDb.restore();
    });
    it('should return wrapper data when countAll success', async () => {
      stubDb.returns({
        collection : () => {
          return {
            countDocuments: sinon.stub().callsFake(() => {
              return Promise.resolve({ data : 'data'});
            })
          };
        }
      });
      const res = await Mongo.prototype.countAll({});
      assert.strictEqual(res.data.data, 'data');
      stubDb.restore();
    });
  });

});
