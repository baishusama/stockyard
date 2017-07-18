var server = require("./server");
var router = require("./router");

// 依赖注入
server.start(router.route);