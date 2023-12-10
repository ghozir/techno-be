const { expect } = require('chai');
const mongo = require('mongodb').MongoClient;
const sinon = require('sinon');

const mongoConnection = require('../../../../../bin/helpers/databases/mongodb/connection');
const logger = require('../../../../../bin/helpers/utils/logger');

describe('Mongo Connection', () => {
  let stubMongoConnect;
  const mongoDbUrl = 'mongodb://localhost:27017/domain';

  beforeEach(() => {
    stubMongoConnect = sinon.stub(mongo, 'connect');
    stubMongoConnect.resolves({
      isConnected: sinon.stub().returns(true)
    });
    sinon.stub(logger, 'log');
  });

  afterEach(() => {
    stubMongoConnect.restore();
    logger.log.restore();
  });

  it('should cover branch condition isConnected', async() => {
    stubMongoConnect.rejects({
      message: 'test fail connect'
    });
    await mongoConnection.getConnection(mongoDbUrl);
  });

  it('should cover branch create mongo connection failed', () => {
    stubMongoConnect.rejects({
      message: 'test fail connect'
    });
    mongoConnection.init(mongoDbUrl);
  });

  it('should create connection', () => {
    mongoConnection.init(mongoDbUrl);
  });

  it('should cover branch unavailable connection config', () => {
    mongoConnection.getConnection('mongodb://localhost:27019/notfounddb');
  });

  it('should get connection if exist', async () => {
    expect(await mongoConnection.getConnection(mongoDbUrl))
      .to.be.an('object')
      .to.haveOwnProperty('data');
    const result = await mongoConnection.getConnection(mongoDbUrl);
    expect(result.data).to.has.all.keys(['index','db','config']);
    expect(result.data.db).to.be.not.empty;
    expect(result.data.config).to.equals(mongoDbUrl);
  });

  it('should create connection if not exist', async () => {
    expect(await mongoConnection.getConnection(mongoDbUrl))
      .to.be.an('object')
      .to.haveOwnProperty('data');
    const result = await mongoConnection.getConnection(mongoDbUrl);
    expect(result.data).to.has.all.keys(['index','db','config']);
    expect(result.data.db).to.be.not.empty;
    expect(result.data.config).to.equals(mongoDbUrl);
  });
});
