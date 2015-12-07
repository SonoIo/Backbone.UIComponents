var _              = require('underscore');
var $              = require('jquery');
var Backbone       = require('backbone');
var context        = require('context');
var ViewStack      = require('viewstack');
var Network        = require('network');
var waterfall      = require('async').waterfall;
var CollectionView = require('../../lib/listviews/CollectionView');

window.$        = jQuery = $;
Backbone.$      = $;
Backbone.jQuery = $;
window.context  = context;
context.network = new Network({
	context: context
});
var ctx = window._ctx = context;

// Viewstack
var viewStack = new ViewStack({ el: '#application', context: context });
viewStack.clearStack(); // Pulisco dalle eventuali view appese
viewStack.render(); // Renderizzo la view base application
context.viewstack = viewStack;

waterfall([
	function (next) {
		var fakeData = [];
		for (var i = 0; i < 400; i++) {
			fakeData.push({ 'id': i, 'name': 'Foo' + i });
		};
		var fakeCollection = new Backbone.Collection(fakeData);
		return next(null, fakeCollection);
	},
	function (fakeCollection, next) {
		var view = new CollectionView({
			collection: fakeCollection
		});
		ctx.viewstack.pushView(view);
		return next();
	}
], function (err) {
	if (err) return console.error(err);
});

