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
	const email = req.session.email;
	res.render('Login', {email: email});
});

router.get('/Signup', (req, res) => {
	res.render('Signup');
});

router.get('/loginPrototype', (req, res) => {
router.get('/AdminLogin', (req, res) => {
	const email = req.session.email;
	res.render('AdminLogin', {email: email});
});


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/loginPrototype');
});

router.post('/signupPrototype', userController.signup);

router.post('/Login', userController.login);

router.post('/AdminLogin', userController.login);

module.exports = router;