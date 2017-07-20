var express = require('express');
var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');

var app = express();
var cnodeUrl = 'https://cnodejs.org/';

app.get('/', function(req, res){
    superagent.get(cnodeUrl)
        .end(function(err, res){
            if(err){
                return console.error(err);
            }

            var topicUrls = [];
            var $ = cheerio.load(res.text);
            $('#topic_list .topic_title').each(function(idx, el){
                var $el = $(el);
                var href = url.resolve(cnodeUrl, $el.attr('href'));
                topicUrls.push(href);
            });
            // console.log("--- topicUrls ---");
            // console.log(topicUrls);

            var ep = new eventproxy();
            var topicFailCount = 0;
            // 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
            ep.after('topic_html', topicUrls.length, function(topics){ // typeof topics === 'object'
                console.log("+++ TOTAL "+topicFailCount+" FAIL +++");
                console.log("--- topics (after received 40 times) ---");
                console.log("type : ", typeof topics);
                console.log("length : ", topics.length);
                // console.log("content : ", topics);
                console.log("content : (hide for short)");

                // console.log("+++ author1's href +++");
                topics = topics.map(function(topicPair){
                    var topicUrl = topicPair[0];
                    var topicHtml = topicPair[1];
                    var $ = cheerio.load(topicHtml);

                    var topic = {};
                    topic['title'] = $('.topic_full_title').text().trim();
                    topic['href'] = topicUrl;

                    if($('.reply_area').length > 0){ // hasComment
                        // console.log("hasComment && author1 : ", $('.user_avatar').eq(0).attr('href'));
                        // console.log("\t&& author1 : ", $('.reply_author').eq(0).text().trim());
                        // var author1link = $('.user_avatar').eq(0).attr('href');
                        // author1link = author1link ? url.resolve(cnodeUrl, author1link) : "";

                        topic['comment1'] = $('.reply_content').eq(0).text().trim();
                        topic['author1'] = $('.reply_author').eq(0).text().trim();
                        topic['author1link'] = url.resolve(cnodeUrl, $('.user_avatar').eq(0).attr('href'));
                    }

                    return topic;
                });

                console.log("--- topics (after mapping) ---");
                console.log("type : ", typeof topics);
                console.log("length : ", topics.length);
                console.log("content : ", topics);

                var authorUrls = topics.map(function(topic){
                    return topic.author1link;
                }).filter(function(link){
                    return link;
                }); // 先过滤掉值为 "" 的 url，避免 ep2 等待空 url 的结果

                console.log("--- authorUrls ---");
                console.log("type : ", typeof authorUrls);
                console.log("length : ", authorUrls.length);
                console.log("content : ", authorUrls);

                var ep2 = new eventproxy();
                ep2.after('author1_html', authorUrls.length, function(author1Pages){
                    console.log("--- author1Pages (after received " + authorUrls.length + " times) ---");
                    console.log("type : ", typeof author1Pages);
                    console.log("length : ", author1Pages.length);
                    // console.log("content : ", topics);
                    console.log("content : (hide for short)");

                    var scores = {};
                    author1Pages.forEach(function (author1PagePair) {
                        var author1Url = author1PagePair[0];
                        var author1Html = author1PagePair[1];
                        var $ = cheerio.load(author1Html);
                        // TODO: [test] score NaN ?
                        var scoreStr = $('.user_profile').find('.big').text().trim();
                        console.log(">>> big's html : ", $('.user_profile').find('.big').html());
                        console.log(">>> scoreStr : ", scoreStr);
                        scores[author1Url] = scoreStr ? parseInt(scoreStr) : 0;
                    });

                    console.log("--- scores (finally) ---");
                    console.log("type : ", typeof scores);
                    console.log("length : ", scores.length);
                    console.log("content : ", scores);

                    topics = topics.map(function (topic) { // TODO: answer if `topics =` is needed for changes happen in obj topic
                        console.log(">>> Each topic is", topic);
                        var keyUrl = topic.author1link;
                        topic['score1'] = scores[keyUrl];
                        // delete topic['author1link'];
                        return topic;
                    });

                    console.log("--- topics (finally) ---");
                    console.log("type : ", typeof topics);
                    console.log("length : ", topics.length);
                    console.log("content : ", topics);
                });

                authorUrls.forEach(function(authorUrl){
                    superagent.get(authorUrl)
                        .end(function (err, res) {
                            console.log(' -> get ' + authorUrl + ' OK');
                            ep2.emit('author1_html', [authorUrl, res.text]);
                        });

                });
            });

            function superAgentGet(url){
                superagent.get(url)
                    .end(function (err, res) {
                        // console.log('..fetch ' + url + ' successfully~');
                        if(err || !res.ok){
                            console.error("URL("+url+") failed :(");
                            // console.log("res.text : ", res.text);
                            topicFailCount++;

                            ep.emit('topic_html', [url, ""]);
                        } else {
                            ep.emit('topic_html', [url, res.text]);
                        }
                    });
            }

            // // 遍历爬取 topics
            topicUrls.forEach(function(topicUrl){
                superAgentGet(topicUrl);
            });
            // // 为了避免 503 错误，三个一组地发送请求
            // var MAX_CON = 3; // MAX_CONCURRENT_NUM
            //
            // function sendSeveralRequest(urls, startIndex, number) {
            //     for(var i = 0; i < number; i++){
            //         if(startIndex + i < urls.length){
            //             superAgentGet(urls[startIndex + i]);
            //         }
            //     }
            // }
            //
            // // // Sync
            // // for(var i = 0; i < Math.ceil(topicUrls.length/MAX_CON); i++){
            // //     sendSeveralRequest(topicUrls, i * MAX_CON, MAX_CON);
            // // }
            //
            // // Async
            // var round = 0;
            // var max = Math.ceil(topicUrls.length/MAX_CON);
            // function timeoutFunction(){
            //     setTimeout(function(){
            //         if(round < max){
            //             sendSeveralRequest(topicUrls, round * MAX_CON, MAX_CON);
            //             round++;
            //             timeoutFunction();
            //         }
            //     }, 500);
            // }
            // timeoutFunction();
        });
});

app.listen(3000, function(req, res){
    console.log('### App is running at port 3000');
});