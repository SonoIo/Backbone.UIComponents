var _       = require('underscore');
var fs      = require('fs');
var AppView = require('../../AppView');

var LoadingScreenView = module.exports = AppView.extend({

	className: 'loadingScreen',

	template: _.template(fs.readFileSync('templates/components/loadings/loading_screen.html', 'utf8')),

	initialize: function initialize(options) {
		LoadingScreenView.__super__.initialize.call(this, options);
		this.options = _.defaults(options || {}, {
			label: __('Attendere...'),
			autoShow: false,
			addClass: null
		});
	},

	render: function render() {
		var data = {
			label: this.options.label
		};
		this.$el.html(this.template(data));
		this.cache.$label = this.$el.find('.label');

		if (this.options.addClass) {
			this.$el.addClass(this.options.addClass);
		}

		if (this.options.autoShow)
			this.show();
		else
			this.hide();
		return this;
	},

	show: function show(label) {
		if (label)
			this.cache.$label.text(label);
		this.$el.addClass('show');
	},

	hide: function hide() {
		var self = this;
		self.$el.removeClass('show');
		this.cache.$label.text(this.options.label);
	}

});
