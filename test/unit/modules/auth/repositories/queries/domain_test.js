const Auth = require('../../../../../../bin/modules/auth/repositories/queries/domain');
const Query = require('../../../../../../bin/modules/auth/repositories/queries/query');
const sinon = require('sinon');

describe('Auth Query Domain Test', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  const redis = {
    get: sinon.stub().resolves({})
  };
  const auth = new Auth(redis);

  describe('getCached', () => {
    it('should error', async () => {
      sandbox.stub(Query.prototype, 'getCached').resolves({ err: true });
      await auth.getCached('key');
    });
    it('should success', async () => {
      sandbox.stub(Query.prototype, 'getCached').resolves({ err: null, data: {} });
      await auth.getCached('key');
    });
  });
});
