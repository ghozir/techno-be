const assert = require('assert');
const sinon = require('sinon');

const wrapper = require('../../../../bin/helpers/utils/wrapper');
const { ERROR:httpError, SUCCESS:http } = require('../../../../bin/helpers/http-status/status_code');
const {
  NotFoundError,
  InternalServerError,
  BadRequestError,
  ConflictError,
  ExpectationFailedError,
  ForbiddenError,
  GatewayTimeoutError,
  ServiceUnavailableError,
  UnauthorizedError,
  UnprocessableEntityError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
  TooManyRequestsError,
} = require('../../../../bin/helpers/error');

describe('Wrapper', () => {

  const res = { send: sinon.stub() };

  describe('paginationData', () => {
    it('should success', () => {
      const res = wrapper.paginationData({}, {});
      assert(res.data, {});
      assert(res.meta, {});
    });
  });

  describe('response', () => {
    it('should cover default branch', () => {
      wrapper.response(res, 'success', { err: null, data: null });
    });

    it('should cover type === \'fail\' branch', () => {
      wrapper.response(res, 'fail', { err: { }, data: null });
    });

    it('should cover type === \'fail\' branch with error message', () => {
      wrapper.response(res, 'fail', { err: { message: 'foo' }, data: null });
    });

    it('should cover type === \'fail\' branch with response error', () => {
      wrapper.response(res, 'fail', { err: { responseError: true, data: {} }, data: null });
    });

    it('should cover type === \'fail\' branch with response error that has data', () => {
      wrapper.response(res, 'fail', { err: { responseError: true, data: { data: null } }, data: null });
    });
  });

  describe('paginationResponse', () => {
    it('should success', () => {
      wrapper.paginationResponse(res, 'success', { data: {}, meta: {}}, '', http.OK);
    });
    it('should error', () => {
      wrapper.paginationResponse(res, 'fail', { data: {}, err: {}}, '', httpError.CONFLICT);
    });
    it('should cover branch', () => {
      wrapper.paginationResponse(res, 'fail', { data: {}, err: {}});
    });
  });

  describe('checkErrorCode', () => {
    it('should return NotFoundError', () => {
      wrapper.response(res, 'fail', { err: new NotFoundError()});
    });
    it('should return BadRequestError', () => {
      wrapper.response(res, 'fail', { err: new BadRequestError()});
    });
    it('should return InternalServerError', () => {
      wrapper.response(res, 'fail', { err: new InternalServerError()});
    });
    it('should return ConflictError', () => {
      wrapper.response(res, 'fail', { err: new ConflictError()});
    });
    it('should return ExpectationFailedError', () => {
      wrapper.response(res, 'fail', { err: new ExpectationFailedError()});
    });
    it('should return GatewayTimeoutError', () => {
      wrapper.response(res, 'fail', { err: new GatewayTimeoutError()});
    });
    it('should return UnauthorizedError', () => {
      wrapper.response(res, 'fail', { err: new UnauthorizedError()});
    });
    it('should return ServiceUnavailableError', () => {
      wrapper.response(res, 'fail', { err: new ServiceUnavailableError()});
    });
    it('should return ForbiddenError', () => {
      wrapper.response(res, 'fail', { err: new ForbiddenError()});
    });
    it('should return UnprocessableEntityError', () => {
      wrapper.response(res, 'fail', { err: new UnprocessableEntityError()});
    });
    it('should return PayloadTooLargeError', () => {
      wrapper.response(res, 'fail', { err: new PayloadTooLargeError()});
    });
    it('should return UnsupportedMediaTypeError', () => {
      wrapper.response(res, 'fail', { err: new UnsupportedMediaTypeError()});
    });
    it('should return TooManyRequestsError', () => {
      wrapper.response(res, 'fail', { err: new TooManyRequestsError()});
    });
    it('should return InternalServerError on default branch', () => {
      wrapper.response(res, 'fail', { err: new Error() });
    });
  });
});
