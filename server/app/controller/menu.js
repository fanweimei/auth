const BaseController = require('./base')

class MenuController extends BaseController {
	constructor(ctx) {
		super(ctx);
		this.service = this.service.menu;
	}

	async create() {
		const rule = {
			name: {
				type: 'string',
				required: true
			},
			key: {
				type: 'string',
				required: true
			}
		};
		this.ctx.body = await super.create(rule);
	}
	async update() {
		const rule = {
			name: {
				type: 'string',
				required: true
			}
		};
		this.ctx.body = await super.update(rule);
	}

}
module.exports = MenuController;