const AWS = require('aws-sdk');
const sinon = require('sinon');
const assert = require('assert');
const configs = require('../../../../../bin/infra/configs/global_config');
const SQS = require('../../../../../bin/helpers/components/aws-sqs/sqs');
const logger = require('../../../../../bin/helpers/utils/logger');

describe('AWS SQS', () => {

  const config = {
    QueueUrl: 'http://localhost',
    ReceiptHandle: true
  };
  let sinonSandbox;

  beforeEach((done) => {
    sinonSandbox = sinon.createSandbox();
    sinonSandbox.stub(AWS, 'config')
      .returns({
        update: sinon.stub()
      });
    sinon.stub(logger, 'log');
    done();
  });

  afterEach((done) => {
    sinonSandbox.restore();
    logger.log.restore();
    done();
  });

  describe('receiveQueue', () => {
    it('should return success', (done) => {
      sinon.stub(configs, 'get').returns({
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        }
      });
      sinonSandbox.stub(AWS, 'SQS')
        .returns({
          receiveMessage: sinon.stub().yields(null, {
            Messages: [
              {
                ReceiptHandle: true,
                Body: '{ "Message": "ok" }'
              }
            ]
          })
        });
      const sqs = new SQS(config);
      sqs.init();
      sqs.receiveQueue((err, message, receipt) => {
        assert.equal(err, null);
        assert.equal(message, 'ok');
        assert.equal(receipt, true);
        done();
      });
      configs.get.restore();
    });
    it('should return error', (done) => {
      sinon.stub(configs, 'get').returns({
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        }
      });
      sinonSandbox.stub(AWS, 'SQS')
        .returns({
          receiveMessage: sinon.stub().yields('error', null)
        });
      const sqs = new SQS(config);
      sqs.init();
      sqs.receiveQueue((err, message, receipt) => {
        assert.equal(err, 'error');
        assert.equal(message, null);
        assert.equal(receipt, null);
        done();
      });
      configs.get.restore();
    });
    it('should return success', (done) => {
      sinon.stub(configs, 'get').returns({
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        }
      });
      sinonSandbox.stub(AWS, 'SQS')
        .returns({
          receiveMessage: sinon.stub().yields(null, {})
        });
      const sqs = new SQS(config);
      sqs.init();
      sqs.receiveQueue((err, message, receipt) => {
        assert.equal(err, null);
        assert.equal(message, '');
        assert.equal(receipt, null);
        done();
      });
      configs.get.restore();
    });
  });

  describe('removeQueue', () => {
    it('should return success', (done) => {
      sinon.stub(configs, 'get').returns({
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        }
      });
      sinonSandbox.stub(AWS, 'SQS')
        .returns({
          deleteMessage: sinon.stub().yields(null)
        });
      const sqs = new SQS(config);
      sqs.init();
      sqs.removeQueue(config.ReceiptHandle);
      done();
      configs.get.restore();
    });
    it('should return error', (done) => {
      sinon.stub(configs, 'get').returns({
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        }
      });
      sinonSandbox.stub(AWS, 'SQS')
        .returns({
          deleteMessage: sinon.stub().yields('error')
        });
      const sqs = new SQS(config);
      sqs.init();
      sqs.removeQueue(config.ReceiptHandle);
      done();
      configs.get.restore();
    });
  });
});
