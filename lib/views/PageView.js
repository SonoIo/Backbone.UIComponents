var _        = require('underscore');
var fs       = require('fs');
var BaseView = require('./BaseView');

var PageView = module.exports = BaseView.extend({

	className: 'page',

	initialize: function initialize(options) {
		PageView.__super__.initialize.call(this, options);
		this.addOptions({
			modal: false
		});
	},

	render: function render() {
		PageView.__super__.render.call(this);
		if (this.options.modal) {
			this.$el.addClass('page-modal');
		}
		return this;
	},

	onDeactivate: function onDeactivate() {
		this.$el.addClass('deactivate');
	},

	onActivate: function onActivate(firstTime) {
		this.$el.removeClass('deactivate');
	}

});

