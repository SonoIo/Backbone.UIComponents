var _ = require('underscore');
var AppView = require('../AppView');

var Cell = module.exports = AppView.extend({

	className: 'cell',

	initialize: function initialize(options) {
		Cell.__super__.initialize.call(this, options);
	},

	render: function render() {
		var data = {
			model: this.model.toJSON()
		};
		this.$el.html();
		return this;
	}

});
