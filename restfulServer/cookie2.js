const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') => cookie.split(';').map( v => v.split('=')).reduce((acc, [k,v]) => {
        acc[k.trim()] = decodeURIComponent(v);
        return acc;
    }, {});

let server = http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);

    // 주소가 /login으로 시작하는 경우
    if (req.url.startsWith('/login')){
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        // 쿠키 유효 시간을 현재 +5 분으로 함
        expires.setMinutes(expires.getMinutes() + 5);
        res.writeHead(302, {
            Location : '/',
            'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; httpOnly; path=/`
        });
        res.end();

    //name 이라는 쿠키가 있을경우
    } else if(cookies.name) {
        res.writeHead(200, {'Content-Type' : 'text/plain; charset=utf-8'});
        res.end(`${cookies.name}님 안녕하세요`);
    } else {
        try {
            const data = await fs.readFile('./cookie2.html');
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
            res.end(data);
        } catch(err) {
            res.writeHead(500, {'Content-Type' : 'text/plain; charset=utf-8'});
            res.end(err.message);
        }
    }
});


server.listen(8084, () => {
    console.log('8084번 포트에서 실행중');
})
