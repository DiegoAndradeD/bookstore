const express = require('express');
const router = express.Router();
const db = require('../public/javascripts/db');

const userController = require('../controllers/userController');


router.get('/', (req, res) => {
	const email = req.session.email;
	res.render('index', {email: email, navbar: 'navbar'});
  });


router.get('/Login', (req, res) => {
	const email = req.session.email;
	res.render('Login', {email: email, navbar: 'navbar'});
});

router.get('/Signup', (req, res) => {
	const email = req.session.email;
	res.render('Signup', {email: email, navbar: 'navbar'});
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/Login');
});

router.post('/Login', userController.login);

router.post('/Signup', userController.signup);

module.exports = router;