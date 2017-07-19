var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

// JavaScript 中的"关联数组"——对象
var handle = {};
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;

// 依赖注入
server.start(router.route, handle);