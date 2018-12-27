const BaseService = require('./base')

class UserService extends BaseService {
	constructor(ctx) {
		super(ctx);
		this.model = ctx.model.User;
	}
}

module.exports = UserService;