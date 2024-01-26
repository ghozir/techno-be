const commandHandler = require('../repositories/commands/command_handler');
const commandModel = require('../repositories/commands/command_model');
const queryHandler = require('../repositories/queries/query_handler');
const queryModel = require('../repositories/queries/query_model');
const wrapper = require('../../../helpers/utils/wrapper');
const validator = require('../../../helpers/utils/validator');
const { SUCCESS: http } = require('../../../helpers/http-status/status_code');


const injectAdmin = async (req, res) => {
  const payload = {...req.body};
  const validatePayload = validator.isValidPayload(payload, commandModel.injectAdmin);

  const postRequest = (result) =>
    (result.err)
      ? result
      : commandHandler.InjectAdmin(result.data);

  const sendResponse = (result) => {
    (result.err)
      ? wrapper.response(res, 'fail', result, 'Failed to inject Admin')
      : wrapper.response(res, 'success', result, 'Successfully to inject admin');
  };

  sendResponse(await postRequest(validatePayload));
};

const login = async (req, res) => {
  const payload = req.body;
  const validatePayload = validator.isValidPayload(payload, commandModel.login);

  const postRequest = (result) =>
    (result.err)
      ? result
      : commandHandler.login(result.data);

  const sendResponse = (result) => {
    (result.err)
      ? wrapper.response(res, 'fail', result, 'Failed to log student in')
      : wrapper.response(res, 'success', result, 'Successfully log student in');
  };

  sendResponse(await postRequest(validatePayload));
};

const insertDegree = async (req, res) => {
  const payload = req.body;
  const validatePayload = validator.isValidPayload(payload, commandModel.insertData);

  const postRequest = (result) =>
    (result.err)
      ? result
      : commandHandler.insertDegree(result.data);

  const sendResponse = (result) => {
    (result.err)
      ? wrapper.response(res, 'fail', result, 'Failed to log student in')
      : wrapper.response(res, 'success', result, 'Successfully log student in');
  };

  sendResponse(await postRequest(validatePayload));
};

const logout = async (req, res) => {

  const postRequest = () => commandHandler.logout(req.userId);

  const sendResponse = (result) => {
    (result.err)
      ? wrapper.response(res, 'fail', result, 'Failed to log teacher out')
      : wrapper.response(res, 'success', result, 'Successfully log teacher out');
  };

  sendResponse(await postRequest());
};

const getInfo = async (req, res) => {
  return wrapper.response(res, 'success', {data: req.user}, 'Successfully get authentication status');
};

const forgetPass = async (req, res) => {
  const payload = req.body;
  const validatePayload = validator.isValidPayload(payload, commandModel.forgetPass);

  const postRequest = (result) =>
    (result.err)
      ? result
      : commandHandler.forgetPass(result.data);

  const sendResponse = (result) => {
    (result.err)
      ? wrapper.response(res, 'fail', result, 'Failed to log student in')
      : wrapper.response(res, 'success', result, 'Successfully log student in');
  };

  sendResponse(await postRequest(validatePayload));
};

const getToken = async (req, res) => {
  const payload = req.body;
  const validatePayload = validator.isValidPayload(payload, commandModel.login);

  const postRequest = (result) =>
    (result.err)
      ? result
      : commandHandler.login(result.data);

  const sendResponse = (result) => {
    (result.err)
      ? wrapper.response(res, 'fail', result, 'Failed to log student in')
      : wrapper.response(res, 'success', result, 'Successfully log student in');
  };

  sendResponse(await postRequest(validatePayload));
};

const changePassword = async (req, res) => {
  const payload = req.body;
  const validatePayload = validator.isValidPayload(payload, commandModel.login);

  const postRequest = (result) =>
    (result.err)
      ? result
      : commandHandler.login(result.data);

  const sendResponse = (result) => {
    (result.err)
      ? wrapper.response(res, 'fail', result, 'Failed to log student in')
      : wrapper.response(res, 'success', result, 'Successfully log student in');
  };

  sendResponse(await postRequest(validatePayload));
};

const getData = async (req, res) => {
  const payload = {...req.query};
  const validatePayload = validator.isValidPayload(payload, queryModel.getData);

  const postRequest = (result) =>
    (result.err)
      ? result
      : queryHandler.getData(result.data);

  const sendResponse = (result) => {
    (result.err)
      ? wrapper.response(res, 'fail', result, 'Failed to inject Admin')
      : wrapper.paginationResponse(res, 'success', result, 'Successfully to inject admin');
  };

  sendResponse(await postRequest(validatePayload));
};

module.exports = {
  login,
  logout,
  getInfo,
  injectAdmin,
  forgetPass,
  insertDegree,
  getData
};
