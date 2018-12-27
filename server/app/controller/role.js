const BaseController = require('./base')

class RoleController extends BaseController {
	constructor(ctx) {
		super(ctx);
		this.service = this.service.role;
	}

	/**
	 * 添加角色
	 * @param {string} name 角色名
	 * @returns {int} code 1表示添加角色成功 0添加角色失败
	 */
	async create() {
		const rule = {
			name: {
				type: 'string',
				required: true,
				allowEmpty: false
			}
		}
		this.ctx.body = await super.create(rule);
	}

	/**
	 * 修改角色
	 * @param {string} name 需要修改的角色名
	 * @returns {int} code 1表示修改成功 0表示修改失败
	 */
	async update() {
		const rule = {
			name: {
				type: 'string',
				required: true,
				allowEmpty: false
			}
		}
		this.ctx.body = await super.update(rule);
	}

	/**
	 * 给角色指派用户
	 * @params {int} roleId 角色id号
	 * @params {array} userIds 用户id号 eg: [{id: 1}, {id: 2}]
	 * @returns {int} code 1表示设置成功, 0表示设置失败
	 */
	async setUsers() {
		const { roleId, userIds } = this.ctx.request.body;
		if (!roleId) {
			this.ctx.body = {
				code: -1,
				message: 'roleId不存在'
			}
			return;
		}
		if (!Array.isArray(userIds)) {
			this.ctx.body = {
				code: -1,
				message: '参数格式不对，userIds必须以用户id数组的形式传入'
			}
			return;
		}
		const rs = await this.ctx.service.role.setUsers(roleId, userIds);
		if (rs) {
			this.ctx.body = {
				code: 0,
				message: 'success',
				result: rs
			}
		} else {
			this.ctx.body = {
				code: -1,
				message: '未找到相应的角色'
			}
		}
	}

	/**
	 * 获取角色映射的用户数组
	 */
	async getUsers() {
		const roleId = this.ctx.query.roleId;
		if (!roleId) {
			this.ctx.body = {
				code: -1,
				message: 'roleId不存在'
			}
			return;
		}
		const users = await this.ctx.service.role.getUsers(roleId);
		this.ctx.body = {
			code: 0,
			result: users
		}
	}

	/**
	 * 验证角色名唯一性
	 * @return {[string]} name
	 * @return {[int]} 1表示有效
	 */
	async unique() {
		const { value, id } = this.ctx.request.body;
		let unique = true;
		const role = await this.ctx.service.role.find({
			name: value
		});
		if (role && role.length > 0 && role.id != id) {
			unique = false;
		} else {
			unique = true;
		}
		this.ctx.body = {
			code: 0,
			message: 'ok',
			result: unique
		}
	}

	/**
	 * 给角色设置权限
	 */
	async setMenus() {
		const { roleId, menuIds } = this.ctx.request.body;
		if (!roleId) {
			this.ctx.body = {
				code: -1,
				message: 'roleId不存在'
			}
			return;
		}
		if (!Array.isArray(menuIds)) {
			this.ctx.body = {
				code: -1,
				message: '参数格式不对，menuIds必须以用户id数组的形式传入'
			}
			return;
		}
		const rs = await this.ctx.service.role.setMenus(roleId, menuIds);
		if (rs) {
			this.ctx.body = {
				code: 0,
				message: 'success',
				result: rs
			}
		} else {
			this.ctx.body = {
				code: -1,
				message: '未找到相应的角色'
			}
		}
	}

	/**
	 * 根据角色id获取权限
	 */
	async getMenus() {
		const roleId = this.ctx.query.roleId;
		if (!roleId) {
			this.ctx.body = {
				code: -1,
				message: 'roleId不存在'
			}
			return;
		}
		const menus = await this.ctx.service.role.getMenus(roleId);
		this.ctx.body = {
			code: 0,
			result: menus
		}
	}
}
module.exports = RoleController;