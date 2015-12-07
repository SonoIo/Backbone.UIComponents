var _        = require('underscore');
var Backbone = require('backbone');
var context  = require('context');

var BaseView = module.exports = Backbone.View.extend({

	// Place where to store volatile variables, 
	// DOM references of layouts parts or placeholders.
	cache: null,

	// Object containers of subviews. 
	// Destroy relate to this objected to free up memory.
	views: null,

	// Context of the application.
	context: null,

	// Backbone.touch default settings
	touchThreshold: 10,
	touchActiveClassName: 'active-state',

	//
	// Methods
	//

	initialize: function initialize (options) {
		this.views   = {};
		this.cache   = {};
		this.options = _.defaults(options || {}, {
			context: null
		});

		// Initialize the context
		if (this.options.context) {
			this.setContext(options.context);
		}
		else if (this.options.ctx) {
			this.setContext(options.ctx);
		}
		else {
			this.setContext(require('context'));
		}
	},

	// Context
	getContext: function getContext() {
		return this.context;
	},
	setContext: function setContext(newContext) {
		this.context = newContext;
	},

	// Setter and getter for the z-index property
	setZindex: function setZindex(zIndex) {
		this._zIndex = zIndex;
		this.$el.css('z-index', zIndex);
		return this;
	},
	getZindex: function getZindex() {
		return this._zIndex;
	},

	// Implement the destroy flow described in this article
	// refer: http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	destroy: function destroy() {
		this.remove();
		this.off();
		if (this.onDestroy)
			this.onDestroy();
	},

	//
	// Helpers
	//

	// Helper function to add events securely
	addEvents: function addEvents(newEvents) {
		this.events = _.defaults(newEvents, this.events || {});
		return this;
	},

	addOptions: function addOptions(newOptions) {
		this.options = _.defaults(this.options, newOptions);
		return this;
	},

	// Helper function to change the CSS animation
	// Events: oanimationend animationend webkitAnimationEnd
	changeAnimation: function changeAnimation(animationName, selector) {
		var el;
		if (_.isUndefined(selector) || selector.length == 0) {
			el = this.$el;
		}
		else{
			el = selector;
		}
		el.css('animation-name', animationName);
		el.css('-webkit-animation-name', animationName);
		el.css('-moz-animation-name', animationName);
		el.css('-o-animation-name', animationName);
		return this;
	},

	// Helper function that find a data-placeholder property on the DOM
	findPlaceholder: function findPlaceholder(name) {
		return this.$el.find('[data-placeholder="' + name + '"]');
	},

	// Alternative method to render a view
	// http://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple/
	assign: function (view, selector) {
		view.setElement(this.$(selector)).render();
		return this;
	},

	//
	// Events
	//

	// Propagate the destroy events to all the subviews
	onDestroy: function onDestroy() {
		_.forEach(this.views, function (aView) {
			if (aView instanceof AppView)
				aView.destroy();
		});
	}

});

