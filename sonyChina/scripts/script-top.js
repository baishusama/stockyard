$(function(){
	$(".abso-nav").fadeOut();
	$(".back-to-top a").click(function(){
		$("html,body").animate({scrollTop:$(".header").offset().top},500);	
		return false;
	});

	var absoNavFade = function(){
		var s = $(window).scrollTop();
		if(s > 300){
			$(".abso-nav").fadeIn();
			// $(".back-to-top").css("visibility","visible");
			// $(".back-to-top").animate({opacity:1},500);
		} else {
			$(".abso-nav").fadeOut();
			// $(".back-to-top").animate({opacity:0},500,function(){
			// 	$(".back-to-top").css("visibility","hidden");
			// });
		}
	};

	if(window.matchMedia('(max-width: 750px)').matches){
		//在css对应的media query里写了"display:none"所以。。
		$(window).unbind("scroll",absoNavFade);
	} else {
		$(window).bind("scroll",absoNavFade);	
	}

	$(window).resize(function(){
		// $(".abso-nav").fadeOut();
		if(window.matchMedia('(max-width: 750px)').matches){
			$(".abso-nav").fadeOut();
			$(window).unbind("scroll",absoNavFade);
		} else {
			//防止重复绑定事件
			$(window).unbind("scroll",absoNavFade);
			$(window).bind("scroll",absoNavFade);
		}
	});
});