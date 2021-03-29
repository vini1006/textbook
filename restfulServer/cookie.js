const http = require('http');

let server = http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, {'Set-Cookie' : 'mycookie=test'});
    res.end('Hello Cookie');
});

server.listen(8083, () => {
    console.log('8083 포트에서 서버 대기중');
});