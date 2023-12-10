const sinon = require('sinon');
const assert = require('assert');
const Redis = require('redis');

const redis = require('../../../../../bin/helpers/cache/redis/common');
const redisConnection = require('../../../../../bin/helpers/cache/redis/connection');
const logger = require('../../../../../bin/helpers/utils/logger');

describe('Redis', () => {
  let stubGetDatabase;
  const redisConfig = {
    host: 'localhost',
    port: 6379,
    db: 0,
  };

  beforeEach(async () => {
    stubGetDatabase = sinon.stub(Redis, 'createClient');
    stubGetDatabase.returns({
      on: sinon.stub()
    });
    redisConnection.createClient(redisConfig);
    sinon.stub(logger, 'log');
  });
  afterEach(() => {
    stubGetDatabase.restore();
    logger.log.restore();
  });

  describe('class', () => {
    it('should cover class', () => {
      new redis(redisConfig);
    });
  });

  describe('select', () => {
    it('should cover when select failed', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        select: (_, cb) => cb(new Error()),
      });
      const common = new redis(redisConfig);
      await common.select(0);
      stubGetDatabase.restore();
    });

    it('should return undefined when select called', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        select: (_, cb) => cb(null),
      });
      const common = new redis(redisConfig);
      const res = await common.select(0);
      assert.strictEqual(res, undefined);
      stubGetDatabase.restore();
    });

    it('should return undefined when select called without index', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        select: (_, cb) => cb(null),
      });
      const common = new redis(redisConfig);
      const res = await common.select();
      assert.strictEqual(res, undefined);
      stubGetDatabase.restore();
    });
  });

  describe('get', () => {
    it('should return wrapper error when get failed', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        get: (key, cb) => cb(new Error()),
      });
      const common = new redis(redisConfig);
      const res = await common.get('foo');
      assert.notStrictEqual(res.err, null);
    });

    it('should return wrapper error when get returns null', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        get: (key, cb) => cb(null),
      });
      const common = new redis(redisConfig);
      const res = await common.get('foo');
      assert.notStrictEqual(res.err, null);
    });

    it('should return wrapper data when get called', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        get: (key, cb) => cb(null, key),
      });
      const common = new redis(redisConfig);
      const res = await common.get('foo');
      assert.strictEqual(res.data, 'foo');
    });

    it('should return serialized wrapper data when get called and returns stringified object', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        get: (key, cb) => cb(null, '{"bar":42}'),
      });
      const common = new redis(redisConfig);
      const res = await common.get('foo');
      assert.strictEqual(res.data.bar, 42);
    });
  });

  describe('set', () => {
    it('should return wrapper error when set failed', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        set: (key, value, cb) => cb(new Error()),
      });
      const common = new redis(redisConfig);
      const res = await common.set('foo', 'bar');
      assert.notStrictEqual(res.err, null);
    });

    it('should return wrapper data when set called', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        set: (key, value, cb) => cb(null, value),
      });
      const common = new redis(redisConfig);
      const res = await common.set('foo', 'bar');
      assert.strictEqual(res.data, 'bar');
    });

    it('should return stringified wrapper data when set called with object', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        set: (key, value, cb) => cb(null, value),
      });
      const common = new redis(redisConfig);
      const res = await common.set('foo', { bar: 42 });
      assert.strictEqual(res.data, '{"bar":42}');
    });
  });

  describe('setex', () => {
    it('should return wrapper error when setex failed', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        setex: (key, expireAt, value, cb) => cb(new Error()),
      });
      const common = new redis(redisConfig);
      const res = await common.setex('foo', 'bar', 86400);
      assert.notStrictEqual(res.err, null);
    });

    it('should return wrapper data when setex called', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        setex: (key, expireAt, value, cb) => cb(null, value),
      });
      const common = new redis(redisConfig);
      const res = await common.setex('foo', 'bar', 86400);
      assert.strictEqual(res.data, 'bar');
    });

    it('should return wrapper data when setex called without expireAt', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        setex: (key, expireAt, value, cb) => cb(null, value),
      });
      const common = new redis(redisConfig);
      const res = await common.setex('foo', 'bar');
      assert.strictEqual(res.data, 'bar');
    });

    it('should return stringified wrapper data when setex called', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        setex: (key, expireAt, value, cb) => cb(null, value),
      });
      const common = new redis(redisConfig);
      const res = await common.setex('foo', { bar: 42 }, 86400);
      assert.strictEqual(res.data, '{"bar":42}');
    });
  });

  describe('ttl', () => {
    it('should return wrapper error when ttl failed', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        ttl: (key, cb) => cb(new Error()),
      });
      const common = new redis(redisConfig);
      const res = await common.ttl('foo');
      assert.notStrictEqual(res.err, null);
    });

    it('should return wrapper data when ttl called', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        ttl: (key, cb) => cb(null, 86400),
      });
      const common = new redis(redisConfig);
      const res = await common.ttl('foo');
      assert.strictEqual(res.data, 86400);
    });
  });

  describe('del', () => {
    it('should return wrapper error when del failed', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        del: (key, cb) => cb(new Error()),
      });
      const common = new redis(redisConfig);
      const res = await common.del('foo');
      assert.notStrictEqual(res.err, null);
    });

    it('should return wrapper data when del called', async () => {
      stubGetDatabase.returns({
        on: sinon.stub(),
        del: (key, cb) => cb(null, 86400),
      });
      const common = new redis(redisConfig);
      const res = await common.del('foo');
      assert.strictEqual(res.data, 86400);
    });
  });
});
