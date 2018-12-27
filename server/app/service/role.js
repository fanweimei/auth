const BaseService = require('./base')

class RoleService extends BaseService {
	constructor(ctx) {
		super(ctx);
		this.model = ctx.model.Role;
	}

	async setUsers(id, userIds) {
		const roleIns = await this.ctx.model.Role.findById(id);
		if (roleIns) {
			let users = this.ctx.model.User.build(userIds);
			roleIns.setUser(users);
		}
		return roleIns;
	}

	async getUsers(id) {
		const roleIns = await this.ctx.model.Role.findById(id);
		return await roleIns.getUser();
	}

	async setMenus(id, menuIds) {
		const roleIns = await this.ctx.model.Role.findById(id);
		if (roleIns) {
			let menus = this.ctx.model.Menu.build(menuIds);
			roleIns.setMenu(menus);
		}
		return roleIns;
	}
	async getMenus(id) {
		const roleIns = await this.ctx.model.Role.findById(id);
		return await roleIns.getMenu();
	}
}
module.exports = RoleService;
