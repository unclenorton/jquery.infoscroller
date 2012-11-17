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

		this.each(function(i) {
			console.log($(this));
			html2canvas( [this], {
				onrendered: function( canvas ) {

					$('.scroller').addClass('loaded');

					var canvasHeight = $(canvas).attr('height'),
						canvasWidth = $(canvas).attr('width'),
						scaledCanvasHeight = canvasHeight * (150 / canvasWidth),
						overflow = scaledCanvasHeight - $(window).height(),
						ratio = scaledCanvasHeight / canvasHeight;
					
					// Ensure the positive overflow
					overflow = (overflow > 0) ? overflow : 0;

					$(canvas).css({
						width : 150,
						height : scaledCanvasHeight
					});

					$('.scroller__canvas').append($(canvas));
					$('.scroller__handle').height($(window).height() * ratio);

					$(window).scroll(function (e) {
						var st = $(this).scrollTop(),
							percentage = st / (canvasHeight - $(window).height()),
							overflowOffset = overflow * percentage;

						$('.scroller__canvas').css({
							'margin-top' : -overflowOffset
						});

						$('.scroller__handle').css({
							top : st * ratio - overflowOffset
						});

						
					});
				}
			});
		});

		return this;
	};

})(jQuery);