// var exec = require('child_process').exec;
var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    util = require('util');

// About formidable : https://www.npmjs.com/package/formidable
// npm 4.2.0 & node 6.9.1 (node has to be downgraded)

function start(response, request) {
    console.log("└ Request handler 'start' was called.");

    // // [demo] /start 页面
    // exec("ls -lah", function(error, stdout, stderr){
    //     response.writeHead(200, {"Content-Type": "text/plain"});
    //     response.write(stdout);
    //     response.end();
    // });

    // // [test] 耗费 10s 的 /start 页面
    // exec("find /",
    //     { timeout: 10000, maxBuffer: 20000*1024 },
    //     function (error, stdout, stderr) {
    //         response.writeHead(200, {"Content-Type": "text/plain"});
    //         response.write(stdout);
    //         response.end();
    //     });

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" method="post" enctype="multipart/form-data">' +
        // '<textarea name="text" rows="20" cols="60"></textarea>' +
        '<input type="file" name="upload" />' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
    console.log("| Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("| ..about to parse..");
    form.parse(request, function(error, fields, files){
        console.log("└ parsing done :)");
        // 重命名
        fs.renameSync(files.upload.path, "/tmp/test.png");
        response.writeHead(200, {"Content-Type": "text/html"});
        // // [old codes] "text/plain"
        // response.write("You've sent the text : ", querystring.parse(request).text);
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response, request) {
    console.log("└ Request handler 'show' was called.");
    fs.readFile("/tmp/test.png", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;