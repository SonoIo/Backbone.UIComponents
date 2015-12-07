var $          = require('jquery');
var _          = require('underscore');
var Backbone   = require('backbone');
var ScrollView = require('./ScrollView');

var CellView = require('./CellView');

var CollectionView = module.exports = ScrollView.extend({

	className: 'collection',

	initialize: function initialize(options) {
		options = _.defaults(options || {}, {
			directionLocked: true,
			vscroll: true,
			hscroll: false
		});

		CollectionView.__super__.initialize.call(this, options);

		this.addOptions({
			itemsCacheSize: 20
		});

		// Active views container
		this.setCollection(options.collection);

		this.listenTo(this, 'scroll', this.onScroll);
	},

	setCollection: function setCollection(collection) {
		if (this.collection) {
			this.stopListening(this.collection);
		}

		if (!collection) {
			this.collection = null;
			return;
		}

		if (!(collection instanceof Backbone.Collection))
			collection = new Backbone.Collection(collection);

		this.collection = collection;

		this.listenTo(this.collection, 'add',    this.onAdd);
		this.listenTo(this.collection, 'remove', this.onRemove);
		this.listenTo(this.collection, 'reset',  this.onReset);
		// this.listenTo(this.collection, 'sort',   this.sort);
	},

	getCollection: function getCollection() {
		return this.collection;
	},

	render: function render() {
		this.$el.empty();
		this.$el.css({
			'overflow': 'hidden'
		});
		// Initialize cached items
		// var aCacheItem;
		// for (var i = 0; i < this.options.itemsCacheSize; i++) {
		// 	aCacheItem = $('<div class="cell">');
		// 	this.cache.items.push(aCacheItem);
		// 	aCacheItem.appendTo(this.$el);
		// }

		return this;
	},

	onAdd: function onAdd(model) {
		
	},

	onRemove: function onRemove(model) {
		
	},


	onScroll: function onScroll(e) {
		console.log(e);
	},

	onDestroy: function onDestroy() {
		ListView.__super__.onDestroy.call(this);
		// TODO....
	}

});
