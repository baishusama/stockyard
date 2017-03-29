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

    window.setTimeout(function() {
        loadMore();
        waterfall();
    }, 3000);
});

function waterfall() {
    $("#waterfall").waterfall({
        itemClass: 'box',
        spacingWidth: 15,
        spacingHeight: 15,
        minColNum: 3
    });
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
        var html = '<img src="' + images[i].url + '.jpg" alt="图为《你的名字》中的人物" title="你的名字">';
        var box = document.createElement("div");
        box.className = "box new";
        box.innerHTML = html;
        $("#waterfall")[0].appendChild(box);
    }
}
