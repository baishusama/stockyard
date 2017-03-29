$(function(){
	var $firNav = $(".nav").children("li.fir-nav");
	var $firA = $firNav.children("a");
	var $secNav = $firNav.children("ul.sec-nav");


	$firA.click(function(event){
		event.preventDefault();
	});//阻止一级菜单栏里的父li元素的点击跳转

	var mouseenterFunc = function(){
		$secNav.css("display","block");
	};
	var mouseleaveFunc = function(){
		$secNav.css("display","none");
	};

	var clickObj = {
		counter : 0,
		click : function(){
			if(!$secNav.is(":animated")){
				if(this.counter == 0){//$secNav.css("display","block");
					// var w = $secNav.width();
					var h = $secNav.height();//虽然想不太明白，但是这里每次取到的值都是固定的【好神奇！明明secNav的高度被改了啊OAO
					$secNav.css("width",0);
					$secNav.css("height",0);
					$secNav.css("opacity",0);
					$secNav.css("display","block");
					$secNav.animate({opacity:'+='+1,width:'+=90%',height:'+='+h},'normal');
					//alert('I changed it from 0 to 1');
					this.counter = 1;
				}
				else if(this.counter == 1){//$secNav.css("display","none");
					// var w = $secNav.width();
					var h = $secNav.height();
					$secNav.animate({opacity:'-='+1,width:'-=90%',height:'-='+h},'normal',function(){
						$secNav.css("display","none");
						$secNav.css("opacity",1);
						$secNav.css("width",'auto');//这句好像也不能少OTZ不然高度会蜜汁增长。。
						$secNav.css("height",'auto');//这为下次点击h的提取做了准备！
					});
					//alert('I changed it from 1 to 0');
					this.counter = 0;
				}
			}
		},
		reset : function(){
			$secNav.css("display","none");
			$secNav.css("width",'auto');
			$secNav.css("height",'auto');
			this.counter = 0;
		}
	};

	var clickFunc = function(){
		clickObj.click();
	};
	var resetFunc = function(){
		clickObj.reset();
	};

	if(window.matchMedia('(max-width: 750px)').matches){
		$firNav.removeClass("hover-show-sec");
		$firA.on("click.show",clickFunc);
	} else {}

	$(window).resize(function(){
		if(window.matchMedia('(max-width: 750px)').matches){
			if($firNav.hasClass("hover-show-sec")){
				$firNav.removeClass("hover-show-sec");
			}
			$firNav.off(".imitate");

			$firA.off("click.show");//避免重复绑定？
			$firA.on("click.show",clickFunc);
		} else {
			resetFunc();//初始化secNav状态

			if(!$firNav.hasClass("hover-show-sec")){
				$firNav.addClass("hover-show-sec");
			}
			$firNav.on("mouseenter.imitate",mouseenterFunc);
			$firNav.on("mouseleave.imitate",mouseleaveFunc);

			$firA.off("click.show");
		}
	});
});