const express = require('express');
const router = express.Router();
const db = require('../public/javascripts/db');

const userController = require('../controllers/userController');


router.get('/', (req, res) => {
	const email = req.session.email;
	res.render('index', {email: email});
  });

router.get('/signupPrototype', (req, res) => {
	const email = req.session.email;
	res.render('signupPrototype' , {email: email});
});

router.get('/Login', (req, res) => {
	res.render('Login');
});

router.get('/loginPrototype', (req, res) => {
	const email = req.session.email;
	res.render('loginPrototype', {email: email});
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/loginPrototype');
});

router.post('/signupPrototype', userController.signup);

router.post('/loginPrototype', userController.login);

module.exports = router;