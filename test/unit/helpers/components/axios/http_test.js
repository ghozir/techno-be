const sinon = require('sinon');
const assert = require('assert');
const axios = require('axios');

const Http = require('../../../../../bin/helpers/components/axios/http');

describe('Axios HTTP', () => {
  let axiosStub;

  beforeEach(async () => {
    axiosStub = sinon.stub(axios, 'create');
  });

  afterEach(() => {
    axiosStub.restore();
  });

  describe('constructor', () => {
    it('should cover class constructor', () => {
      new Http();
    });
  });

  describe('baseUrl setter', () => {
    it('should set property correctly', () => {
      axiosStub.returns({
        defaults: {
          baseURL: null
        },
      });
      const http = new Http();
      http.baseUrl = 'http://example.com';

      assert.strictEqual(http.axios.defaults.baseURL, 'http://example.com');
    });
  });

  describe('basicAuth setter', () => {
    it('should set property correctly', () => {
      axiosStub.returns({
        defaults: {
          auth: null
        },
      });
      const http = new Http();
      http.basicAuth = { username: 'foo', password: 'lorem' };

      assert.deepStrictEqual(http.axios.defaults.auth, { username: 'foo', password: 'lorem' });
    });
  });

  describe('get', () => {
    afterEach(() => {
      axiosStub.restore();
    });

    it('should cover positive case', async () => {
      axiosStub.returns({
        get: sinon.stub().resolves({
          data: { foo: 42 },
          err: null
        }),
      });
      const http = new Http();
      const result = await http.get('/foo');

      assert.strictEqual(result.err, null);
      assert.deepStrictEqual(result.data, { foo: 42 });
    });

    it('should cover negative case', async () => {
      axiosStub.returns({
        get: sinon.stub().rejects(new Error('dummy error')),
      });
      const http = new Http();
      const result = await http.get('/foo');

      assert.strictEqual(result.data, result.data);
      assert.strictEqual(result.err.message, 'dummy error');
    });
  });

  describe('post', () => {
    afterEach(() => {
      axiosStub.restore();
    });

    it('should cover positive case', async () => {
      axiosStub.returns({
        post: sinon.stub().resolves({
          data: { foo: 42 },
          err: null
        }),
      });
      const http = new Http();
      const result = await http.post('/foo');

      assert.strictEqual(result.err, null);
      assert.deepStrictEqual(result.data, { foo: 42 });
    });

    it('should cover negative case', async () => {
      axiosStub.returns({
        post: sinon.stub().rejects(new Error('dummy error')),
      });
      const http = new Http();
      const result = await http.post('/foo');

      assert.strictEqual(result.data, result.data);
      assert.strictEqual(result.err.message, 'dummy error');
    });
  });

  describe('formatError', () => {
    it('should cover default branch', async () => {
      const http = new Http();
      const result = http.formatError(new Error('dummy error'));

      assert.deepStrictEqual(result, { responseError: false, message: 'dummy error' });
    });

    it('should cover response error branch', async () => {
      const http = new Http();
      const error = new Error('another dummy error');
      error.request = {
        method: 'GET',
        protocol: 'http:',
        host: 'localhost',
        path: '/some-path?query=foobar',
        _header: 'POST /some-path?query=foobar',
      };
      error.response = {
        config: 'foo',
        request: 'bar',
        headers: 'quux',
        data: { lorem: 67 },
      };
      const result = http.formatError(error);

      assert.deepStrictEqual(result, {
        responseError: true,
        message: 'another dummy error',
        request: {
          host: 'localhost',
          method: 'GET',
          path: '/some-path?query=foobar',
          protocol: 'http:',
          rawHeader: 'POST /some-path?query=foobar',
        },
        response: { data: { lorem: 67 }}
      });
    });
  });
});
