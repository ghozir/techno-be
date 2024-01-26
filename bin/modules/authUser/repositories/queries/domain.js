const dateFns = require('date-fns');
const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const config = require('../../../../infra/configs/global_config');
const { UnprocessableEntityError } = require('../../../../helpers/error');
// const common = require('../../../../helpers/utils/common');
// const { UnprocessableEntityError, NotFoundError, UnauthorizedError, ConflictError,

class Techno {

  constructor (redis,db) {
    this.ctx = 'Student::command-domain';
    this.query = new Query(redis,db);
    this.config = config;
  }

  async getData(payload) {
    payload.startDate = (payload.startDate) ? dateFns.startOfDay(payload.startDate) : dateFns.startOfDay(new Date);
    payload.endDate = (payload.endDate) ? dateFns.startOfDay(payload.endDate) : dateFns.endOfDay(new Date);

    if (payload.startDate > payload.endDate) {
      return wrapper.error(new UnprocessableEntityError('Start Date tidak boleh lebih besar dari End Date'));
    }

    const result = await this.query.findData({
      createdAt:{
        $gte: payload.startDate,
        $lt: payload.endDate,
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
