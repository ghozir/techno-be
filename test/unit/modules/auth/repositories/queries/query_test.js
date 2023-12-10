const Query = require('../../../../../../bin/modules/auth/repositories/queries/query');
const sinon = require('sinon');

describe('Auth Query Test', () => {
  describe('getCached', () => {
    it('should success', async () => {
      const redis = {
        get: sinon.stub().resolves({})
      };
      const query = new Query(redis);
      await query.getCached('key');
    });
  });
});
