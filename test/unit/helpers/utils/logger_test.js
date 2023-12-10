const sinon = require('sinon');
const winston = require('winston');

const logger = require('../../../../bin/helpers/utils/logger');

describe('Logger', () => {

  beforeEach(() => {
    sinon.stub(winston, 'Logger').resolves(
      {
        info: sinon.stub()
      }
    );
  });

  afterEach(() => {
    winston.Logger.restore();
  });

  describe('log', () => {
    it('should send log', () => {
      logger.log('', { err: 'test'}, '');
    });
    it('should send info log', () => {
      logger.info('', { err: 'test'}, '', '');
    });
    it('should send error log', () => {
      logger.error('', { err: 'test'}, '', '');
    });
  });
});
