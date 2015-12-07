var _        = require('underscore');
var $        = require('jquery');
var BaseView = require('./BaseView');
// var work    = require('webworkify');

var ImageView = module.exports = BaseView.extend({

	tagName: 'figure',

	initialize: function initialize(options) {
		ImageView.__super__.initialize.apply(this, arguments);

		var self = this;
		this.loaded = false;

		this.addOptions({
			src: null,
			placeholder: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
			size: 'auto' // auto, normal, contain, cover
		});

		// Normal
		this.image = new Image();
		this.image.onload = function () {
			self.loaded = true;
			self.trigger('loaded', self.options.src);
			self.render();
		};
		if (this.options.src)
			this.image.src = this.options.src;

		this.placeholderImage = new Image();
		this.placeholderImage.src = this.options.placeholder;

		// Web Worker
		// this.imageLoader = work(require('./workers/imageLoader'));
		// this.imageLoader.addEventListener('message', function (ev) {
		// 	if (ev.data === 'success') {
		// 		self.el.src = self.options.src;
		// 		self.loaded = true;
		// 		self.trigger('loaded', self.options.src);
		// 	}
		// });
		//
		// if (this.options.src)
		// 	this.imageLoader.postMessage(this.options.src);
	},

	render: function render() {
		this.$el.empty();

		var image;
		var width;
		var height;

		if (this.loaded) {
			image  = this.image;
			width  = image.width;
			height = image.height;
		}
		else {
			image  = this.placeholderImage;
			width  = 1;
			height = 1;
		}

		var viewport = { width: this.$el.width(), height: this.$el.height() };
		var size = this.options.size;
		if (size !== 'normal') {

			var resized  = {};
			var cover    = size === 'cover';

			if ( size === 'auto')
				cover = width < height;

			var rapViewport = viewport.width / viewport.height;
			var rapImage    = width / height;

			if ( (cover === true && rapImage >= rapViewport) || (cover === false && rapImage <= rapViewport) ){
				resized.width = width * viewport.height / height;
				$(image).css({ height: '100%', width: 'auto', 'margin-top': viewport.height/-2, 'margin-left': resized.width/-2  });
				
			}else if ( (cover === true && rapImage < rapViewport) || (cover === false && rapImage > rapViewport) ) {
				resized.height = height * viewport.width / width;
				$(image).css({ width: '100%', height: 'auto', 'margin-top': resized.height/-2, 'margin-left': viewport.width/-2 });
			}
		}

		if (this.loaded) {
			this.$el.append(this.image);
		}
		else {
			this.$el.append(this.placeholderImage);
		}

		return this;
	},

	width: function width( val ){
		if ( typeof val !== 'undefined' )
			return this.image.width = val;
		return this.image.width || 0;
	},

	height: function height( val ){
		if ( typeof val !== 'undefined' )
			return this.image.height = val;
		return this.image.height || 0;
	},

	onDestroy: function onDestroy(){
		this.el.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	}

});
