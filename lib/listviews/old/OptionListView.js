
var _ = require('underscore');
var Backbone = require('backbone');
var ChildViewContainer = require('backbone.babysitter');
var PaginatedListView = require('./PaginatedListView');
var OptionListItemView = require('./OptionListItemView');

var OptionListView = module.exports = PaginatedListView.extend({

	className: 'optionList',

	initialize: function initialize(options) {
		OptionListView.__super__.initialize.apply(this, arguments);

		if ('multiselect' in options)
			this.options.multiselect = options.multiselect;
		else
			this.options.multiselect = true;

		if (this.options.multiselect && this.options.emptyItem)
			throw new Error('Cannot use emptyItem options combined with multiselect');

		if ('unselectable' in options)
			this.options.unselectable = options.unselectable;
		else
			this.options.unselectable = true;

		this.selectedModels = {};
	},

	getItemViewAtIndexWithOptions: function getItemViewAtIndexWithOptions(index, options) {
		return new OptionListItemView(options);
	},

	onSelectItem: function onSelectItem(selectedItem) {
		var self = this;

		if (!(selectedItem instanceof OptionListItemView)) 
			throw new Error('Selected item should inherit from OptionListItemView');

		if (selectedItem.isActive())
			self.selectedModels[selectedItem.model.id] = selectedItem.model;
		else
			delete self.selectedModels[selectedItem.model.id];

		if (!self.options.multiselect) {
			_.each(self.selectedModels, function (aModel, aModelId) {
				if (aModelId != selectedItem.model.id)
					delete self.selectedModels[aModelId];
			});
			// Deactivate all other items
			self.items.each(function (anItem) {
				if (anItem instanceof OptionListItemView && anItem.isActive() && anItem.model.id != selectedItem.model.id) {
					anItem.setActive(false);
				}
			});
		}
	},

	isAnItemSelected: function isAnItemSelected() {
		return !_.isEmpty(this.selectedModels);
	},

	selectModels: function selectModels(models, options) {
		if (!options)
			options = {};

		var defaultOptions = {
			reset: true
		};
		_.defaults(options, defaultOptions);

		if (options.reset)
			this.unselectAll();

		var self = this;
		var aListViewItem;
		_.each(models, function (aModel) {
			self.selectedModels[aModel.id] = aModel;
			aListViewItem = self.items.findByModel(aModel);
			if (aListViewItem)
				aListViewItem.setActive(true);
		});
	},

	unselectAll: function unselectAll() {
		var self = this;
		var aListViewItem;
		_.each(self.selectedModels, function (aModel) {
			aListViewItem = self.items.findByModel(aModel);
			aListViewItem.setActive(false);
			delete self.selectedModels[aModel.id];
		});
	},

	onAddItem: function onAddItem(anItem) {
		if (this.selectedModels[anItem.model.id]) {
			anItem.setActive(true);
		}
	},

	getSelectedModels: function getSelectedModels() {
		return _.values(this.selectedModels);
	}

});

