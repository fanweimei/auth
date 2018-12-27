const BaseController = require('./base')
// const nodemailer = require('nodemailer');

class UserController extends BaseController {
	constructor(ctx) {
		super(ctx);
		this.service = this.service.user;
	}

	/**
	 * 登录
	 * @param {string} username 用户名
	 * @param {string} password 密码
	 * @returns {int} code 1表示成功,0表示用户名或密码不正确,-1表示该用户不能登录
	 * @returns {string} username 成功后返回的用户名
	 */
	async login() {
		let code = -1,
			msg = 'fail',
			username = '';
		const rule = {
			username: {
				type: 'string',
				required: true,
				allowEmpty: false
			},
			password: {
				type: 'string',
				required: true,
				allowEmpty: false
			}
		}
		// 校验
		this.ctx.validate(rule);
		const users = await this.service.find(this.ctx.request.body);
		const user = users && users.length > 0 ? users[0] : null;
		let menus = [];
		let hasMap = {};
		if (user && user.id) {
			const roles = await user.getRole();
			for (let role of roles) {
				let list = await role.getMenu();
				for (let item of list) {
					if (!hasMap[item.id]) {
						hasMap[item.id] = true;
						menus.push(item);
					}
				}
			}
			const now = Date.now();
			const start = user.startDate ? user.startDate.getTime() : '';
			const end = user.endDate ? user.endDate.getTime() : '';
			if ((user.status == 0) || (start && start > now) || (end && end < now)) {
				code = -2;
			} else {
				code = 0;
				msg = 'success';
				username = user.username;
				await this.setToken({
					userId: user.id,
					username: user.username
				});
			}
		}
		this.ctx.body = {
			code: code,
			message: msg,
			result: {
				user: user ? {
					id: user.id,
					name: user.username,
				} : null,
				menu: menus
			}
		};
	}

	/**
	 * 将token保存在header中
	 * @param {[object]} payload [token保存的内容]
	 */
	async setToken(payload) {
		const { app } = this.ctx;
		const token = app.jwt.sign(payload, app.config.jwt.secret, {
			expiresIn: app.config.jwt.exp
		});
		this.ctx.set('token', token);

		await app.redis.hmset(`token:${payload.userId}`, {
			token,
			time: new Date().getTime(),
			ip: this.ctx.ip
		});
		return token;
	}

	/**
	 * token校验
	 * @returns {int} code 1表示token有效 0表示token无效, 2表示该账号在其它地方登录
	 */
	async verify() {
		const { app } = this.ctx;
		let token = this.ctx.get('token');
		if (token) {
			const decoded = app.jwt.verify(token, app.config.jwt.secret);
			const session = await app.redis.hgetall(`token:${decoded.userId}`);
			if (!session || !session.token || session.token === token) {
				token = await this.setToken({
					userId: decoded.userId,
					username: decoded.username
				});
				this.ctx.body = {
					code: 0,
					message: 'success',
					result: token
				};
			} else {
				this.ctx.body = {
					code: 1,
					message: 'account login elsewhere',
					time: session.time,
					ip: session.ip
				};
			}

		} else {
			this.ctx.body = {
				code: -1,
				message: 'token值不存在，请先登录'
			};
		}
	}

	/**
	 * 用户退出时，清空用户的token
	 * @param {[number]} userId 用户名
	 */
	async deleteToken() {
		const userId = this.ctx.query.userId;
		const rs = await this.app.redis.del(`token:${userId}`);
		this.ctx.body = {
			code: 0,
			message: rs > 1 ? 'ok' : 'not exits this user'
		};
	}

	/**
	 * 添加用户
	 * @param {[string]} username 用户名
	 * @param {[string]} password 密码
	 * @param {[string]} email 邮箱
	 * @param {[date]} startDate 开始时间
	 * @param {[date]} endDate 结束时间
	 * @param {[string]} realname 用户名
	 * @param {[boolean]} islock 用户是否启用
	 *
	 * @return {[int]} code 1添加成功 0添加失败
	 */
	async create() {
		const rule = {
			username: {
				type: 'string',
				required: true,
				allowEmpty: false
			},
			password: {
				type: 'string',
				required: true,
				allowEmpty: false
			},
			email: {
				type: 'email',
				required: false,
				allowEmpty: true,
				default: '',
			},
			startDate: {
				type: 'date',
				required: false,
				allowEmpty: true,
			},
			endDate: {
				type: 'date',
				required: false,
				allowEmpty: true
			}
		};
		this.ctx.body = await super.create(rule);
	}
	/**
	 * 验证邮箱或有户名的唯一性
	 * @return {[string]} username或email
	 * @return {[int]} 1表示有效
	 */
	async unique() {
		const { field, value, id } = this.ctx.request.body;
		let unique = true;
		if (field == 'username') {
			unique = await this.uniqueUsername(value, id);
		} else if (field == 'email') {
			unique = await this.uniqueEamil(value, id);
		}
		this.ctx.body = {
			code: 0,
			message: 'ok',
			result: unique
		}
	}
	/**
	 * 验证用户名唯一性
	 */
	async uniqueUsername(username, id) {
		const user = await this.service.find({
			username: username
		}, false);
		if (user && user.length > 0 && user[0].id != id) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 验证邮箱唯一性
	 */
	async uniqueEamil(email, id) {
		const user = await this.service.find({
			email: email
		}, false);
		if (user && user.id != id) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 修改用户
	 * @returns {int} code 1表示修改成功 0表示修改失败
	 */
	async update() {
		const id = this.ctx.params.id;
		if (!id) {
			this.ctx.body = {
				code: -1,
				message: 'id号不存在'
			}
			return;
		}
		const rule = {
			username: {
				type: 'string',
				required: false,
				allowEmpty: false
			},
			password: {
				type: 'string',
				required: true,
				allowEmpty: false
			},
			email: {
				type: 'email',
				required: false
			},
			startDate: {
				type: 'date',
				required: false
			},
			endDate: {
				type: 'date',
				required: false
			}
		};
		this.ctx.body = await super.update(rule);
	}

	/**
	 * 修改密码
	 */
	async modifyPass() {
		const { username, oldpass, newpass } = this.ctx.request.body;
		let userIns = await this.service.find({
			username: username,
			password: oldpass
		});
		if (!userIns || !userIns.length) {
			this.ctx.body = {
				code: -1,
				message: '当前密码不正确，请重试'
			}
			return;
		}
		let updates = {
			password: newpass
		};
		const rule = {
			password: {
				type: 'string',
				required: true,
				allowEmpty: false
			}
		};
		this.ctx.validate(rule, updates);
		const rs = await this.service.update(updates, { id: userIns[0].id });
		if (rs && rs[0] > 0 || rs > 0) {
			this.ctx.body = {
				code: 0,
				message: 'success',
				result: rs[0]
			}
		} else {
			this.ctx.body = {
				code: -1,
				message: '暂时无法修改，请稍后再试'
			}
		}
	}
}
module.exports = UserController;