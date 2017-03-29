$(function(){
	var page = 1;
	var page_count = 4;
	var width_perc = '100%';//100%？JS里没有百分数OTZ！！

	/*
	var Tween = {
		Quad:{
			easeOut: function(t,b,c,d){
				return -c *(t/=d)*(t-2) + b;
			}
		}
	};
	function tweenMove(t,b,c,d){	
	}
	*/

	$(".banner-btn.prev").click(function(){
		var $parent = $(this).parents(".banner");
		var $content = $parent.find(".banner-content");
		var $ul = $content.find("ul");
		var $nav = $parent.find(".banner-nav");

		//var width = $content.css("width");【×【这么写得到的是字符串！！】
		//var width = $content.width();【√

		if(!$ul.is(":animated")){
			if(page === 1){
				var $last = $ul.children().eq(3);
				$ul.prepend($last);
				$ul.css("left",'-='+width_perc);
				$ul.animate({left:'+='+width_perc},'fast',function(){
					$ul.append($last);
					$ul.css("left",'-'+(parseInt(width_perc)*3)+'%');//注意'100%'会被parseInt为数值100！
				});
				page = 4;
			} else {
				$ul.animate({left:'+='+width_perc},'fast');
				page--;
			}
			
			// 与大多数 jQuery 方法一样，
			// .children() 不返回文本节点；
			// 如果需要获得包含文本和注释节点在内的所有子节点，请使用 .contents()。
			// 不要误解上面这些话的意思。

			// 注意，.eq(3)不是指内容等于三，是指第四个元素！


			// 写法1：$nav.find(".selected").removeClass("selected").parent(".banner-nav").children().eq(page-1).addClass("selected");
			// 写法2：$parent.find(".banner-nav").find("span").eq(page-1).addClass("selected").siblings().removeClass("selected");
			$nav.children().eq(page-1).addClass("selected").siblings().removeClass("selected");//一种可行的写法！
		}
	});

	$(".banner-btn.next").click(function(){
		var $parent = $(this).parents(".banner");
		var $content = $parent.find(".banner-content");
		var $ul = $content.find("ul");
		var $nav = $parent.find(".banner-nav");

		//var width = $content.css("width");

		if(!$ul.is(":animated")){
			if(page === page_count) {
				var $first = $ul.children().eq(0);
				$ul.append($first);
				$ul.css("left",'+='+width_perc);
				$ul.animate({left:'-='+width_perc},'fast',function(){
					$ul.prepend($first);
					$ul.css("left",0+'%');//注意为了统一（%）//没有单位的话，默认px，不过0px其实也无妨
				});
				page = 1;
			} else {
				$ul.animate({left:'-='+width_perc},'fast');
				page++;
			}
			$nav.children().eq(page-1).addClass("selected").siblings().removeClass("selected");//一种可行的写法！
		}
	});

	$(".banner-nav span").click(function(){
		var $parent = $(this).parents(".banner");//应该用parents不是parent。。。！
		var $content = $parent.find(".banner-content");
		var $ul = $content.find("ul");
		var $nav = $(this).parent(".banner-nav");//这里才用parent！

		//var width = $content.width();

		if(!$ul.is(":animated")){
			if(!$(this).hasClass("selected")){
				//alert(typeof $(this).html());
				//注意.html()得到的是字符串，不能直接赋值给page！TUT！！
				//【因为我上面判断用的是严格等于===所以。。。
				//【【所以讲道理，用这里用不严格相等是不是更好？？
				page = parseInt($(this).html());//应该对page进行更新！
				
				var step = $(this).html() - $nav.find(".selected").html();
				var move = parseInt(width_perc) * step + '%';
				$ul.animate({left:'-='+move},'fast');
				$(this).addClass("selected").siblings().removeClass("selected");
			}
		}
	});

	function autoNext(){
		var $parent = $(".banner");
		var $content = $parent.find(".banner-content");
		var $ul = $content.find("ul");
		var $nav = $parent.find(".banner-nav");

		if(page === page_count){
			var $first = $ul.children().eq(0);
			$ul.append($first);
			$ul.css("left",'+='+width_perc);
			$ul.animate({left:'-='+width_perc},'fast',function(){
				$ul.prepend($first);
				$ul.css("left",0+'%');//注意为了统一（%）//没有单位的话，默认px，不过0px其实也无妨
			});
			page = 1;
		} else {
			$ul.animate({left:'-='+width_perc},'fast');
			page++;
		}
		$nav.children().eq(page-1).addClass("selected").siblings().removeClass("selected");
	}

	var intervalObj = window.setInterval(autoNext,3000);
	$(".banner").mouseover(function(){
		window.clearInterval(intervalObj);
	});
	$(".banner").mouseout(function(){
		intervalObj = window.setInterval(autoNext,3000);
	});
});