const {User} = require('../models/User');
const Book = require('../models/Book');

const addBook = async (req, res) => {
  try {

    isAdminMiddleware();

    const { title, author, pages_number, price, isInStock, category, idiom, publisher, quantity} = req.body;
    const cover = req.file.filename;

    await Book.create({ title, author, pages_number, price, isInStock, category, idiom, publisher, quantity, cover });

    res.redirect('/');
  } catch (error) {
    res.status(error.statusCode || 500).json({errorMessage: error.message});
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.render('testAddBook', { books});
  } catch (error) {
    res.status(error.statusCode || 500).json({errorMessage: error.message});
  }
};

module.exports = { addBook, getBooks };
