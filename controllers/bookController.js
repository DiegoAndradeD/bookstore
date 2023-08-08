const {User} = require('../models/User');
const Book = require('../models/Book');


const addBook = async (req, res) => {
  try {

    const { title, author, synopsis, pages_number, price, isInStock, category, idiom, publisher, quantity} = req.body;
    const cover = req.file.filename;

    const lowercaseTitle = title.toLowerCase();
    const lowercaseAuthor = author.toLowerCase();
    const lowercaseSynopsis = synopsis.toLowerCase();
    const lowercaseCategory = category.toLowerCase();
    const lowercaseIdiom = idiom.toLowerCase();
    const lowercasePublisher = publisher.toLowerCase();

    await Book.create({title: lowercaseTitle, 
      author: lowercaseAuthor, 
      synopsis: lowercaseSynopsis, pages_number, price, isInStock, category: lowercaseCategory, idiom: lowercaseIdiom, publisher: lowercasePublisher, quantity, cover });

    res.redirect('/');
  } catch (error) {
    res.status(error.statusCode || 500).json({errorMessage: error.message});
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    const { email, isAdmin } = req.session;
    res.render('Admin_AddBook', { books, email, isAdmin, navbar: 'navbar' });
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

const searchBook = async (req, res) => {

    const {searchText} = req.body;

    try {
      const searchResult = await Book.find({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { author: { $regex: searchText, $options: 'i' } }
        ]
      });
      const { email, isAdmin} = req.session;
      return res.render('searchResult', { searchText, searchResult, email, isAdmin, navbar: 'navbar' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ errorMessage: error.message });
    }

}

const favoriteBook = async (req, res) => {

  try {
    const user = await User.findById(req.params.userId);
    const book = await Book.findById(req.params.bookId);
  
    if(!user || !book) {
      return res.status(404).json({errorMessage: error.message});
    }

    const isBookInFavorites = user.favoriteBooks.some(favorite => favorite.equals(book._id));
    
    if (isBookInFavorites) {
      return res.status(201).json({ successMessage: 'Book is already in your favorites.' });
    }
  
    user.favoriteBooks.push(book);
    await user.save();
  
    res.json({successMessage: 'Book added to your favorites!'});
  } catch (error) {
    res.status(error.statusCode || 500).json({ errorMessage: error.message });
  }

}

const getFavoriteBooks = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId).populate('favoriteBooks');

    if (!user) {
      return res.status(404).json({ errorMessage: "User not found." });
    }

    let favoriteBooks = user.favoriteBooks;
    const { email, isAdmin } = req.session;

    const { searchText } = req.query;

    favoriteBooks = favoriteBooks.filter(book =>
      book.title.match(new RegExp(searchText, 'i')) ||
      book.author.match(new RegExp(searchText, 'i'))
    );

    return res.render('favoritesPage', { favoriteBooks, email, isAdmin, navbar: 'navbar', searchText });
  } catch (error) {
    res.status(error.statusCode || 500).json({ errorMessage: error.message });
  }
};




module.exports = { addBook, getBooks, getIndexBooks, getBookDetails, searchBook, favoriteBook, getFavoriteBooks };
