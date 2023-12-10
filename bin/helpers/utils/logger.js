const winston = require('winston');
require('winston-logstash');
const morgan  = require('morgan');
const config = require('../../infra/configs/global_config');
const { isEmpty } = require('lodash');

const transports = [
  new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }),
];

if (!isEmpty(config.get('/logstash/host'))) {
  transports.push(new winston.transports.Logstash(config.get('/logstash')));
}

const logger = new winston.Logger({
  transports,
  exitOnError: false
});

const log = (context, message, scope) => {
  const obj = {
    context,
    scope,
    message: message.toString()
  };
  logger.info(obj);
};

const info = (context, message, scope, meta = undefined) => {
  const obj = {
    context,
    scope,
    message: message,
    meta
  };
  logger.info(obj);
};

const error = (context, message, scope, meta = undefined) => {
  const obj = {
    context,
    scope,
    message: message,
    meta
  };
  logger.error(obj);
};

const init = () => {
  return morgan((tokens, req, res) => {
    const logData = {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      code: tokens.status(req, res),
      contentLength: tokens.res(req, res, 'content-length'),
      responseTime: `${tokens['response-time'](req, res, '0')}`, // in milisecond (ms)
      date: tokens.date(req, res, 'iso'),
      ip: tokens['remote-addr'](req,res)
    };
    const obj = {
      context: 'service-info',
      scope: 'audit-log',
      message: 'Logging service...',
      meta: logData
    };
    logger.info(obj);
    return;
  });
};

module.exports = {
  log,
  init,
  info,
  error
};
