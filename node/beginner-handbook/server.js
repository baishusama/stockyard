var http = require('http'),
    url = require('url');

function start(route, handle){
    function onRequest(request, response){
        // 根据请求获取路径
        var pathname = url.parse(request.url).pathname;
        console.log("┌ Request for " + pathname + " received.");

        // // 移除对 postData 的处理，交由 formidable 来处理
        // var postData = "";
        // request.setEncoding("utf8");
        // request.addListener("data", function(postDataChunk){
        //     postData += postDataChunk;
        //     console.log("| ..Received POST data chunk '" + postDataChunk + "'.");
        // });
        // request.addListener("end", function(){
        //    route(handle, pathname, response, postData);
        // });

        // TODO: [DONE] 路由：handle request
        route(handle, pathname, response, request);

        // // 响应
        // response.writeHead(200, {"Content-Type": "text/plain"});
        // response.write("Hello World");
        // response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started XD");
}

exports.start = start;
