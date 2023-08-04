const {User} = require('../models/User');
const Book = require('../models/Book');


const addBook = async (req, res) => {
  try {

    const { title, author, synopsis, pages_number, price, isInStock, category, idiom, publisher, quantity} = req.body;
    const cover = req.file.filename;

    await Book.create({ title, author, synopsis, pages_number, price, isInStock, category, idiom, publisher, quantity, cover });

    res.redirect('/');
  } catch (error) {
    res.status(error.statusCode || 500).json({errorMessage: error.message});
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    const { email, isAdmin } = req.session;
    res.render('testAddBook', { books, email, isAdmin, navbar: 'navbar' });
  } catch (error) {
    res.status(error.statusCode || 500).json({errorMessage: error.message});
  }
};

const getIndexBooks = async (req, res) => {
  try {
    const trendingBooks = await Book.aggregate([{ $sample: { size: 5 } }]);
    const fantasyBooks = await Book.aggregate([
      { $match: { category: 'fantasy' } },
      { $sample: { size: 5 } }
    ]);
    const adventureBooks = await Book.aggregate([
      { $match: { category: 'adventure' } },
      { $sample: { size: 5 } }
    ]);

    return res.json({ trendingBooks, fantasyBooks, adventureBooks });
  } catch (error) {
    res.status(error.statusCode || 500).json({ errorMessage: error.message });
  }
};


const getBookDetails = async (req, res) => {

  const bookId = req.query.id;
	
	try {
	  const bookDetail = await Book.findById(bookId);
    const { email, isAdmin} = req.session;
	  return res.render('bookPage', { bookDetail, email, isAdmin, navbar: 'navbar' });
	} catch (error) {
	  res.status(error.statusCode || 500).json({ errorMessage: error.message });
	}

};



module.exports = { addBook, getBooks, getIndexBooks, getBookDetails };
