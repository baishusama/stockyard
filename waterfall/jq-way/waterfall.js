/**
 * DEMO：
 * $container.waterfall({
 *      itemClass: 'waterfall-item',
 *      spacingWidth: 10,
 *      spacingHeight: 10,
 *      minColNum: 2,
 *      resizeable: false,
 *      isFadeIn: false
 * });
 */

//闭包限定命名空间
(function($) {
    //默认参数
    var defaluts = {
        itemClass: 'waterfall-item',
        spacingWidth: 10,
        spacingHeight: 10,
        minColNum: 2,
        resizeable: false,
        isFadeIn: false
    };

    // 私有变量
    var dataCol = 'data-waterfall-col';
    var dataItem = 'data-waterfall-item';
    var dataTarr = 'data-waterfall-tarr';
    var ii = 0; // item index
    var tArr = []; // top array
    var lArr = []; // left array

    $.fn.extend({
        "waterfall": function(options) {
            //检测用户传进来的参数是否合法
            if (!isValid(options))
                return this;

            var opts = $.extend({}, defaluts, options); //使用 jQuery.extend 覆盖插件默认参数

            // jq 对象
            var $container = this;
            var $items = $container.children('.' + opts.itemClass);
            var itemLen = $items.length;

            // 计算列数 colNum

            var cw = $container.parent().width(); // 改为用父元素的 width，参与列数的计算
            var iw = $items.outerWidth(); // 默认所有 item 的宽度相同，仅返回第一个 jq 对象的宽度

            var sw = opts.spacingWidth;
            var sh = opts.spacingHeight;

            var colNum = Math.floor((cw - sw) / (iw + sw));
            colNum = colNum > opts.minColNum ? colNum : opts.minColNum;

            // 计算容器的宽度

            var containerWidth = iw * colNum + sw * (colNum + 1);

            // 初始化各个私有参数

            init(colNum, iw, sw, sh);

            // 如果在某个元素上再次使用尽可能优化

            if (parseInt($container.attr(dataCol)) === colNum) {
                // 如果列数没变化，说明可以利用原有的基础
                if (parseInt($container.attr(dataItem)) === itemLen) {
                    // 如果列数和 item 数量均未变，视为没有任何变化
                    return this;
                } else if ($container.attr(dataTarr) && $container.attr(dataTarr).length) {
                    // 当列数未变，item 数量增加且 dataTarr 的值存在的时候
                    ii = parseInt($container.attr(dataItem));

                    // console.log("uses the old data!..")
                    tArr = $container.attr(dataTarr).split(',').map(function(elem) {
                        return parseInt(elem);
                    });
                }
            }

            // 绝对定位
            for (; ii < itemLen; ii++) {
                var $cur = $items.eq(ii);
                var min = getMinObj(tArr);
                $cur.css({
                    "position": "absolute",
                    "top": min.val + "px",
                    "left": lArr[min.index] + "px"
                });
                tArr[min.index] = Math.ceil(min.val + $cur.outerHeight() + sh);
            }

            // 设置 $container 元素的最小宽度和最小高度
            var max = getMaxObj(tArr);
            $container.css({
                "width": containerWidth,
                "min-height": max.val
            });

            // 记录一些 data- 信息以重用和优化
            $container.attr(dataCol, colNum);
            $container.attr(dataItem, itemLen);
            $container.attr(dataTarr, tArr);

            // 返回本身，不破坏 jq 的链式写法
            return this;
        }
    });

    /*//公共的格式化 方法. 默认是加粗，用户可以通过覆盖该方法达到不同的格式化效果。
    $.fn.highLight.format = function(str) {
        return "<strong>" + str + "</strong>";
    };*/

    // 私有方法 - 用于初始化私有变量
    function init(colNum, iw, sw, sh) {
        ii = 0;
        tArr = [];
        lArr = [];

        for (var i = 0; i < colNum; i++) {
            tArr.push(sh);
            lArr.push(sw + (iw + sw) * i);
        }
    }

    // 私有方法 - 计算 tArr 中 top 值最小的 index
    function getMinObj(array) {
        return array.reduce(function(min, cur, index) {
            return (min.val <= cur) ? min : { "val": cur, "index": index };
        }, { "val": array[0], "index": 0 });
    }

    // 私有方法 - 计算 tArr 中 top 值最大的 index
    function getMaxObj(array) {
        return array.reduce(function(max, cur, index) {
            return (max.val >= cur) ? max : { "val": cur, "index": index };
        }, { "val": array[0], "index": 0 });
    }

    // // 私有方法 - 计算列数
    // function getColNum(){

    // }

    // 私有方法 - 检测参数是否合法
    function isValid(options) {
        return !options || (options && typeof options === "object") ? true : false;
    }
})(window.jQuery);
