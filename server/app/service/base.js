const Service = require('egg').Service;

class BaseService extends Service {
  async list() {
    const { query } = this.ctx;
    return await this.model.findAndCountAll({
      limit: query.limit,
      offset: query.offset,
    });
  }
  async listall() {
    return await this.model.findAll();
  }
  async find(cond) {
    return await this.model.findAll({
      where: cond,
    });
  }
  async findOne(cond) {
    return await this.model.findOne({
      where: cond,
    });
  }
  async findById(id) {
    return await this.model.findById(id);
  }

  async create(params) {
    return await this.model.create(params);
  }

  async update(updates, cond) {
    return await this.model.update(updates, { where: cond });
  }

  async destroy(cond) {
    return await this.model.destroy({
      where: cond,
    });
  }
}

module.exports = BaseService;
