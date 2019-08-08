var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {
        'content-type': 'text/plain'
    });
    response.end('hello world');
}).listen(3000);

console.log('成功开启')