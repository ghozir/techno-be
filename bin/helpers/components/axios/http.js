const axios = require('axios');
const wrapper = require('../../utils/wrapper');

class Http {
  constructor(options = {}) {
    this.axios = axios.create({
      timeout: 10000,
      ...options
    });
  }

  set baseUrl(url) {
    this.axios.defaults.baseURL = url;
  }

  set basicAuth(auth) {
    this.axios.defaults.auth = auth;
  }

  async get(url, params = {}, headers = {}) {
    return await this.axios.get(url, { params, headers })
      .then(({ data }) => Promise.resolve(wrapper.data(data)))
      .catch((err) => Promise.resolve(wrapper.error(this.formatError(err))));
  }

  async post(url, payload = {}, headers = {}) {
    return await this.axios.post(url, payload, { headers })
      .then(({ data }) => Promise.resolve(wrapper.data(data)))
      .catch((err) => Promise.resolve(wrapper.error(this.formatError(err))));
  }

  formatError(err) {
    if (err.response) {
      const req = {
        method: err.request.method,
        protocol: err.request.protocol,
        host: err.request.host,
        path: err.request.path,
        rawHeader: err.request._header,
      };
      delete err.response.config;
      delete err.response.request;
      delete err.response.headers;

      return { responseError: true, message: err.message, request: req, response: { ...err.response }};
    }

    return { responseError: false, message: err.message };
  }
}

module.exports = Http;
