var _       = require('underscore');
var $       = require('jquery');
var AppView = require('../../AppView');

var LoadingBarView = module.exports = AppView.extend({

	className: 'loadingBar',

	initialize: function initialize(options) {
		LoadingBarView.__super__.initialize.apply(this, arguments);
		this.hide = _.debounce(this.hide, 300);
	},

	render: function render() {
		this.$el.empty().append(
			$('<div>').addClass('indeterminate')
		);
		return this;
	},

	show: function show() {
		// if (!this.$el.is(':visible'))
		// 	this.$el.show();
		this.$el.addClass('show');

	},

	hide: function hide() {
		// this.$el.hide();
		this.$el.removeClass('show');
	}

});
