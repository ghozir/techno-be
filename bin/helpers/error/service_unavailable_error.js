class ServiceUnavailableError {
  constructor(param = 'Service Unavailable') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code || 503;
  }
}

module.exports = ServiceUnavailableError;
