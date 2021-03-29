const SSE = require('sse');

module.exports = (server) => {
    const sse = new SSE(server);
    sse.on('connection', (client) => {//서버센트 이벤트 연결
        setInterval(() => { //클라이언트 객체라는게 뭐지? 여기서 app.set 해서 딴데서 쓰라는건가?...
            client.send(Date.now().toString());
        }, 1000);
    });
};
