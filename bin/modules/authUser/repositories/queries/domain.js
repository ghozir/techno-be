const dateFns = require('date-fns');
const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const config = require('../../../../infra/configs/global_config');
// const common = require('../../../../helpers/utils/common');
// const { UnprocessableEntityError, NotFoundError, UnauthorizedError, ConflictError,

class Techno {

  constructor (db) {
    this.ctx = 'Student::command-domain';
    this.query = new Query(db);
    this.config = config;
  }

  async getData(payload) {

    if(!payload.startDate){
      payload.startDate = new Date();
      payload.endDate = new Date();
    }

    const result = await this.query.findData({
      createdAt:{
        $gte: dateFns.startOfDay(payload.startDate),
        $lt: dateFns.endOfDay(payload.endDate),
      }
    });

    if (result.err || !result.data) {
      logger.error(this.ctx, 'Failed to get student credential', 'login::query.findOneAdmin', result.err);
      return wrapper.error(result.err);
    }

    const doc = result.data.map((val,idx)=>{
      const nameUser = 'Pengunjung ke - '+ (idx+1);
      let ketSuhu;
      if(val.status === 1) {
        ketSuhu = 'Suhu Normal';
      }
      else if(val.status === 2) {
        ketSuhu = 'Suhu Rendah';
      }
      else {
        ketSuhu = 'Suhu Tinggi';
      }

      return {
        nama: nameUser,
        temp: val.temp,
        status: ketSuhu,
        Kehadiran: val.createdAt
      };
    });

    return wrapper.paginationData(doc, {
      totalVisitor: doc.length
    });
  }

}

module.exports = Techno;
