 

$(document).ready(function(){
 
$(window).load(function() {
	// Animate loader off screen
	$('body').addClass('loaded');
});
 
    var hasTooltip = $("[data-toggle='tooltip']").tooltip();
	hasTooltip.on('click', function () {
		    $(this).tooltip('hide')
	});
 
	$(".header-top-right .top-link > li").mouseenter(function(){
		$(".header-top-right .top-link > li.account").addClass('inactive');
	});
	$(".header-top-right .top-link > li").mouseleave(function(){
		$(".header-top-right .top-link > li.account").removeClass('inactive');
	});
	$(".header-top-right .top-link > li.account").mouseenter(function(){
		$(".header-top-right .top-link > li.account").removeClass('inactive');
	});
 
	$(".collapsed-block .expander").click(function (e) {
        var collapse_content_selector = $(this).attr("href");
        var expander = $(this);
		
        if (!$(collapse_content_selector).hasClass("open")) {
			expander.addClass("open").html("<i class='fa fa-angle-up'></i>") ;
		}
		else expander.removeClass("open").html("<i class='fa fa-angle-down'></i>");
		
		if (!$(collapse_content_selector).hasClass("open")) $(collapse_content_selector).addClass("open").slideDown("normal");
        else $(collapse_content_selector).removeClass("open").slideUp("normal");
        e.preventDefault()
    })
 
$(".back-to-top").addClass("hidden-top");
	$(window).scroll(function () {
	if ($(this).scrollTop() === 0) {
		$(".back-to-top").addClass("hidden-top")
	} else {
		$(".back-to-top").removeClass("hidden-top")
	}
});

$('.back-to-top').click(function () {
	$('body,html').animate({scrollTop:0}, 1200);
	return false;
});	
 
 
 

	

});


 
$(function ($) {
    "use strict";
	//Quantity plus minus 
    $.initQuantity = function ($control) {
        $control.each(function () {
            var $this = $(this),
                data = $this.data("inited-control"),
                $plus = $(".input-group-addon:last", $this),
                $minus = $(".input-group-addon:first", $this),
                $value = $(".form-control", $this);
            if (!data) {
                $control.attr("unselectable", "on").css({
                    "-moz-user-select": "none",
                    "-o-user-select": "none",
                    "-khtml-user-select": "none",
                    "-webkit-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none"
                }).bind("selectstart", function () {
                    return false
                });
                $plus.click(function () {
                    var val =
                        parseInt($value.val()) + 1;
                    $value.val(val);
                    return false
                });
                $minus.click(function () {
                    var val = parseInt($value.val()) - 1;
                    $value.val(val > 0 ? val : 1);
                    return false
                });
                $value.blur(function () {
                    var val = parseInt($value.val());
                    $value.val(val > 0 ? val : 1)
                })
            }
        })
    };
    $.initQuantity($(".quantity-control"));
    $.initSelect = function ($select) {
        $select.each(function () {
            var $this = $(this),
                data = $this.data("inited-select"),
                $value = $(".value", $this),
                $hidden = $(".input-hidden", $this),
                $items = $(".dropdown-menu li > a", $this);
            if (!data) {
                $items.click(function (e) {
                    if ($(this).closest(".sort-isotope").length >
                        0) e.preventDefault();
                    var data = $(this).attr("data-value"),
                        dataHTML = $(this).html();
                    $this.trigger("change", {
                        value: data,
                        html: dataHTML
                    });
                    $value.html(dataHTML);
                    if ($hidden.length) $hidden.val(data)
                });
                $this.data("inited-select", true)
            }
        })
    };
    $.initSelect($(".btn-select"));
	
	if(!window.startRangeValues) return;
	var startValues = window.startRangeValues,
		min = startValues[0].toFixed(2),
		max = startValues[1].toFixed(2);

	$('.filter_reset').on('click', function(){

		var form = $(this).closest('form'),
			range = form.find('.range');

			console.log(startValues);

		// form.find('#slider').slider('option','values', startValues);

		form.find('#slider').slider('values', 0, min);
		form.find('#slider').slider('values', 1, max);

		form.find('.options_list').children().eq(0).children().trigger('click');

		range.children('.min_value').val(min).next().val(max);

		range.children('.min_val').text('$' + min).next().text('$' + max);

	});
	
	
});

/* ---------------------------------------------------
	Owl carousel - Slider
-------------------------------------------------- */


/* ---------------------------------------------------
	Other Query
-------------------------------------------------- */
$(document).ready(function($) {
	$('.date').datetimepicker({
		pickTime: false
	});
});

 
 
 

$(document).ready(function() {
	
	
	var zoomCollection = '.large-image img';
	$( zoomCollection ).elevateZoom({
		zoomType    : "inner",
		lensSize    :"200",
		easing:true,
		gallery:'thumb-slider',
		cursor: 'pointer',
		
		galleryActiveClass: "active"
	});
	$('.large-image').magnificPopup({
		items: [
			{src: 'image/catalog/demo/product/fashion/1.jpg' },
			{src: 'image/catalog/demo/product/fashion/2.jpg' },
			{src: 'image/catalog/demo/product/fashion/3.jpg' },
			{src: 'image/catalog/demo/product/fashion/4.jpg' },
			{src: 'image/catalog/demo/product/fashion/5.jpg' },
		],
		gallery: { enabled: true, preload: [0,2] },
		type: 'image',
		mainClass: 'mfp-fade',
		callbacks: {
			open: function() {
				
				var activeIndex = parseInt($('#thumb-slider .img.active').attr('data-index'));
				var magnificPopup = $.magnificPopup.instance;
				magnificPopup.goTo(activeIndex);
			}
		}
	});
	$("#thumb-slider .owl2-item").each(function() {
		$(this).find("[data-index='0']").addClass('active');
	});
	
 
	$('.product-options li.radio').click(function(){
		$(this).addClass(function() {
			if($(this).hasClass("active")) return "";
			return "active";
		});
		
		$(this).siblings("li").removeClass("active");
		$(this).parent().find('.selected-option').html('<span class="label label-success">'+ $(this).find('img').data('original-title') +'</span>');
	});
	// Product detial reviews button
	$(".reviews_button,.write_review_button").click(function (){
		var tabTop = $(".producttab").offset().top;
		$("html, body").animate({ scrollTop:tabTop }, 1000);
	});
	
	
});



