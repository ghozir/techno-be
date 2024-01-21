
const Command = require('./command');
const Query = require('../queries/query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const randomstring = require('randomstring');
const jwtAuth = require('../../../../auth/jwt_auth_helper');
const Unauthorized = require('../../../../helpers/error/unauthorized_error');
const config = require('../../../../infra/configs/global_config');
const common = require('../../../../helpers/utils/common');
const { UnprocessableEntityError, NotFoundError, UnauthorizedError, ConflictError,
  InternalServerError } = require('../../../../helpers/error');
const _ = require('lodash');

class AuthUser {

  constructor (redis, db, service) {
    this.command = new Command(redis, db, service);
    this.ctx = 'authAdmin::command-domain';
    this.query = new Query(redis, db);
    this.config = config;
  }

  async injectRoot(payload) {
    const existingAdmin = await this.query.findOneAdmin({
      'username': payload.username
    });
    if (existingAdmin.err) {
      logger.error(this.ctx, 'failed to check data existence', 'createTeacher::command.findOneTeacher', existingAdmin.err);
      return wrapper.error(new NotFoundError('Gagal mengecek data'));
    }
    if (existingAdmin.data) {
      logger.error(this.ctx, 'Email already exist', 'createTeacher::command.findOneTeacher', existingAdmin.err);
      return wrapper.error(new ConflictError('Email sudah digunakan'));
    }

    const hash = await common.getHash(payload.password);
    if (hash.err) wrapper.error(hash.err);
    payload.name = 'Admin ';
    payload.role = 'admin';
    payload.password = hash.data;
    payload.createdAt = new Date(Date.now());
    payload.updatedAt = new Date(Date.now());
    const result = await this.command.insertOneAdmin(payload);

    if (result.err) {
      logger.error(this.ctx, 'Failed to create admin', 'createAdmin::command.insertOneAdmin', result.err);
      return wrapper.error(new InternalServerError('Gagal insert data'));
    }

    return wrapper.data(null);
  }

  async login (payload) {
    const queryUser = {
      'username': payload.username
    };

    let result;
    result = await this.query.findOneAdmin(queryUser);

    if (result.err) {
      logger.error(this.ctx, 'Failed to get admin credential', 'login::command.upstreamGetCredential', result.err);
      return wrapper.error(result.err);
    }

    if (_.isEmpty(result.data)) return wrapper.error(new NotFoundError('Usernames salah !'));

    const checkPassword = await common.verifyHash(result.data.password, payload.password);
    if (checkPassword.err) {
      logger.log('login', 'error', checkPassword.err);
      return wrapper.error(checkPassword);
    }

    if (!checkPassword.data)
      return wrapper.error(new UnauthorizedError('Password salah !'));

    const now = Math.floor(Date.now() / 1000);
    result.data.id = result.data._id;
    // result.data.schoolUrl = config.get('/redirectUrlTeacher');
    delete result.data._id;
    delete result.data.password;
    delete result.data.createdAt;
    delete result.data.updatedAt;

    const cacheKey = `auth-service.${result.data.id}.${now}`;
    const time = payload.remember ? (14 * 24 * 60 * 60) : 7200;
    const cacheResult = await this.command.setCache(cacheKey, result.data, time);

    if (cacheResult.err) {
      logger.error(this.ctx, 'Failed to set teacher cache', 'login::command.setCache', cacheResult.err);
      return wrapper.error(cacheResult.err);
    }

    const token = await jwtAuth.generateToken(
      { mappedUser: {id: result.data.id }, sub: cacheKey, iat: now },
      { expiresIn: time }
    );
    return wrapper.data({token: token});
  }

  async forgetPass (payload) {
    const queryUser = {
      email: payload.email,
    };

    let result;
    if(payload.role === 'admin'){
      result = await this.query.findOneAdmin(queryUser);
    }
    else{
      result = await this.query.findOneUser(queryUser);
    }

    if (result.err) {
      logger.error(this.ctx, 'Failed to get admin credential', 'forgetPass::command.upstreamGetCredential', result.err);
      return wrapper.error(result.err);
    }
    if (_.isEmpty(result.data)) return wrapper.error(new NotFoundError('Email tidak terdaftar'));

    const token = randomstring.generate({
      length: 8,
      charset: 'alphanumeric'
    });

    const cacheKey = `auth-forgetPass.${result.data.email}.${token}`;
    const time = 600;
    const cacheResult = await this.command.setCache(cacheKey, result.data, time);

    if (cacheResult.err) {
      logger.error(this.ctx, 'Failed to set teacher cache', 'login::command.setCache', cacheResult.err);
      return wrapper.error(cacheResult.err);
    }

    const payloads = {
      from: 'GEP-MEDIA <ghost.anderson90@gmail.com>',
      to: payload.email,
      subject: 'Validasi Lupa Password',
      content:{
        nama: result.data.name,
        token: token,
      },
      template: 'forget-password',
    };

    const sendEmail = await this.command.sendEmail(payloads);
    if (sendEmail.err) wrapper.error(sendEmail.err);

    return wrapper.data(token);
  }

  async changePass (payload) {

    const decryptToken = common.parseString(payload.token);
    if (decryptToken.err) {
      return wrapper.error(new UnprocessableEntityError('token invalid'));
    }

    const token = decryptToken.data.token;

    const getKeys = await this.query.getKeys(`*${token}*`);
    if (getKeys.err) return wrapper.error(new Unauthorized('Token Expired !'));
    const getData = await this.query.getCached(getKeys.data[0]);

    if (getData.err) {
      logger.error(this.ctx, 'Failed to set teacher cache', 'forgot::command.getCache', getData.err);
      return wrapper.error(new Unauthorized('Token Expired !'));
    }

    const encrypt = await common.getHash(payload.password);
    const updatePass = await this.command.updatePass({_id: getData.data.idTeacher}, {
      password: encrypt.data
    });

    if (updatePass.err) {
      logger.error(this.ctx, 'Failed to update password', 'forgot::command.updatePass', updatePass.err);
      return wrapper.error(updatePass.err);
    }
    await this.command.unsetCache(getKeys.data[0]);

    await this.command.sendEmailSuccessPwd({
      to: getData.data.username,
      subject: '[Pijar Sekolah] Password Kamu Berhasil Diubah!',
      payload: {
        name: getData.data.name,
        link: config.get('/redirectUrlTeacher')
      }
    });
    return wrapper.data(null);
  }

  async logout (cacheKey) {
    const cacheResult = await this.command.unsetCache(cacheKey);
    if (cacheResult.err) {
      logger.error(this.ctx, 'Failed to unset teacher cache', 'logout::command.unsetCache', cacheResult.err);
      return wrapper.error(cacheResult.err);
    }
    return wrapper.data(null);
  }

  async insertDegree (payload) {
    let status;
    const temp = payload.temp;
    if(temp >= 36 && temp <= 37.5){
      status = 1;
    }
    else if (temp <= 35.9)
      status = 2;
    else
      status = 3;

    const degreeadd = await this.command.insertDegree({
      temp:payload.temp,
      status:status,
      createdAt:new Date()
    });
    if (degreeadd.err) {
      logger.error(this.ctx, 'Failed to unset teacher cache', 'logout::command.unsetCache', degreeadd.err);
      return wrapper.error(degreeadd.err);
    }
    return wrapper.data(null);
  }
}

module.exports = AuthUser;
