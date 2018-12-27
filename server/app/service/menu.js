const BaseService = require('./base')

class MenuService extends BaseService {
	constructor(ctx) {
		super(ctx);
    	this.model = ctx.model.Menu;
	}
}
module.exports = MenuService;