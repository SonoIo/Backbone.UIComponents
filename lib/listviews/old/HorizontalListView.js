var _        = require('underscore');
var fs       = require('fs');
var ListView = require('./ListView');
var IScroll  = require('iscroll');

var HorizontalListView = module.exports = ListView.extend({

	template: _.template(fs.readFileSync('templates/components/listviews/horizontal_list_view.html', 'utf8')),

	initialize: function initialize(options) {
		HorizontalListView.__super__.initialize.apply(this, arguments);
		this.listenTo(this, 'items:render', this.onRenderItems);
	},

	render: function render() {
		HorizontalListView.__super__.render.call(this);
		this.cache.$wrapper = this.$el.find('.wrapper');
		this._iscroll = new IScroll(this.cache.$wrapper.get(0), {
			scrollX: true,
			scrollY: false,
			preventDefault: false
		});
	},

	onTouchMove: function (e) {
	},

	onRenderItems: function () {
		this._iscroll.refresh();
	}

});
