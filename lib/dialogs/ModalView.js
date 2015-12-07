
var $ = require('jquery');
var _ = require('underscore');
var _s = require('underscore.string');
var fs = require('fs');
var Backbone = require('backbone');
var AppView = require('../../AppView');


var ModalView = module.exports = AppView.extend({
	className: 'modal',

	template: _.template(fs.readFileSync('templates/components/dialogs/modal.html', 'utf8')),

	events: {
		'click .toolbar button': 'onButtonClick',
		'click .overlay': 'cancel',
		'touchstart .overlay': 'onOverlayTouchMove',
		'touchmove .overlay': 'onOverlayTouchMove',
		'touchend .overlay': 'onOverlayTouchMove'
	},

	initialize: function initialize(options) {
		ModalView.__super__.initialize.apply(this, arguments);

		var defaultButtons = {
			cancel: __('Cancel'),
			confirm: __('Ok')
		};

		if (!options.buttons)
			options.buttons = defaultButtons;

		this.buttons = options.buttons;
		this.enables = {
			confirm: true,
			cancel: true
		};
		this.rendered = false;
	},

	render: function render() {
		this.rendered = true;
		this.closed = false;
		this.$el.removeClass('closed');
		this.$el.html(this.template());

		this.cache.$container = this.findPlaceholder('container');

		if (this.getTitle()) {
			var title = $('<h1>')
				.addClass('title')
				.text(this.getTitle());
			this.$el.find('.container')
				.addClass('withTitle')
				.prepend(title);
		}

		this.renderToolbar();

		this.cache.height = this.$el.height();
		this.cache.scrollHeight = this.el.scrollHeight;

		return this;
	},

	renderToolbar: function renderToolbar() {
		if (this.cache.$toolbar) {
			this.cache.$toolbar.remove();
			this.cache.$toolbar = null;
		}

		// Toolbar
		if (!_.isEmpty(this.buttons)) {
			var self = this;
			var $toolbar = this.cache.$toolbar = $('<div>').addClass('toolbar');
			var $button;
			_.each(this.buttons, function (label, buttonName) {
				$button = $('<button>')
					.attr({
						'data-button-name': buttonName,
					})
					.addClass('button')
					.addClass(buttonName)
					.text(label)
					.appendTo($toolbar);

				if (self.enables[buttonName] === false) 
					$button.attr('disabled', 'disabled');
			});
			$toolbar.appendTo(this.$el.find('.container'));
		}
	},

	setButtons: function setButtons(buttons, enables) {
		this.buttons = buttons;
		if (typeof enables === 'undefined') {
			var enables = {};
			var buttonCodes = _.keys(buttons);
			_(buttonCodes).forEach(function (aButtonCode) {
				enables[aButtonCode] = true;
			});
		}
		else {
			this.enables = enables;
		}

		if (this.rendered)
			this.renderToolbar();
	},

	cancel: function cancel(e) {
		if (e) e.preventDefault();
		if (this.onCancel)
			this.onCancel();
		this.trigger('cancel');
	},

	onButtonClick: function onButtonClick(e) {
		if (e) e.preventDefault();
		var $target = $(e.target);
		var buttonName = $target.attr('data-button-name');
		if (this.cache[buttonName]) return;
		this.cache[buttonName] = true;
		var callbackFunction = 'on' + _s.capitalize(buttonName);
		var triggerEvent = true;
		if (callbackFunction in this) {
			triggerEvent = this[callbackFunction]() !== false;
		}
		if (triggerEvent)
			this.trigger(buttonName);
		var self = this;
		setTimeout(function () {
			self.cache[buttonName] = false;
		}, 300);
	},

	setButtonEnabled: function setButtonEnabled(buttonName, enabled) {
		this.enables[buttonName] = enabled;
		if (this.enables[buttonName])
			this.$el.find('[data-button-name="' + buttonName + '"]').removeAttr('disabled');
		else
			this.$el.find('[data-button-name="' + buttonName + '"]').attr('disabled', 'disabled');
	},

	isButtonEnabled: function isButtonEnabled(buttonName) {
		return this.enabled[buttonName];
	},

	getTitle: function getTitle() {
		return this.title;
	},

	setTitle: function setTitle(newValue) {
		this.title = newValue;
	},

	close: function close() {
		this.getContext().viewstack.popView(this, { animated: true });
	},

	onOverlayTouchMove: function onOverlayTouchMove(e) {
		e.preventDefault();
	}

});


