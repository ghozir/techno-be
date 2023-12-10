const Auth = require('../../../../../../bin/modules/auth/repositories/queries/domain');
const queryHandler = require('../../../../../../bin/modules/auth/repositories/queries/query_handler');
const sinon = require('sinon');

describe('Auth Query Handler Test', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
  });

  describe('getCached', () => {
    it('should success', async () => {
      sandbox.stub(Auth.prototype, 'getCached').resolves({});
      await queryHandler.getCached('key');
    });
  });
});
