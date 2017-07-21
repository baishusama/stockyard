var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
// var eventproxy = require('eventproxy');
var async = require('async');

var app = express();
var cnodeUrl = "https://cnodejs.org/";

app.get('/', function (req, res) {
    // 爬取 CNode 首页
    superagent.get(cnodeUrl)
        .end(function (err, res) {
            if (err) {
                return console.error(err);
            }

            // 获取首页第一页的 topics 和 topicUrls
            var topics = [];
            var $ = cheerio.load(res.text);
            $("#topic_list .topic_title").each(function (index, topic_title) {
                var $topic_title = $(topic_title);
                var topic_tag = '【' + $topic_title.prev().text().trim() + '】';
                topics.push({
                    title: topic_tag + $topic_title.text().trim(),
                    href: url.resolve(cnodeUrl, $topic_title.attr('href'))
                    // author:
                });
            });
            var topicUrls = topics.map(function (value) {
                return value.href;
            });

            // [test]
            function getTypeOf(sth) {
                if (Object.prototype.toString.call(sth) === "[object Array]") {
                    return 'array';
                } else if (typeof sth === 'object') {
                    return 'object'
                }
                return 'unknown';
            }
            console.log("topics (" + getTypeOf(topics) + "): \n", topics);
            console.log("topicUrls (" + getTypeOf(topicUrls) + "): \n", topicUrls);

            // 异步并发上限 3 个请求，爬取各个 topic 页面
            async.mapLimit(topicUrls, 3, function (url, callback) {
                superagent.get(url)
                    .end(function (err, res) {
                        if (err) {
                            return callback(err, null);
                        }
                        callback(null, res.text);
                    });
            }, function (err, results) {// results 是一个数组
                if (err) {
                    return console.error(err);
                }

                // 解析各个 topic 页面的 html ，如果有评论的话获取第一个评论者的相关信息
                results.forEach(function (res, index) {
                    var $ = cheerio.load(res);
                    var $reply_area = $(".reply_area");
                    if ($reply_area.length > 0) {
                        // the topic has comments
                        var $reply1 = $reply_area.eq(0);
                        topics[index]['author1'] = $reply1.find(".reply_author").text().trim();
                        topics[index]['comment1'] = $reply1.find(".reply_content").text().trim();
                        topics[index]['href1'] = url.resolve(cnodeUrl, $reply1.find('.reply_author').attr('href'));
                    }
                    // TODO: else ???
                });

                // 如果有评论的话，获取第一个评论者的 href
                var href1s = {};
                topics.filter(function(topic){
                    return topic.author1;
                }).forEach(function(topicWithComment){
                    href1s[topicWithComment.author1] = topicWithComment.href1;
                });

                // 异步并发上限 3 个请求，爬取各个 author1 页面
                async.mapLimit(href1s, 3, function(url, callback){
                    // console.log("what is url ? : ", url);
                    superagent.get(url)
                        .end(function (err, res) {
                           if(err){
                               callback(err, null);
                           }
                           callback(null, res.text);
                        });
                }, function (err, results) {
                    if(err){
                        return console.error(err);
                    }

                    // 解析各个 author1 页面的 html ，存储 author1 的积分为一个 scores 对象
                    var scores = {};
                    results.forEach(function (res) {
                        var $ = cheerio.load(res);
                        var $userinfo = $('.userinfo');
                        var author1 = $userinfo.children('.dark').text().trim();
                        var score = parseInt($userinfo.find('.big').eq(0).text().trim());
                        scores[author1] = score;
                    });

                    // 将 scores 存储到对应的 topic 的 score1 属性
                    topics = topics.map(function(topic){
                        if(topic.author1){
                            topic['score1'] = scores[topic['author1']];
                        }
                        return topic;
                    });

                    // 打印最终结果
                    return console.log("Finally, topics (" + getTypeOf(topics) + "): \n", topics);
                });

                return console.log("--- Sync Code's End ---");
            });
        });
});

app.listen(3000, function (req, res) {
    console.log('### App is running at port 3000');
});