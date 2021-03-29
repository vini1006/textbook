const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v2';
axios.defaults.headers.origin = 'http://localhost:4000'; //origin 헤더 추가
const request = async (req, api) => {
    try {
        if (!req.session.jwt) {//세션에 토큰이 없다면
            const tokenResult = await axios.post (`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET
            }); 
            req.session.jwt = tokenResult.data.token; //세션에 토큰 저장
        }
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: req.session.jwt }
        }); //api 요청
    } catch (err) {
        if (err.response.status === 419) { //토큰 만료시 토큰 재발급 받기
            delete req.session.jwt;
            return request(req, api);
        }
        return err.response;
    }
};

router.get('/mypost', async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try {
        console.log(req.params.hashtag);
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});




router.get('/test', async (req, res, next) => { //토큰 테스트 라우터
    try {
        if (!req.session.jwt) {//세션에 토큰이 없으면 발급 시도
            console.log('넘어온 req의 session', req.session);
            const tokenResult = await axios.post('http://localhost:8002/v1/token', {
                clientSecret: process.env.CLIENT_SECRET
            });
            if (tokenResult.data && tokenResult.data.code === 200) { //토큰 발급 성공
                req.session.jwt = tokenResult.data.token; //세션에 토큰저장
            } else { //토큰 발급 실패  
                return res.json(tokenResult.data); // 발급 실패 사유 응답
            }
        }
        //발급받은 토큰 테스트
        console.log('있는 req의 session', req.session);
        const result = await axios.get('http://localhost:8002/v1/test', {
            headers: { authorization: req.session.jwt }
        });
        return res.json(result.data);
    } catch (err) {
        console.error(err);
        if (err.response.status === 419) { //토큰 만료시
            return res.json(err.response.data);
        }
        return next(err);
    }
});

router.get('/', (req, res) => {
    res.render('main', { key: process.env.CLIENT_SECRET });
});

module.exports = router;