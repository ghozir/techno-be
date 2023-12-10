const { createClient } = require('./connection');
const { NotFoundError, InternalServerError } = require('../../error/index');
const wrapper = require('../../../helpers/utils/wrapper');
const logger = require('../../../helpers/utils/logger');

const stringify = (args) => {
  if (typeof (args) === 'object') {
    return JSON.stringify(args);
  }
  return args;
};

const serializer = (args) => {
  try {
    const obj = JSON.parse(args);
    return obj;
  } catch (err) {
    return args;
  }
};


class Redis {
  constructor(config) {
    this.client = createClient(config);
    this.ctx = this.constructor.name;
  }

  async select(index = 0) {
    return new Promise((resolve) => {
      this.client.select(index, (err, reply) => {
        if (err) {
          logger.log(this.ctx, err.message, 'select()');
        }
        resolve();
      });
    });
  }

  async get(key) {
    const result = new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
    return Promise.resolve(result)
      .then(res => {
        if (!res) {
          return wrapper.error(new NotFoundError('Key is not exist'));
        }
        return wrapper.data(serializer(res));
      })
      .catch(err => {
        logger.log(this.ctx, err.message, 'get()');
        return wrapper.error(new InternalServerError(err.message));
      });
  }

  async set(key, value) {
    const result = new Promise((resolve, reject) => {
      this.client.set(key, stringify(value), (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
    return Promise.resolve(result)
      .then(res => wrapper.data(res))
      .catch(err => {
        logger.log(this.ctx, err.message, 'set()');
        return wrapper.error(new InternalServerError(err.message));
      });
  }

  async setex(key, value, exipireAt = 10) {
    const result = new Promise((resolve, reject) => {
      this.client.setex(key, exipireAt, stringify(value), (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
    return Promise.resolve(result)
      .then(res => wrapper.data(res))
      .catch(err => {
        logger.log(this.ctx, err.message, 'setex()');
        return wrapper.error(new InternalServerError(err.message));
      });
  }

  async ttl(key) {
    const result = new Promise((resolve, reject) => {
      this.client.ttl(key, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
    return Promise.resolve(result)
      .then(res => wrapper.data(res))
      .catch(err => {
        logger.log(this.ctx, err.message, 'ttl()');
        return wrapper.error(new InternalServerError(err.message));
      });
  }

  async del(key) {
    const result = new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
    return Promise.resolve(result)
      .then(res => wrapper.data(res))
      .catch(err => {
        logger.log(this.ctx, err.message, 'del()');
        return wrapper.error(new InternalServerError(err.message));
      });
  }
}

module.exports = Redis;
