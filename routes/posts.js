const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    	res.render('index');
});

router.get('/Login', (req, res) => {
	res.render('Login');
});

module.exports = router;