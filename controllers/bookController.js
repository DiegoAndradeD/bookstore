//This application uses EJS as its main render
//This controller may have function that return json or render an page with parameters passage.

const {User} = require('../models/User');
const Book = require('../models/Book');
const { json } = require('express');

//Function to add a book to database
const addBook = async (req, res) => {
  try {

    const { title, author, synopsis, pages_number, price, isInStock, category, idiom, publisher, quantity} = req.body;
    const cover = req.file.filename;

    //Conversion to lowercase for better matching
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

//Function to get books from database
//This is an function used in an only admin page
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    const { email, isAdmin } = req.session;
    res.render('Admin_AddBook', { books, email, isAdmin, navbar: 'navbar' });
  } catch (error) {
    res.status(error.statusCode || 500).json({errorMessage: error.message});
  }
};

//Function to get books to index page
/*
  This function aggregate 5 random books to 3 categorys each:
    Trending Books - Any book that is get first from the database
    Fantasy and Adventure Books - Books that match the category fantasy and adventure
*/
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

//Function to get a specific book's data
//Also, it get's five random books to the lower part of the page
const getBookDetails = async (req, res) => {

  const bookId = req.query.id;
  const userId = req.session.userId;
	
	try {
    const trendingBooks = await Book.aggregate([{ $sample: { size: 5 } }]);

	  const bookDetail = await Book.findById(bookId);
    const { email, isAdmin} = req.session;
	  return res.render('bookPage', {userId, bookDetail, email, isAdmin, navbar: 'navbar', trendingBooks });
	} catch (error) {
	  res.status(error.statusCode || 500).json({ errorMessage: error.message });
	}

};


//Function responsible for searching any matching for book name or author in the database
//The search is based in similarity from the user input to the database data
const searchBook = async (req, res) => {
    const {searchText} = req.body;
    const userId = req.session.userId;
    try {
      const searchResult = await Book.find({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { author: { $regex: searchText, $options: 'i' } }
        ]
      });
      const { email, isAdmin} = req.session;
      return res.render('searchResult', {userId: userId, searchText, searchResult, email, isAdmin, navbar: 'navbar' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ errorMessage: error.message });
    }

}


//Function to favorite a book
//This function it's only to work if the user is logged and the book id is valid
const favoriteBook = async (req, res) => {

  try {
    const user = await User.findById(req.params.userId);
    const book = await Book.findById(req.params.bookId);
  
    if(!user || !book) {
      return res.status(404).json({errorMessage: error.message});
    }

    const isBookInFavorites = user.favoriteBooks.some(favorite => favorite.equals(book._id));
    
    if (isBookInFavorites) {
      return res.status(201).json('Book is already in your favorites.');
    }
  
    user.favoriteBooks.push(book);
    await user.save();
  
    return res.status(201).json('Book added to your favorites!');
  } catch (error) {
    res.status(error.statusCode || 500).json({ errorMessage: error.message });
  }

}

//Function to get an user's favorite books
//Also, this function implements search functionalities for serach into the user's favorite books
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


//Function to remove a book from a user's favorite books collection
const removeFavorite = async (req, res) => {
  try {
      const userId = req.session.userId;
      const bookIdToRemove = req.params.bookId;
      const user = await User.findById(userId).populate('favoriteBooks');

      if (!user) {
          return res.status(404).json({ errorMessage: "User Not found" });
      }

      const bookIndex = user.favoriteBooks.findIndex(book => book._id.toString() === bookIdToRemove);

      if (bookIndex === -1) {
          return res.status(404).json({ errorMessage: "Book Not found in favorites" });
      }

      user.favoriteBooks.splice(bookIndex, 1);
      await user.save();

      res.status(200).json("Book removed from favorites" );
  } catch (error) {
      console.error(error);
      res.status(500).json({ errorMessage: "Internal Server Error" });
  }
}

const addBookToCart = async(req, res) => {

  try {
    const userId = req.session.userId;
    const bookId = req.params.bookId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingCartItem = user.shoppingCart.find(item => item.book.equals(book._id));
    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      user.shoppingCart.push({ book: book._id });
    }

    await user.save();
    console.log('Book Added to Your Cart');
    res.status(200).json({ message: 'Book Added to Your Cart' });
  } catch (error) {
    res.status(500).json({ message: 'Erro adding book to cart'});
  }

}

const getCartItems = async(req, res) => {

  try {
    const userId = req.session.userId;
    const user = await User.findById(userId).populate('shoppingCart.book');

    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: 'User Not found' });
    }

    res.status(200).json(user.shoppingCart);
  } catch (error) {
    res.status(500).json({ message: 'Erro getting cart items.' });
  }

}



//Functions exports
module.exports = { addBook, getBooks, getIndexBooks, getBookDetails, searchBook, favoriteBook, getFavoriteBooks, removeFavorite, addBookToCart, getCartItems };
