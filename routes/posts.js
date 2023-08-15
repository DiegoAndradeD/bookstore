const express = require('express');
const router = express.Router();
const db = require('../public/javascripts/db');
const multer = require('multer');

const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const { Book } = require('../models/Book');

const {isAdminMiddleware} = require('../models/User');

const storage = multer.diskStorage({
	destination: './public/images/bookCovers',
	filename: function (req, file, cb) {
	  cb(null, file.originalname);
	},
  });
  
  const upload = multer({ storage });

router.get('/', (req, res) => {
	const email = req.session.email;
	const isAdmin  = req.session.isAdmin;
	const userId = req.session.userId;
	res.render('index', {userId: userId, isAdmin : isAdmin, email: email, navbar: 'navbar'});
  });

router.get('/index', (req, res) => {
	const email = req.session.email;
	const isAdmin  = req.session.isAdmin;
	const userId = req.session.userId;
	res.render('index', {userId: userId, isAdmin : isAdmin, email: email, navbar: 'navbar'});
  });


router.get('/Login', (req, res) => {
	const email = req.session.email;
	const isAdmin  = req.session.isAdmin;
	const userId = req.session.userId;
	res.render('Login', {userId: userId, isAdmin: isAdmin, email: email, navbar: 'navbar'});
});

router.get('/Signup', (req, res) => {
	const email = req.session.email;
	const isAdmin  = req.session.isAdmin;
	const userId = req.session.userId;
	res.render('Signup', {userId: userId, isAdmin: isAdmin, email: email, navbar: 'navbar'});
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/Login');
});


router.get('/bookPage', (req, res) => {
	const email = req.session.email;
	const isAdmin  = req.session.isAdmin;
	const userId = req.session.userId;
	res.render('bookPage', {userId: userId, isAdmin: isAdmin, email: email, navbar: 'navbar'});
});

router.post('/searchBook', bookController.searchBook);

router.get('/addBook', isAdminMiddleware, bookController.getBooks);

router.get('/bookPageRedirect' ,bookController.getBookDetails);

router.post('/index', bookController.getIndexBooks);

router.post('/Login', userController.login);

router.post('/Signup', userController.signup);

router.post('/addBook', upload.single('cover'), (req, res, next) => {
	if (req.file) {
		bookController.addBook(req, res);
	} else {
		return res.status(400).send('Erro ao fazer upload da imagem.');
	}
});

router.get('/user/:userId/favorite/:bookId', bookController.favoriteBook);

router.get('/favoritePage', bookController.getFavoriteBooks);

router.get('/book/:bookId/removeFavorite', bookController.removeFavorite);

router.get('/addToCart/:bookId', bookController.addBookToCart);

router.get('/getCartItems/:bookId', bookController.getCartItems);


module.exports = router;