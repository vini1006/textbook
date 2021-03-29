const WebSocket = require('ws');


module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => { //웹소켓 연결시
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //상대방의 ip 얻어내는방법
        console.log('새로운 클라이언트 접속 ', ip);
        ws.on('message', (message) => {
            console.log('넘어온 메시지 : ',message);
        });
        ws.on('error', (error) => { //에러시
            console.error(error);
        });
        ws.on('close', () => { //종료시
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval);
        });
 
        ws.interval = setInterval(() => { //3초마다 클라이언트로 메시지 전송
            if (ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트에게 메시지를 보냅니다.');
            }
        }, 3000);
    });
};