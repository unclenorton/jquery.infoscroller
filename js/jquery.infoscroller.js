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
				/* canvas is the actual canvas element, 
				   to append it to the page call for example 
				   document.body.appendChild( canvas );
				*/
					$('.scroller__canvas').append($(canvas));
				}
			});
		});

		return this;
	};

})(jQuery);