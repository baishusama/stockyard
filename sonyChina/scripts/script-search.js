$(function(){
	var hideForm = function (){
		$("#search-form").attr("class","hide");
	};
	var showForm = function (){
		$("#search-form").attr("class","");
	};
	var checkThenHide = function(){
		var isFocus = $("#search-text").is(":focus");
		if(!isFocus){
			hideForm();
		}
	};//其实下面的hideform可以全改成checkThenHide_(:зゝ∠)_

	var bindForm = function(){		
		$("#search-form").bind("mouseover",showForm);
		$("#search-form").bind("mouseout",checkThenHide);
	};
	var unbindForm = function(){
		$("#search-form").unbind("mouseover",showForm);
		$("#search-form").unbind("mouseout",checkThenHide);
	};
	var bindBlur = function(){
		$("#search-text").bind("blur",hideForm);
	};
	var unbindBlur = function(){
		$("#search-text").unbind("blur",hideForm);
	};

	var closeAndDelete = function(){
		$("#search-text").val("");
		unbindForm();
		hideForm();
	};
	var onlyDelete = function(){
		$("#search-text").val("");
	};


	function flexibleSearch(){
		//绑定初始化
		hideForm();
		bindForm();
		bindBlur();

		/*
			解决输入框获得焦点的情况下，点击search-btn或
			close-btn输入框直接收回的bug。
		*/
		$("#search-btn").bind("mouseover",unbindBlur);
		$("#search-btn").bind("mouseout",bindBlur);
		$("#close-btn").bind("mouseover",unbindBlur);
		$("#close-btn").bind("mouseout",bindBlur);

		/*
			单击close-btn清除输入内容并收回输入框。
			第二行的unbindForm用来解决，单击后，鼠标停留在原处
			（mouseover search-form）导致的直接展开的bug。
		*/
		$("#close-btn").bind("click",closeAndDelete);
		
		/*
			也是用来解决，单击后，鼠标停留在原处
			（mouseover search-form）导致的直接展开的bug的。
			只有鼠标离开search-form本身（而不是子元素）
			才重新绑定回去。
		*/
		//如果用mouseout的话就不行了qwq！
		//！mouseout VS mouseleave ！
		$("#search-form").bind("mouseleave",bindForm);
	}

	function fixedSearch(){
		//解绑定初始化
		showForm();
		unbindForm();
		unbindBlur();

		$("#search-btn").unbind("mouseover",unbindBlur);
		$("#search-btn").unbind("mouseout",bindBlur);		
		$("#close-btn").unbind("mouseover",unbindBlur);
		$("#close-btn").unbind("mouseout",bindBlur);
		$("#close-btn").unbind("click",closeAndDelete);
		$("#search-form").unbind("mouseleave",bindForm);

		$("#close-btn").bind("click",onlyDelete);
	}


	if(window.matchMedia('(max-width: 750px)').matches){
		// alert($(window).width() + " x " + $(window).height());
		fixedSearch();
	} else {
		flexibleSearch();
	}

	$(window).resize(function(){
		if(window.matchMedia('(max-width: 750px)').matches){
			// alert($(window).width() + " x " + $(window).height());
			fixedSearch();
		} else {
			flexibleSearch();
		}
	});	
});