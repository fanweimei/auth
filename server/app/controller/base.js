'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async index() {
    const { ctx, service } = this;
    const list = await service.list();
    ctx.body = {
      code: 0,
      message: 'success',
      result: {
        totalItems: list.count,
        totalPages: Math.ceil(list.count / ctx.query.pageSize),
        pageSize: ctx.query.pageSize,
        currentPage: ctx.query.page,
        items: list.rows,
      },
    };
  }

  async listall() {
    const list = await this.service.listall();
    this.ctx.body = {
      code: 0,
      message: 'success',
      result: list
    }
  }

  async create(rule) {
    const { ctx, service } = this;
    ctx.validate(rule);
    const created = await service.create(ctx.request.body);
    return {
      code: 0,
      message: 'success',
      result: created,
    };
  }

  async update(rule) {
    const { ctx, service } = this;
    let code = -1;
    let message = '更新失败';
    ctx.validate(rule);
    ctx.validate({ id: 'id' }, ctx.params);
    const updated = await service.update(ctx.request.body, { id: ctx.params.id });
    if (updated[0] > 0) {
      code = 0;
      message = 'success';
    }
    return { code, message, result: updated[0] };
  }

  async destroy() {
    const { ctx, service } = this;
    ctx.validate({ id: 'id' }, ctx.params);
    const delCount = await service.destroy({ id: ctx.params.id });
    if (delCount > 0) {
      ctx.body = {
        code: 0,
        message: 'success',
        result: delCount
      };
    } else {
      ctx.body = {
        code: -1,
        message: '删除失败',
      };
    }
  }

  async show() {
    const { ctx, service } = this;
    ctx.validate({ id: 'id' }, ctx.params);
    const instance = await service.findById(ctx.params.id);
    if (instance) {
      ctx.body = {
        code: 0,
        message: 'success',
        result: instance,
      };
    } else {
      ctx.body = {
        code: -1,
        message: 'not found',
      };
    }
  }
  // 运行为空，只校验类型
  onlyCheckType(t) {
    return {
      type: t,
      required: false,
      allowNull: true,
    };
  }
}

module.exports = BaseController;
