$(function(){
	if(window.matchMedia('(max-width: 750px)').matches){
		$("div.menu").hide();
	} else {
		$("div.menu").show();
	}

	$(window).resize(function(){
		if(window.matchMedia('(max-width: 750px)').matches){
/* 卧槽你和media query对窗口宽度的理解不一样么卧槽 */
			$("div.menu").hide();
		} else {
			$("div.menu").show();
		}
	});

	$("img#menu").click(function(){
		$("div.menu").toggle('slow');
	});/*不能放到resize里面绑定啊qwq不然会绑定很多的样子OTZ*/


});