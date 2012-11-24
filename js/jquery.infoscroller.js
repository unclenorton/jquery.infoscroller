/**
 * @author Dmitry Kharchenko (unclenorton@gmail.com)
 * @version 0.2
 * @date 2012-11-17
 * @requires jQuery 1.7.2
 *
 */

(function($) {
	"use strict";

	$.infoscroller = $.infoscroller || {
		version: '1.0'
	};

	//Default parameters
	$.infoscroller.conf = {

	};

	$.infoscroller.isMobileBrowser = (navigator.userAgent.match(/Android/i) ||
			 navigator.userAgent.match(/webOS/i) ||
			 navigator.userAgent.match(/iPhone/i) ||
			 navigator.userAgent.match(/iPod/i) ||
			 navigator.userAgent.match(/iPad/i) ||
			 navigator.userAgent.match(/BlackBerry/)
			 );

	$.fn.infoscroller = function(conf) {

		//Extend defaults
		conf = $.extend($.infoscroller.conf, conf);
		$.infoscroller.workingConf = conf;

		$.infoscroller.wHeight = $(window).height();
		$.infoscroller.canvasHeight = $(this).outerHeight();
		$.infoscroller.canvasWidth = $(this).outerWidth();

		var	scaledCanvasHeight = Math.floor($.infoscroller.canvasHeight * (150 / $.infoscroller.canvasWidth)),
			overflow = scaledCanvasHeight - $.infoscroller.wHeight,
			ratio = scaledCanvasHeight / $.infoscroller.canvasHeight;

		$.infoscroller.ratio = ratio;
		console.log($.infoscroller.canvasHeight);
		// Ensure the positive overflow
		$.infoscroller.overflow = (overflow > 0) ? overflow : 0;

		this.each(function(i) {
			html2canvas( [this], {
				simplifyText : true,
				allowTaint : false,
				width : 150 / ratio, // Ratio matters when visualizing part of the page
				height: scaledCanvasHeight,
				scale : ratio,
				onrendered: function( canvas ) {

					$('.scroller').addClass('loaded');

					// IE fix
					$(canvas).css({
						width : 150,
						height : scaledCanvasHeight
					});

					$('.scroller__canvas').append($(canvas));
					$('.scroller__handle')
						.height($.infoscroller.wHeight * ratio)
						.on('mousedown', startDrag);

					$(window).scroll(onScroll);
				}
			});
		});

		function setHandlePosition (percentage, scrollTop) {
			var overflowOffset = $.infoscroller.overflow * percentage;

			$('.scroller__canvas').css({
				'margin-top' : -overflowOffset
			});

			$('.scroller__handle').css({
				top : scrollTop * $.infoscroller.ratio - overflowOffset
			});
		}

		function startDrag(e) {
			$.infoscroller.startY = e.clientY;
			$.infoscroller.handleStartY = $('.scroller__handle').position().top;
			$('html').on('mousemove', onDrag)
					.on('mouseup', endDrag)
					.addClass('g-unselectable');
		}

		function onDrag(e) {
			
			// Get offset
			var offset = e.clientY - $.infoscroller.startY,
				handlePos = $.infoscroller.handleStartY + offset,
				percentage = handlePos / ($.infoscroller.wHeight * (1 - $.infoscroller.ratio)),
				overflowOffset = $.infoscroller.overflow * percentage;

			handlePos = (handlePos > 0) ? handlePos : 0;

			$(window).scrollTop((handlePos + overflowOffset) / $.infoscroller.ratio);
		}

		function onScroll(e) {
			// Get percentage
			var st = $(this).scrollTop(),
				percentage = st / ($.infoscroller.canvasHeight - $.infoscroller.wHeight);
			setHandlePosition(percentage, st);
		}

		function endDrag() {
			$('html').off('mousemove', onDrag).removeClass('g-unselectable');
		}

		return this;
	};

})(jQuery);