var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");

var app = express();

app.get('/', function (req, res, next) {
    // 用 superagent 去抓取 https://cnodejs.org/ 的内容
    superagent.get('https://cnodejs.org/')
        .end(function (err, sres) {
            // 常规的错误处理
            if (err) {
                return next(err);
            }
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
            // 剩下就都是 jquery 的内容了
            var $ = cheerio.load(sres.text);
            var items = [];
            $('#topic_list .topic_title').each(function (idx, topic_title) {
                var $topic_title = $(topic_title);
                items.push({
                    title: $topic_title.attr('title'),
                    href: $topic_title.attr('href'),
                    author: $topic_title.parents(".cell").children(".user_avatar").attr('href')
                        .replace(/\/user\/(.+)/, '$1')
                });
            });

            res.send(items);
        });
});

app.listen(3000, function(req, res){

});