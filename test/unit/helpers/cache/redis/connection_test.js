const { PassThrough } = require('stream');
const Redis = require('redis');
const sinon = require('sinon');

const redisConnection = require('../../../../../bin/helpers/cache/redis/connection');

describe('Redis Connection', () => {
  let stubRedisConnect;
  const redisConfig = {
    host: 'localhost',
    port: 6379,
    db: 0,
  };
  const mockedEvent = new PassThrough();

  beforeEach(() => {
    stubRedisConnect = sinon.stub(Redis, 'createClient');
    stubRedisConnect.returns({
      on: sinon.stub().returns(mockedEvent)
        .onSecondCall().throws(new Error())
    });
  });

  afterEach(() => {
    stubRedisConnect.restore();
  });

  it('should cover branch undefined client.host', () => {
    redisConnection.createClient({});
  });

  it('should cover branch defined client.host', () => {
    redisConnection.createClient(redisConfig);
  });

  it('should cover branch error connection', () => {
    redisConnection.createClient(redisConfig);
  });
});
