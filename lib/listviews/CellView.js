var _        = require('underscore');
var BaseView = require('../views/BaseView');

var CellView = module.exports = BaseView.extend({

	className: 'cell',

	initialize: function initialize(options) {
		CellView.__super__.initialize.call(this, options);
	},

	render: function render() {
		var data = {
			model: this.model.toJSON()
		};
		this.$el.empty();
		this.$el.append($('<span>').text(this.model.toString()));
		return this;
	}

});
