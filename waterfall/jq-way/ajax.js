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
    console.log("jq is ready~");
    waterfall();

    generateCats();
    window.setTimeout(function() {
        getMoreCats();
    }, 8000);
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

// 封装发送 get 请求的函数 Orz JQ 都封装好了啊亲。。。
function syncGet(option) {
    function getEncodedURI(option) {
        var url = option.url;
        var params = option.data;

        for (var key in params) {
            url += (url.indexOf('?') === -1) ? '?' : '&';
            url += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }

        console.log('url is "' + url + '"');
        return url;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('get', getEncodedURI(option), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                option.success(xhr);
            } else {
                option.error(xhr);
                // alert("Request was unsuccessful: " + xhr.status);
            }
        }
    };
    xhr.send(null);
}

// 1. 轮询IMG的complete的值
// 2. JQ 的 Promise

// 显示 DOM 0 级 事件
function showDOM0(elem) {
    for (var key in elem) {
        if (key.indexOf('on') === 0) {
            console.log(key);
        }
    }
}

// 猫 success 回调函数
function successCallback(resp) {
    // // fortest
    // console.log('success: ' + resp);
    // for (var key in resp) {
    //     console.log(key, resp[key]);
    // }

    // 获取响应的图片数据
    var dataStr = resp.response;
    // console.log(dataStr);
    // var imgObj = JSON.parse(dataStr);
    // console.log(imgObj);

    // 获取 xml 格式数据
    var xmlDoc = null;
    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(dataStr, "text/xml");
    } else { // Internet Explorer
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(dataStr);
    }
    console.log('xmlDoc:', xmlDoc);

    // 插入新的图片之前，先记录当前图片数量
    var initLen = $("#waterfall").find('.box').length;
    // xml 数据中的图片
    var $newImgs = $(xmlDoc).find('image');

    // 图片用 a 标签包裹
    var $boxs = $newImgs.map(function() {
        // var url = $(this).find('url').text();
        var link = $(this).find('source_url').text();

        // // var $img = 迷之报错 todo..
        // var $img = $('<img />');
        // $img.one('load', function() {
        //     waterfall();
        // }).each(function() {
        //     if (this.complete) {
        //         $(this).load();
        //     }
        // });

        var $anchor = $('<a></a>').attr('href', link).addClass('box')
            .append($('<img />')); //.attr('src', 'images/cat-loading.gif'));
        // .append($img);
        // .append($('<img />').attr('onload', 'waterfall();'));
        return $anchor[0];
    });
    // 插入到 DOM
    $("#waterfall").append($boxs);
    // 不能保证加载完 gif 以后才 waterfall()
    // waterfall();

    // 选择器字符串 boxSlt
    // console.log('$boxs : ', $boxs);
    // console.log('initLen - 1 : ', initLen - 1);
    // console.log('selector of .box : ', '.box:gt(' + (initLen - 1) + ')');
    var boxSlt = ".box";
    if (initLen - 1 > -1) {
        boxSlt += ":gt(" + (initLen - 1) + ")";
    }

    // $("#waterfall").find(boxSlt).each(function(index) {
    //     console.log(index);
    //     $(this).children('img').attr('src', $newImgs.eq(index).find('url').text());
    // });

    // loading...
    $("#waterfall").find(boxSlt)
        .find('img').one('load', function() {
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
        }).one('error', function() {
            console.log('Display FAIL Orz');
            waterfall();
        })
        .attr('src', 'images/cat-loading.gif');

    // // 测试 new Image()
    // var testImg = new Image();
    // showDOM0(testImg);

    // 预先加载图片
    $("#waterfall").find(boxSlt).find('img').each(function(index) {
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
            // waterfall();
        };
        // $("downloadImg").error(function() {
        //     $thisImg.attr('src', downloadImg.src);
        // });

        // 预先加载
        downloadImg.src = $newImgs.eq(index).find('url').text();
    });

    // waterfall();
    console.log('cats are added =xwx= !!');
}

// 小猫图片 API - xml
function generateCats() {
    syncGet({
        url: 'http://thecatapi.com/api/images/get',
        data: {
            format: 'xml',
            results_per_page: '60'
        },
        success: successCallback,
        error: function() {}
    });
}

function getMoreCats() {
    generateCats();
}

// // 想在 load 事件触发时。。 todo..
// $(window).load(function() {
//     waterfall();
// });
