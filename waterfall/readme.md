# 瀑布流插件

假设，你的瀑布流有如下 HTML 结构：

```html
<div id="waterfall">
    <div class="box">
        <img src="images/img1.jpg" alt="图片1" />
    </div>
    <div class="box">
        <img src="images/img2.jpg" alt="图片2" />
    </div>
    ...
</div>
```

## 引入

在 HTML 文件中，在引入 jQuery 库之后，引入插件：

```html
<script src="jquery-3.1.0.min.js"></script>
<script src="waterfall.min.js"></script>
```

> P.S. `waterfall.min.js` 在本项目源码中，请自行获取。

## 相关样式

```css
#waterfall {
    /* 必要-1 */
    position: relative;
    margin: 0 auto;
}

#waterfall::after {
    clear: both;
    display: block;
    content: '\200b';
    width: 0;
    height: 0;
}

#waterfall .box {
    /* 必要-2 ？？？ */
    /* 除非一开始就设置了 posa 否则需要 float 使得第一个 item 元素的宽度计算正确
      （而非宽度为 block 块级元素的“占整行”）。即下面 float 和 position 二必选一。
    */
    float: left;
    /* 设置 fl 能使尚未调用 waterfall 时候的样式还过得去 */
}
```

## 使用示例

可以在代码中，像下面这样使用该插件：

```javascript
$("#waterfall").waterfall({
    itemClass: 'box',
    spacingWidth: 15,
    spacingHeight: 15,
    minColNum: 3
});
```

戳[这里]()访问在线 demo ～

## 参数 & 说明

* [x] `itemClass`：瀑布流中每一项的类名
* [x] `spacingWidth`：瀑布流中每一项的水平间距（单位为像素）
* [x] `spacingHeight`：瀑布流中每一项的垂直间距（单位为像素）
* [x] `minColNum`：瀑布流的最小列数
* [ ] `resizeable`：瀑布流是否可调整宽度
* [ ] `isFadeIn`：瀑布流是否淡入淡出