const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll(); //sequelize는 프로미스를 지원하므로 async await try/catch 처리할 수 있다.
        res.render('sequelize', { users });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;