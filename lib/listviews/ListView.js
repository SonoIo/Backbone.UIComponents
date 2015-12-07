var $          = require('jquery');
var _          = require('underscore');
var Backbone   = require('backbone');
var ScrollView = require('./ScrollView');

var TableViewCell = require('./TableViewCell');

var TableView = module.exports = ScrollView.extend({

	className: 'listview',

	stopEvents: false,

	initialize: function initialize(options) {
		ListView.__super__.initialize.call(this, options);

		this.addOptions({
			emptyText: __('Nessun elemento'),
			itemsCacheSize: 20,
			// Ignored
			vscroll: true,
			hscroll: false
		});

		// Active views container
		this.items = {};
		this.cache.x = 0;
		this.cache.y = 0;
		this.cache.touch = {};

		this.cache.topIndex = 0;
		this.cache.bottomIndex = this.options.itemsCacheSize;
		this.cache.items = [];
		this.cache.placeholders = [];
		this.cache.listHeight = 0;

		this.setCollection(options.collection);
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
		var aCacheItem;
		for (var i = 0; i < this.options.itemsCacheSize; i++) {
			aCacheItem = $('<div class="list-item">');
			this.cache.items.push(aCacheItem);
			aCacheItem.appendTo(this.$el);
		}

		this.renderItems();

		return this;
	},

	renderItems: function renderItems() {
		var anItem;
		for (var i = 0; i < this.options.itemsCacheSize; i++) {
			if (this.items[i])
				this.items[i].destroy();
			this.items[i] = anItem = this.getCellAtIndex(i);
			anItem.assign(this.cache.items[i]);
			anItem.translate(0, totalHeight);
		}
	},

	onAdd: function onAdd(model) {
		this.cache.totalHeight += anItem.getHeight();
	},

	onRemove: function onRemove(model) {
		this.cache.totalHeight -= anItem.getHeight();
	},

	getCellAtIndex: function getCellAtIndex(index) {
		var model = this.getCollection().at(index);
		return new ListItemView({ parentList: this, model: model });
	},


	// Start a touch event
	onTouchStart: function onTouchStart(e) {
		e.preventDefault();
		this.cache.touch.clientX = e.originalEvent.changedTouches[0].clientX;
		this.cache.touch.clientY = e.originalEvent.changedTouches[0].clientY;
	},

	// Touch move
	onTouchMove: function onTouchMove(e) {
		e.preventDefault();
		var deltaY = this.cache.deltaY = this.cache.touch.clientY - e.originalEvent.changedTouches[0].clientY;
		var deltaX = this.cache.deltaX = this.cache.touch.clientX - e.originalEvent.changedTouches[0].clientX;

		this.cache.y += deltaY;
		this.cache.x += deltaX;

		console.log(this.cache.y, deltaY);

		this.cache.touch.clientX = e.originalEvent.changedTouches[0].clientX;
		this.cache.touch.clientY = e.originalEvent.changedTouches[0].clientY;
	},

	// End touch event
	onTouchEnd: function onTouchEnd(e) {
		e.preventDefault();
	},

	onDestroy: function onDestroy() {
		ListView.__super__.onDestroy.call(this);
		// TODO....
	}

});
