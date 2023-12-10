const assert = require('assert');
const uuid = require('uuid');

const commonUtil = require('../../../../bin/helpers/utils/common');

describe('Common Helper Utilities', () => {
  describe('uuidv4', () => {
    it('should return valid UUID v4', () => {
      const res = commonUtil.uuidv4();
      assert(uuid.validate(res), true);
    });
  });
});

