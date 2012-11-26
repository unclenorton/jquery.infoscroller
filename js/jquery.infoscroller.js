/**
 * @author Dmitry Kharchenko (unclenorton@gmail.com)
 * @version 0.2
 * @date 2012-11-17
 * @requires jQuery 1.7.2
 *
 */

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.

;(function ( $, window, undefined ) {
	"use strict";

	// Create the defaults once
	var pluginName = 'infoscroller',
		document = window.document,
		defaults = {
			width : 150,
			container : '.scroller',
			canvas : '.scroller__canvas',
			handle : '.scroller__handle',
			unselectableClass : 'g-unselectable',
			loadedClass : 'scroller_loaded'
		};

	// The actual plugin constructor
	function Plugin( element, options ) {
		this.element = element;

		this.options = $.extend( {}, defaults, options) ;

		this._defaults = defaults;
		this._name = pluginName;

		this._isMobileBrowser = (navigator.userAgent.match(/Android/i) ||
			 navigator.userAgent.match(/webOS/i) ||
			 navigator.userAgent.match(/iPhone/i) ||
			 navigator.userAgent.match(/iPod/i) ||
			 navigator.userAgent.match(/iPad/i) ||
			 navigator.userAgent.match(/BlackBerry/)
			 );

		// Cache DOM objects
		this.jContainer = $(this.options.container);
		this.jCanvas = $(this.options.canvas);
		this.jHandle = $(this.options.handle);

		// Define _self for global context
		var _self = this;


		// Private functions
		function _onResize (e) {
			_self.wHeight = $(window).height();
			_self.canvasHeight = $(_self.element).outerHeight();
			_self.canvasWidth = $(_self.element).outerWidth();

			var	scaledCanvasHeight = Math.floor(_self.canvasHeight * (_self.options.width / _self.canvasWidth)),
			overflow = scaledCanvasHeight - _self.wHeight,
			ratio = scaledCanvasHeight / _self.canvasHeight;

			_self.scaledHeight = scaledCanvasHeight;
			_self.ratio = ratio;
			// Ensure the positive overflow
			_self.overflow = (overflow > 0) ? overflow : 0;

			_self.jHandle.height(_self.wHeight * ratio);
		}

		function _setHandlePosition (percentage, scrollTop) {
			var overflowOffset = _self.overflow * percentage;

			_self.jCanvas.css({
				'margin-top' : -overflowOffset
			});

			_self.jHandle.css({
				top : scrollTop * _self.ratio - overflowOffset
			});
		}

		function _startDrag(e) {
			_self.startY = e.clientY;
			_self.handleStartY = _self.jHandle.position().top;

			$('html').on('mousemove', _onDrag)
					.on('mouseup mouseleave', _endDrag)
					.addClass(_self.options.unselectableClass);
		}

		function _onDrag(e) {
			
			// Get offset
			var offset = e.clientY - _self.startY,
				handlePos = _self.handleStartY + offset,
				percentage = handlePos / (_self.wHeight * (1 - _self.ratio)),
				overflowOffset = _self.overflow * percentage;

			handlePos = (handlePos > 0) ? handlePos : 0;

			$(window).scrollTop((handlePos + overflowOffset) / _self.ratio);
		}

		function _onScroll(e) {
			// Get percentage
			var st = $(this).scrollTop(),
				percentage = st / (_self.canvasHeight - _self.wHeight);

			_setHandlePosition(percentage, st);
		}

		function _endDrag() {
			$('html').off('mousemove', _onDrag).removeClass(_self.options.unselectableClass);
		}


		// Privileged functions 
		this.init = function () {
			if (!_self._isMobileBrowser) {
				// Set initial dimensions
				_onResize();

				html2canvas( [_self.element], {
					simplifyText : true,
					allowTaint : false,
					width : _self.options.width / _self.ratio, // Ratio matters when visualizing part of the page
					height: _self.scaledHeight,
					scale : _self.ratio,
					onrendered: function( canvas ) {

						_self.jContainer.addClass(_self.options.loadedClass);

						// IE fix
						$(canvas).css({
							width : _self.options.width,
							height : _self.scaledHeight
						});

						_self.jCanvas.append($(canvas));
						_self.jHandle.on('mousedown', _startDrag);

						$(window).scroll(_onScroll);
					}
				});
			} else {
				console.log('Mobile devices not supported.');
			}
		}

		this.bind = function () {
			if (typeof $.measurer !== 'undefined') {
				$.measurer.bind(_onResize);	
			} else {
				$(window).resize(_onResize);
			}
		}

		// Initialization
		this.bind();
		this.init();
	}

	// A really lightweight plugin wrapper around the constructor, 
	// preventing against multiple instantiations
	
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
		if (!$.data(this, 'plugin_' + pluginName)) {
			$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
		}
		});
	}

}(jQuery, window));