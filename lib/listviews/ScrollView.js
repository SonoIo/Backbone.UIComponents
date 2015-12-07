var _        = require('underscore');
var BaseView = require('../views/BaseView');

var ScrollView = module.exports = BaseView.extend({

	className: 'scrollview',

	initialize: function initialize(options) {
		ScrollView.__super__.initialize.call(this, options);

		this.addEvents({
			'touchstart': 'onTouchStart',
			'touchmove':  'onTouchMove',
			'touchend':   'onTouchEnd'
		});

		this.addOptions({
			directionLocked: false,
			vscroll: true,
			hscroll: true,
			maxWidth: 0, // Zero means no limits
			maxHeight: 0  // Zero means no limits
		});

		this.zoom   = 1; // TODO
		this.x      = 0;
		this.y      = 0;
		this.width  = 0;
		this.height = 0;
		this.bounds = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};
		this.touch  = {
			pageX: 0,
			pageY: 0,
			velocityX: 0,
			velocityY: 0,
			startTime: null,
			direction: null,
			started: false,
			bounds: null
		};
	},

	render: function render() {
		this.$el.empty();
		this.$el.css({
			'overflow': 'hidden'
		});
		this.width  = this.$el.width();
		this.height = this.$el.height();
		return this;
	},

	getTime: function getTime() {
		return (new Date()).getTime();
	},

	updateBounds: function updateBounds() {
		this.bounds.top    = this.x;
		this.bounds.right  = this.x + this.width;
		this.bounds.bottom = this.y + this.height;
		this.bounds.left   = this.y;
	},

	move: function move(x, y) {
		var oldX      = this.x;
		var oldY      = this.y;
		var deltaX    = x - this.touch.pageX;
		var deltaY    = y - this.touch.pageY;
		var deltaT    = this.getTime() - this.touch.time;
		var velocityX = Math.floor(deltaX / deltaT);
		var velocityY = Math.floor(deltaY / deltaT);

		if (!this.options.vscroll)
			deltaY = 0;

		if (!this.options.hscroll)
			deltaX  = 0;

		if (!this.touch.direction)
			this.touch.direction = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';

		if (this.options.directionLocked) {
			if (this.touch.direction == 'h')
				deltaY = 0;
			else
				deltaX = 0;
		}

		this.x += deltaX;
		this.y += deltaY;
		this.touch.distX += deltaX;
		this.touch.distY += deltaY;
		this.touch.velocityX = velocityX;
		this.touch.velocityY = velocityY;

		this.updateBounds();

		this.touch.pageX = x;
		this.touch.pageY = y;

		if (oldX === this.x && oldY === this.y)
			return;

		this.trigger('scroll', {
			x: this.x,
			y: this.y,
			touch: _.clone(this.touch),
			bounds: _.clone(this.bounds)
		});
	},

	// Start a touch event
	onTouchStart: function onTouchStart(e) {
		e.preventDefault();
		this.touch.started   = true;
		this.touch.direction = null;
		this.touch.pageX     = e.originalEvent.changedTouches[0].pageX;
		this.touch.pageY     = e.originalEvent.changedTouches[0].pageY;
		this.touch.time      = this.getTime();
		this.touch.distX     = 0;
		this.touch.distY     = 0;
	},

	// Touch move
	onTouchMove: function onTouchMove(e) {
		e.preventDefault();

		// The touch event started outside the ScrollView
		if (!this.touch.started)
			return;

		this.move(e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY);
	},

	// End touch event
	onTouchEnd: function onTouchEnd(e) {
		e.preventDefault();
		this.touch.started = false;
		// TODO: intertia and bounce
	},

	onDestroy: function onDestroy() {
		ListView.__super__.onDestroy.call(this);
		// TODO....
	}

});
