var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');
var AppView  = require('../../AppView');


var SelectField = module.exports = AppView.extend({

	className: 'selectField',

	events: {
		'focus select': 'onFocus',
		'change select': 'onChange',
		'click': 'onClick'
	},

	/*
	new SelectField({
		fieldId:       'colorField',
		field:         'color',
		collection:    Colors,
		selectedValue: 'blue',
		empty:         'No color',
		disabled:      false
	});
	*/
	initialize: function initialize(options) {
		SelectField.__super__.initialize.apply(this, arguments);

		if (!options)
			throw new Error('No options provided');

		if (!options.field)
			throw new Error('The field option is required');

		this.options = {
			empty:         typeof options.empty         !== 'undefined' ? options.empty         : null,
			selectedValue: typeof options.selectedValue !== 'undefined' ? options.selectedValue : null,
			disabled:      typeof options.disabled      !== 'undefined' ? options.disabled      : null,
			autoFocus:     typeof options.autoFocus     !== 'undefined' ? options.autoFocus     : false
		};

		this.fieldAttributes = {
			'data-field': options.field
		};

		if (options.fieldId)
			this.fieldAttributes['id'] = options.fieldId;

		this.rendered = false;
	},

	render: function render() {
		this.undelegateEvents();
		var self = this;
		this.rendered = true;
		this.$el.empty();
		var $field = this.cache.$field = $('<select>').attr(this.fieldAttributes);

		// Elemento vuoto
		if (this.options.empty) {
			$field.append($('<option>').addClass('empty').text(this.options.empty));
		}

		this.$el.append(this.cache.$field);

		var $anOption;
		if (this.collection instanceof Backbone.Collection) {
			this.collection.forEach(function (anElement) {
				$anOption = $('<option>').attr('value', anElement.id).text(anElement.toString());
				if (self.options.selectedValue == anElement.id) $anOption.attr('selected', 'selected');
				$field.append($anOption);
			});
		}
		else {
			_.forEach(this.collection, function (anElement) {
				if (_.isObject(anElement)) {
					$anOption = $('<option>').attr('value', anElement.value).text(anElement.label);
					if (self.options.selectedValue == anElement.value) $anOption.attr('selected', 'selected');
				}
				else {
					$anOption = $('<option>').attr('value', anElement).text(anElement);
					if (self.options.selectedValue == anElement) $anOption.attr('selected', 'selected');
				}
				$field.append($anOption);
			});
		}

		this.disabled(this.options.disabled);

		this.delegateEvents();
		return this;
	},

	onChange: function onChange(e) {
		var model = this.getValue();
		if (!model) model = null;
		this.trigger('change', model);
	},

	disabled: function disabled(value) {
		this.options.disabled = value;
		if (this.rendered) {
			if (value)
				this.cache.$field.attr('disabled', 'disabled');
			else
				this.cache.$field.removeAttr('disabled');
		}
	},

	setSelectedValue: function setSelectedValue(value) {
		this.options.selectedValue = value;
	},

	onClick: function onClick(e) {
		if (this.options.autoFocus)
			this.cache.$field.focus();
	},

	getValue: function getValue() {
		var value;
		if (this.collection instanceof Backbone.Collection)
			value = this.collection.get(this.cache.$field.val());
		else
			value = this.cache.$field.val();
		return value;
	},

	onFocus: function onFocus() {
		this.trigger('focus', this);
	}

});

