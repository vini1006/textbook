const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') => cookie.split(';').map( v => v.split('=')).reduce((acc, [k,v]) => {
    acc[k.trim()] = decodeURIComponent(v);
    return acc;
}, {});

const session = {};

let server = http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    console.log(session);
    if (req.url.startsWith('/login')){
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        const uniqueInt = Date.now();
        session[uniqueInt] = {
            name,
            expires,
        };
        res.writeHead(302, {
            Location : '/',
            'Set-Cookie' : `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`
        });
        return res.end();
    //세션 쿠키가 존재하고 만료기간이 지나지 않았다면
    } else if (cookies.session && session[cookies.session].expires > new Date()){
        console.log('2번째',cookies);
        res.writeHead(200, {'Content-Type' : 'text/plain; charset=utf-8'});
        return res.end(`${session[cookies.session].name}님 안녕하세요.`);
    } else {
        try {
            const data = await fs.readFile('./cookie2.html');
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
            return res.end(data);
        } catch (err) {
            res.writeHead(500, {'Content-Type' : 'text/plain; charset=utf-8'});
            return  res.end(err.message);
        }
    }
});

server.listen(8085, () => {
    console.log('8085 포트에서 서버 대기중');
})