const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const mesage = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
}

exports.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); //넘어온 jwt, jwt_secret 비교
        return next();
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                messsage: '토큰이 만료되었습니다.'
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않는 토큰입니다.'
        });
    }
};

exports.apiLimiter = new RateLimit({
    windowMs: 60 & 1000, //1분
    max: 1, //1분내에 몇번
    delayMs: 0, //간격
    handler(req, res) { //한도넘었을 때
        res.status(this.statusCode).json({
            code: this.statusCode, //기본값 429
            message: '1분에 한 번만 요청 할 수 있습니다.'
        });
    }
});

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.'
    });
};