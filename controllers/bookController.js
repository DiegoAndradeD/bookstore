

const Book = require('../models/Book');

const addBook = async (req, res) => {
  try {
    const { title, author, pages_number, price, isInStock, category, idiom, publisher, quantity} = req.body;
    const cover = req.file.filename;

    await Book.create({ title, author, pages_number, price, isInStock, category, idiom, publisher, quantity, cover });

    res.redirect('/');
  } catch (err) {
    res.status(500).send('Erro ao adicionar livro.');
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.render('testAddBook', { books});
  } catch (err) {
    res.status(500).send('Erro ao obter livros.');
  }
};

module.exports = { addBook, getBooks };
