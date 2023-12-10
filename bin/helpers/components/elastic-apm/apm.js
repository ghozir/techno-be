const apm = require('elastic-apm-node');
const { isEmpty } = require('lodash');
const config = require('../../../infra/configs/global_config');

const init = () => {
  if (!isEmpty(config.get('/apm/url'))) {
    apm.start({
      serviceName: config.get('/apm/appName'),
      serverUrl: config.get('/apm/url'),
      transactionSampleRate: config.get('/apm/transaction')
    });
  }
};

module.exports = {
  init
};
