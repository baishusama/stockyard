$(function(){
	var $firNav = $(".nav").children("li").eq(0);
	//var $firA = $firNav.children().eq(0);
	var $secNav = $firNav.find("ul");


	// var toggleSecNav = function(){
	// 	$secNav.toggle('slow');
	// };

	var clickObj = {
		counter : 0,
		click : function(obj){
			// if(counter === 0){
			// 	obj.css("display", "block");
			// 	alert("clicked!");
			// 	counter = 1;
			// } 
			// else if (counter === 1){
			// 	obj.css("display", "none");
			// 	alert("clicked again!");
			// 	counter = 0;
			// }
			alert(obj);
		},
		reset : function(obj){
			if (counter === 1){
				obj.css("display", "none");
				counter = 0;
			}
		}
	};

	var showSecNav = function(){
		$secNav.css("display", "block");
	};
	var hideSecNav = function(){
		$secNav.css("display", "none");
	};

	var hoverShowOn = function(){
		// $(".nav").on("hover",".hover-show-sec",function(){
		// 	//$(this).find(".sec-nav").toggle("slow");
		// 	$secNav.toggle('slow');
		// });
		$(".nav").on({
			mouseenter : showSecNav,
			mouseleave : hideSecNav
		});
	};

	var hoverShowOff = function(){
		$(".nav").off({
			mouseenter : showSecNav,
			mouseleave : hideSecNav
		});
	};

	var ableClick = function(){
		// if($firNav.hasClass("hover-show-sec")){
		// 	$firNav.removeClass("hover-show-sec");
		// 	//alert("removed!");
		// }
		hoverShowOff();
		// $firNav.unbind("click",toggleSecNav);//防止重复绑定事件
		// $firNav.bind("click",toggleSecNav);
		
		//$firNav.on("click", clickObj.click($secNav));
	};

	var unableClick = function(){
		// if(!$firNav.hasClass("hover-show-sec")){
		// 	$firNav.addClass("hover-show-sec");
		// 	//alert("added!");
		// }
		hoverShowOn();
		// $firNav.bind("click",toggleSecNav);//防止重复绑定事件
		// $firNav.unbind("click",toggleSecNav);	
		

		//$firNav.off("click", clickObj.click($secNav));
		//clickObj.reset($secNav);
	};


	//hoverShowOn();//期望：覆盖CSS的hover事件

	if(window.matchMedia('(max-width: 750px)').matches){
		ableClick();
	} else {}

	$(window).resize(function(){
		if(window.matchMedia('(max-width: 750px)').matches){
			ableClick();
		} else {
			unableClick();
		}
	});
});