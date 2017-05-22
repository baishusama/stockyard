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
 *
 * Cat Image API:
 * http://thecatapi.com/docs.html
 * 
 */

$(function() {
    generateCats();
});

// 瀑布流插件的默认调用
function waterfall() {
    $("#waterfall").waterfall({
        itemClass: 'box',
        spacingWidth: 15,
        spacingHeight: 15,
        minColNum: 3
    });
}

// GET 猫 success 回调函数
function successCallback(data) {
    // xml 数据 & 图片
    var xmlDoc = data;
    var $newImgs = $(xmlDoc).find('image');

    // 插入新的图片之前，先记录当前图片数量
    var initLen = $("#waterfall").find('.box').length;
    // 选择器字符串 boxSlt 用来选择新增的图片的父 .boxk
    var boxSlt = ".box";
    if (initLen - 1 > -1) {
        boxSlt += ":gt(" + (initLen - 1) + ")";
    }

    // 用 a.box 包裹空图片
    var $boxs = $newImgs.map(function() {
        var link = $(this).find('source_url').text();

        var $anchor = $('<a></a>').attr('href', link).addClass('box')
            .append($('<img />').attr('src', 'images/cat-loading.gif'));
        return $anchor[0];
    });
    // a.box 插入到 DOM
    $("#waterfall").append($boxs);

    // loading...
    $("#waterfall").find(boxSlt)
        .find('img').one('load', function() { // load 事件回调函数
            var index = [].indexOf.apply($('#waterfall').find('img'), $(this));
            var curSrc = $(this).attr('src');
            if (curSrc === "images/cat-loading.gif") {
                // 加载完 gif 
                console.log('Image ' + index + ' loading...');
            } else {
                // 本意是修改 src 属性值（加载完真正的图片）之后，但是【不被触发】
                console.log('Image ' + index + ' OK !!');
            }

            waterfall();
        }).one('error', function() { // error 事件回调函数
            console.log('Display FAIL Orz');
            waterfall();
        }).each(function(index) { // 预先加载图片
            var $thisImg = $(this);
            var downloadImg = new Image();

            downloadImg.onload = function() {
                // 预先加载完，立即赋给真正的图片
                $thisImg.attr('src', downloadImg.src);
                console.log('Image ' + index + ' Downloaded !');
                waterfall();
            };
            downloadImg.onerror = function() {
                // 预先加载失败，还是赋给真正的图片（这里会触发两次加载）【有没有办法避免？？？】todo..
                console.log('Download ERROR :(');
                $thisImg.attr('src', downloadImg.src);
            };

            // 预先加载
            downloadImg.src = $newImgs.eq(index).find('url').text();
        });
}

// 小猫图片 API - xml
function generateCats() {
    // $.get('http://localhost/webapp/src/data/city.json', { // 跨域请求被禁止
    $.get('http://thecatapi.com/api/images/get', { // 公共接口 - 允许跨域请求被
        format: 'xml',
        results_per_page: '40'
    }, successCallback, 'xml');
}

function getMoreCats() {
    generateCats();
}
