const minio = require('../../../../../bin/helpers/components/minio/minio');
const Minio = require('minio');
const config = require('../../../../../bin/infra/configs/global_config');
const sinon = require('sinon');
const { PassThrough } = require('stream');
const assert = require('assert').strict;

describe('Minio', () => {
  let stubMinio;

  const mockedStream = new PassThrough();

  beforeEach(() => {
    stubMinio = sinon.stub(Minio, 'Client');
    stubMinio.returns({
      bucketExists: sinon.stub()
        .resolves(true)
        .onSecondCall().rejects(new Error())
        .onCall(2).resolves(true)
        .onCall(3).resolves(false)
        .onCall(4).resolves(false),
      makeBucket: sinon.stub()
        .resolves(true)
        .onSecondCall().rejects(new Error()),
      removeBucket: sinon.stub()
        .resolves(true)
        .onSecondCall().rejects(new Error()),
      putObject: sinon.stub()
        .resolves(true)
        .onSecondCall().rejects(new Error()),
      fPutObject: sinon.stub()
        .resolves(true)
        .onSecondCall().rejects(new Error()),
      fGetObject: sinon.stub()
        .resolves(true)
        .onSecondCall().rejects(new Error()),
      removeObject: sinon.stub()
        .resolves(true)
        .onSecondCall().rejects(new Error()),
      presignedGetObject: sinon.stub()
        .resolves('http://localhost/blob')
        .onSecondCall().rejects(new Error()),
      listObjects: sinon.stub()
        .returns(mockedStream)
        .onSecondCall().throws(new Error())
    });
  });
  afterEach(() => {
    stubMinio.restore();
  });
  describe('init', () => {
    it('should be cover success path', () => {
      minio.init();
    });
    it('should be cover error path', () => {
      minio.init();
    });
  });
  describe('isBucketExists', () => {
    it('should be cover success path', () => {
      minio.isBucketExists(config.get('/minio'));
    });
    it('should be cover error path', () => {
      minio.isBucketExists(config.get('/minio'));
    });
  });
  describe('bucketCreate', () => {
    it('should be cover success path with bucket exists', () => {
      minio.bucketCreate(config.get('/minio'));
    });
    it('should be cover success path with bucket not exists', () => {
      minio.bucketCreate(config.get('/minio'));
    });
    it('should be cover error path', () => {
      minio.bucketCreate(config.get('/minio'));
    });
  });
  describe('bucketRemove', () => {
    it('should be cover success path', () => {
      minio.bucketRemove(config.get('/minio'));
    });
    it('should be cover error path', () => {
      minio.bucketRemove(config.get('/minio'));
    });
  });
  describe('bufferObjectUpload', () => {
    it('should be cover success path', () => {
      minio.bufferObjectUpload(config.get('/minio'));
    });
    it('should be cover error path', () => {
      minio.bufferObjectUpload(config.get('/minio'));
    });
  });
  describe('objectUpload', () => {
    it('should be cover success path', () => {
      minio.objectUpload(config.get('/minio'));
    });
    it('should be cover error path', () => {
      minio.objectUpload(config.get('/minio'));
    });
  });
  describe('objectDownload', () => {
    it('should be cover success path', () => {
      minio.objectDownload(config.get('/minio'));
    });
    it('should be cover error path', () => {
      minio.objectDownload(config.get('/minio'));
    });
  });
  describe('objectRemove', () => {
    it('should be cover success path', () => {
      minio.objectRemove(config.get('/minio'));
    });
    it('should be cover error path', () => {
      minio.objectRemove(config.get('/minio'));
    });
  });
  describe('objectGetUrl', () => {
    it('should be cover success path', () => {
      minio.objectGetUrl(config.get('/minio'));
    });
    it('should be cover error path', () => {
      minio.objectGetUrl(config.get('/minio'));
    });
  });
  describe('listObjects', () => {
    it('should be cover success path', async () => {
      mockedStream.emit('data', 'foo');
      mockedStream.end();

      const result = await minio.listObjects(config.get('/minio'));

      assert.strictEqual(result.err, null);
    });
    it('should be cover error path', () => {
      mockedStream.emit('error', new Error());

      minio.listObjects(config.get('/minio'));
    });
  });
});
