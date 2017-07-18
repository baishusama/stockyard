var http = require('http');
var url = require('url');

function start(route, handle){
    function onRequest(request, response){
        // 根据请求获取路径
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");

        // TODO: [???] 路由：handle request
        route(handle, pathname, response);

        // // 响应
        // response.writeHead(200, {"Content-Type": "text/plain"});
        // response.write("Hello World");
        // response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started XD");
}

exports.start = start;
