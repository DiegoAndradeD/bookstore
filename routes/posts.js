const express = require('express');
const router = express.Router();
const db = require('../public/javascripts/db');
const multer = require('multer');

const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');

const storage = multer.diskStorage({
	destination: './public/images/bookCovers',
	filename: function (req, file, cb) {
	  cb(null, file.originalname);
	},
  });
  
  const upload = multer({ storage });

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

router.get('/add-book', bookController.getBooks); 

router.post('/add-book', upload.single('cover'), (req, res, next) => {
	if (req.file) {
		bookController.addBook(req, res);
	} else {
		return res.status(400).send('Erro ao fazer upload da imagem.');
	}
});


module.exports = router;