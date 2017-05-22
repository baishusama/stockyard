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
    // 瀑布流插件的测试调用
    $("#testMulti").waterfall({
        itemClass: 'box',
        spacingWidth: 10,
        spacingHeight: 10,
        minColNum: 2
    });
});
