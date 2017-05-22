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

$(function() {
    console.log("jq is ready~");
    waterfall();

    generateCats();
    // window.setTimeout(function() {
    //     loadMore();
    // }, 3000);
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

// 封装发送 get 请求的函数
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

// 加载更多图片 - json
function loadMore() {
    var images = null;

    // Ajax 异步
    syncGet({
        url: 'images.json',
        data: {}, // 未测试过有数据情况 todo..
        success: function(resp) { // 和 JQ 的 $.get 的参数有出路 todo..
            // // fortest
            // console.log('success: ' + resp);
            // for (var key in resp) {
            //     console.log(key, resp[key]);
            // }

            // 获取图片数据
            var dataStr = resp.response;
            var imgObj = JSON.parse(dataStr);
            console.log(imgObj);

            // 更新 dom - 不够 JQ 而且会引起很多重构 OAO todo..
            for (var i = 0; i < imgObj.length; i++) {
                var html = '<img src="' + imgObj[i].url + '.jpg" alt="图为《你的名字》中的人物" title="你的名字">';
                var box = document.createElement("div");
                box.className = "box new";
                box.innerHTML = html;
                $("#waterfall")[0].appendChild(box);
            }

            // 放在回调函数中（后续添加的图片）才能（在瀑布流中）正常显示
            // waterfall();
        },
        error: function(resp) {
            console.log('error: ' + resp);
        }
    });
}

// 小猫图片 API - xml
function generateCats() {
    syncGet({
        url: 'http://thecatapi.com/api/images/get',
        data: {
            format: 'xml',
            results_per_page: '100'
        },
        success: function(resp) {
            // // fortest
            // console.log('success: ' + resp);
            // for (var key in resp) {
            //     console.log(key, resp[key]);
            // }

            // 获取图片数据
            var dataStr = resp.response;
            // console.log(dataStr);
            // var imgObj = JSON.parse(dataStr);
            // console.log(imgObj);

            // xml
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

            var $imgs = $(xmlDoc).find('image').map(function() {
                var url = $(this).find('url').text();
                var link = $(this).find('source_url').text();

                var $anchor = $('<a></a>').attr('href', link).addClass('box').append($('<img />').attr('src', url));
                return $anchor[0];
            });

            console.log('$imgs : ', $imgs);
            $("#waterfall").append($imgs);
            waterfall();
            console.log('cats are added =xwx= !!');
        },
        error: function() {}
    });
}

// // 想在 load 事件触发时。。 todo..
// $(window).load(function() {
//     waterfall();
// });
