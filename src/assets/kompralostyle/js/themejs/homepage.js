 
 $('.slider-for').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: '.slider-nav'
});
$('.slider-nav').slick({
  slidesToShow: 8,
  slidesToScroll: 1,
  asNavFor: '.slider-for',
  dots: false,
  centerMode: false,
  focusOnSelect: true,
   responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToScroll: 1,
				slidesToShow: 8
			}
		},
		{
			breakpoint: 1199,
			settings: {
				slidesToScroll: 1,
				slidesToShow: 6
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToScroll: 1,
				slidesToShow: 6,
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToScroll: 1,
				slidesToShow: 3,
			}
		}
	]
});

 
/* ---------------------------------------------------
	Owl carousel - Slider
-------------------------------------------------- */
$(document).ready(function ($) {
	"use strict";
	// Content slider
	$('.yt-content-slider').each(function () {
		var $slider = $(this),
			$panels = $slider.children('div'),
			data = $slider.data();
		// Remove unwanted br's
		//$slider.children(':not(.yt-content-slide)').remove();
		// Apply Owl Carousel
		
		$slider.owlCarousel2({
			responsiveClass: true,
			mouseDrag: true,
			video:true,
    		lazyLoad: (data.lazyload == 'yes') ? true : false,
			autoplay: (data.autoplay == 'yes') ? true : false,
			autoHeight: (data.autoheight == 'yes') ? true : false,
			autoplayTimeout: data.delay * 1000,
			smartSpeed: data.speed * 1000,
			autoplayHoverPause: (data.hoverpause == 'yes') ? true : false,
			center: (data.center == 'yes') ? true : false,
			loop: (data.loop == 'yes') ? true : false,
            dots: (data.pagination == 'yes') ? true : false,
            nav: (data.arrows == 'yes') ? true : false,
			dotClass: "owl2-dot",
			dotsClass: "owl2-dots",
            margin: data.margin,
            navText: ['',''],
			
			responsive: {
				0: {
					items: data.items_column4 
					},
				480: {
					items: data.items_column3
					},
				768: {
					items: data.items_column2
					},
				992: { 
					items: data.items_column1
					},
				1200: {
					items: data.items_column0 
					},
				1650: {
					items: data.items_column00 
				}
			}
		});
		
	});
	
	/*function buttonpage(element){
		var $element = $(element),
			$slider = $(".yt-content-slider", $element),
			data = $slider.data();
		if (data.buttonpage == "top") {
			$(".owl2-controls",$element).insertBefore($slider);
			$(".owl2-dots",$element).insertAfter($(".owl2-prev", $slider));
		} else {
			$(".owl2-nav",$element).insertBefore($slider);
			$(".owl2-controls",$element).insertAfter($slider);
		}	
	}
	
	// Home 1 - Latest Blogs
	(function (element) {
		buttonpage(element);
	})(".blog-sidebar");
	
	(function (element) {
		buttonpage(element);
	})("#so_extra_slider_1");
	
	(function (element) {
		buttonpage(element);
	})("#so_extra_slider_2");*/

}); 


// click header search header 
$(document).ready(function($) {
	$( ".search-header-w .icon-search" ).click(function() {
	$('#sosearchpro .search').slideToggle(200);
	$(this).toggleClass('active');
	});
});

 