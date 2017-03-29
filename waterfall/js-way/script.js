// function $(selector) {
//     if (selector[0] === '#') {
//         return document.getElementById(selector.slice(1));
//     } else if (selector[0] === '.') {
//         return document.getElementsByClassName(selector.slice(1));
//     }
// }

// 处理混杂模式和标准模式的 clientHeight 兼容性
function getClientHeight() {
    var clientHeight = 0;
    if (document.compatMode === 'CSS1Compat') {
        // 标准模式
        clientHeight = document.documentElement.clientHeight;
    } else if (document.compatMode === 'BackCompat') {
        clientHeight = document.body.clientHeight;
    }
    return clientHeight;
}

var water = (function() {
    var i = 0; // 计数器 i 用来避免重复计算定位
    var hArr = []; // 上一列的高度的数组
    var lastBoxOffsetTop = 0; // 用以计算何时继续加载瀑布流中的数据
    var parentId = "waterfall";
    var boxClassName = "box";
    var waterfall = document.getElementById(parentId);

    function getMinObj(array) {
        return array.reduce(function(min, val, index) {
            return (min.value < val) ? min : { "value": val, "index": index };
        }, { "value": array[0], "index": 0 });
    }

    function getMaxObj(array) {
        return array.reduce(function(max, val, index) {
            return (max.value > val) ? max : { "value": val, "index": index };
        }, { "value": array[0], "index": 0 });
    }

    function setPosition() {
        var boxs = waterfall.getElementsByClassName(boxClassName);

        // 瀑布流的 size
        var boxWidth = boxs[0].offsetWidth;
        // var wrapperWidth = document.documentElement.clientWidth;
        // var colNum = wrapperWidth / boxWidth;
        var colNum = 4; // temp

        // 瀑布流的定位
        for (; i < boxs.length; i++) {
            if (i < colNum) {
                hArr.push(boxs[i].offsetHeight);
            } else {
                // 获取上一列的最小高度
                var min = getMinObj(hArr);

                // 定位当前 box
                var top = min.value;
                var left = boxWidth * min.index;
                boxs[i].style.cssText = "position: absolute; top: " + top + "px; left: " + left + "px;";

                // 更新 hArr
                hArr[min.index] += boxs[i].offsetHeight;
            }
        }
        console.log(hArr);

        // 使 parent 的高度能够包含所有绝对定位的内容
        waterfall.style.cssText = "height: " + getMaxObj(hArr).value + "px;";

        // 更新 lastBoxOffsetTop
        lastBoxOffsetTop = boxs[i - 1].offsetTop; // i == boxs.length
    }

    function getLastOffsetTop() {
        return lastBoxOffsetTop;
    }

    function loadMore() {
        var images = [{
            name: "images/your-name-1",
            url: "images/your-name-1",
        }, {
            name: "images/your-name-2",
            url: "images/your-name-2",
        }, {
            name: "images/your-name-3",
            url: "images/your-name-3",
        }, {
            name: "images/your-name-4",
            url: "images/your-name-4",
        }, {
            name: "images/your-name-5",
            url: "images/your-name-5",
        }, {
            name: "images/your-name-6",
            url: "images/your-name-6",
        }, {
            name: "images/your-name-7",
            url: "images/your-name-7",
        }, {
            name: "images/your-name-8",
            url: "images/your-name-8",
        }, {
            name: "images/your-name-9",
            url: "images/your-name-9",
        }, {
            name: "images/your-name-10",
            url: "images/your-name-10",
        }, {
            name: "images/your-name-11",
            url: "images/your-name-11",
        }, {
            name: "images/your-name-12",
            url: "images/your-name-12",
        }, {
            name: "images/your-name-13",
            url: "images/your-name-13",
        }, {
            name: "images/your-name-14",
            url: "images/your-name-14",
        }, {
            name: "images/your-name-15",
            url: "images/your-name-15",
        }, {
            name: "images/your-name-16",
            url: "images/your-name-16",
        }, {
            name: "images/your-name-17",
            url: "images/your-name-17",
        }, {
            name: "images/your-name-18",
            url: "images/your-name-18",
        }, {
            name: "images/your-name-19",
            url: "images/your-name-19",
        }, {
            name: "images/your-name-20",
            url: "images/your-name-20",
        }, {
            name: "images/your-name-21",
            url: "images/your-name-21",
        }, {
            name: "images/your-name-22",
            url: "images/your-name-22",
        }, {
            name: "images/your-name-23",
            url: "images/your-name-23",
        }, {
            name: "images/your-name-24",
            url: "images/your-name-24",
        }, {
            name: "images/your-name-25",
            url: "images/your-name-25",
        }, {
            name: "images/your-name-26",
            url: "images/your-name-26",
        }, {
            name: "images/your-name-27",
            url: "images/your-name-27",
        }, {
            name: "images/your-name-28",
            url: "images/your-name-28",
        }, {
            name: "images/your-name-29",
            url: "images/your-name-29",
        }, {
            name: "images/your-name-30",
            url: "images/your-name-30",
        }, {
            name: "images/your-name-31",
            url: "images/your-name-31",
        }, {
            name: "images/your-name-32",
            url: "images/your-name-32",
        }, {
            name: "images/your-name-33",
            url: "images/your-name-33",
        }, {
            name: "images/your-name-34",
            url: "images/your-name-34",
        }];

        for (var i = 0; i < images.length; i++) {
            var html = '<div class="pic"><img src="' + images[i].url + '.jpg" alt="图为《你的名字》中的人物" title="你的名字"></div>';
            var box = document.createElement("div");
            box.className = "box";
            box.innerHTML = html;
            waterfall.appendChild(box);
        }
    }

    return {
        "fall": setPosition,
        "getLastOffsetTop": getLastOffsetTop,
        "more": loadMore
    };
})();

window.onload = function() {
    water.fall();
    var lastBoxOffsetTop = water.getLastOffsetTop();

    window.onscroll = function(e) {
        // 兼容性处理：混杂模式 & 标准模式（？？？） & 浏览器差异性
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var clientHeight = getClientHeight();
        var height = scrollTop + clientHeight;

        if (height > lastBoxOffsetTop) { // 这里写 “===” 等于自取灭亡。。scroll 的回调函数不是没 scroll 一像素执行一次的。。
            water.more();
            water.fall();
            lastBoxOffsetTop = water.getLastOffsetTop();
        }
    };
};
