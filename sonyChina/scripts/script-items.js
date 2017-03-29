$(function(){
	// 使用data()来自定义函数
	// $(".items li").each(function(){
	// 	$(this).data("firstX",0);
	// 	$(this).data("firstY",0);
	// 	$(this).data("lastX",0);
	// 	$(this).data("lastY",0);
	// 	$(this).data("outX",0);
	// 	$(this).data("outY",0);
	// });

	var showDes = function(e, liObject){
		//可以用来和事件处理函数绑定
		//也可以在事件处理函数内部直接调用，但是需要第二个参数
		//在事件处理函数内部调用，其this指向。。我不知道QAQ【回去翻《JS语言精粹》OTZ
		var $this = liObject || $(this);

		var w = $this.width();		
		var h = $this.height();
		var offset = $this.offset();
		var relativeX = (e.pageX - offset.left);
		var relativeY = (e.pageY - offset.top);
		var $cover = $this.find("div");
		
		if($cover.css("display") == "none"){
			if(relativeX > w/h*relativeY && relativeX <= w - w/h*relativeY){
				$cover.css("left",0);
				$cover.css("top",-h);
				$cover.css("display","block");
				$cover.animate({top:'+='+h},'fast');
			}
			else if(relativeX <= w/h*relativeY && relativeX < w - w/h*relativeY){
				$cover.css("left",-w);
				$cover.css("top",0);
				$cover.css("display","block");
				$cover.animate({left:'+='+w},'fast');
			}
			else if(relativeX < w/h*relativeY && relativeX >= w - w/h*relativeY){
				$cover.css("top",h);
				$cover.css("left",0);
				$cover.css("display","block");
				$cover.animate({top:'-='+h},'fast');
			}
			else if(relativeX >= w/h*relativeY && relativeX > w - w/h*relativeY){
				$cover.css("top",0);
				$cover.css("left",w);
				$cover.css("display","block");
				$cover.animate({left:'-='+w},'fast');
			}
		}
	};

	var hideDes = function(e, liObject){
		var $this = liObject || $(this);

		var w = $this.width();
		var h = $this.height();
		var offset = $this.offset();
		var relativeX = (e.pageX - offset.left);
		var relativeY = (e.pageY - offset.top);
		var $cover = $this.find("div");

		if($cover.css("display") == "block"){
			if(relativeX > w/h*relativeY && relativeX <= w - w/h*relativeY){
				$cover.animate({top:'-='+h},'fast',function(){
					$cover.css("display","none");	
				});
			}
			else if(relativeX <= w/h*relativeY && relativeX < w - w/h*relativeY){
				$cover.animate({left:'-='+w},'fast',function(){
					$cover.css("display","none");	
				});
			}
			else if(relativeX < w/h*relativeY && relativeX >= w - w/h*relativeY){
				$cover.animate({top:'+='+h},'fast',function(){
					$cover.css("display","none");	
				});
			}
			else if(relativeX >= w/h*relativeY && relativeX > w - w/h*relativeY){
				$cover.animate({left:'+='+w},'fast',function(){
					$cover.css("display","none");	
				});
			}
		}
	};

	var preventDefaultFunc = function(e){
		//注意“return false;”包含三个事件！！
		e.preventDefault();
	};

	var clickDes = function(e){
		if(!$(this).hasClass("selected")){
			// var ex = e.pageX;
			// var ey = e.pageY;

			//记得好像是《语言精粹》还是《DOM编程艺术》里说，
			//为了让子方法共用父方法的this，可以利用一个that
			//原因记不清了OTZ
			//但是这里直接传入$(this)即可的样子OAO。。
			//var that = $(this);
			showDes(e,$(this));

			//jq的find()函数，就算没有找到符合的，也会返回一个object
			//所以判断到底有没有找到符合的，要通过判断结果的length值！或者
			//if($selected[0]) <====> if($selected.length)
			var $selected = $(this).parent("ul.items").find(".selected");
			if($selected.length !== 0){
				hideDes(e, $selected);
				$selected.removeClass("selected");
			}				
			
			$(this).addClass("selected");

			//当被selected的时候，取消对应的“a”的阻止点击默认事件
			//这样，在selected状态下，点击可触发跳转链接
			//并对siblings的“a”阻止点击默认事件，使过去被selected过的不能跳转
			$(this).find("a").unbind("click",preventDefaultFunc);
			$(this).siblings().find("a").bind("click",preventDefaultFunc);
		}
	};

	var resetSelected = function(){
		var $selected = $(".items").find(".selected");
		if($selected.length !== 0){
			$selected.find("div").css("display","none");
			$selected.removeClass("selected");
		}
	};


	if(window.matchMedia('(max-width: 750px)').matches){
		$(".items li a").bind("click",preventDefaultFunc);
		$(".items li").bind("click",clickDes);
	} else {
		$(".items li").bind("mouseover",showDes);
		$(".items li").bind("mouseleave",hideDes);
	}

	$(window).resize(function(){
		if(window.matchMedia('(max-width: 750px)').matches){
			$(".items li").unbind("mouseover",showDes);
			$(".items li").unbind("mouseleave",hideDes);
			$(".items li a").bind("click",preventDefaultFunc);
			$(".items li").bind("click",clickDes);
		} else {
			$(".items li a").unbind("click",preventDefaultFunc);
			$(".items li").unbind("click",clickDes);
			resetSelected();
			$(".items li").bind("mouseover",showDes);
			$(".items li").bind("mouseleave",hideDes);
		}
	});
});