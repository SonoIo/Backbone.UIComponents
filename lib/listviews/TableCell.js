var $        = require('jquery');
var _        = require('underscore');
var BaseView = require('../views/BaseView');

var TableCell = module.exports = BaseView.extend({

	className: 'listItem',

	initialize: function initialize(options) {
		TableCell.__super__.initialize.apply(this, arguments);

		if (!options.parentList)
			throw new Error('Cannot create TableCell without a parentList');

		this.addEvents({
			'click': 'select'
		});

		this.cache.x = 0;
		this.cache.y = 0;

		this.parentList = options.parentList;
		this.listenTo(this.model, 'change', this.render);
	},

	setModel: function setModel(model) {
		this.model = model;
	},

	render: function render() {
		this.$el.empty();
		this.$el.append($('<p>').text(this.model.toString()));
		return this;
	},

	select: function select(e) {
		if (e) e.preventDefault();

		if (typeof this.onSelect === 'function')
			this.onSelect();

		this.trigger('select', model);
	},

	getHeight: function getHeight() {
		return 100;
	},

	translate: function translate(x, y) {
		this.cache.x += x;
		this.cache.y += y;
		// TODO: choose the right transform property.
		this.$el.css('-webkit-transform', 'translate3d(0, ' + y + 'px, 0)');
	}

});

