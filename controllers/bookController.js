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
      const books = await Book.find({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { author: { $regex: searchText, $options: 'i' } }
        ]
      });
      const { email, isAdmin} = req.session;
      return res.render('searchResult', {userId: userId, searchText, books, email, isAdmin, navbar: 'navbar' });
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
    const { email, isAdmin} = req.session;

    const { searchText } = req.query;

    favoriteBooks = favoriteBooks.filter(book =>
      book.title.match(new RegExp(searchText, 'i')) ||
      book.author.match(new RegExp(searchText, 'i'))
    );

    return res.render('favoritesPage', { favoriteBooks, userId, email, isAdmin, navbar: 'navbar', searchText });
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

//Function to add a book to an user's cart
//If the book is already added, it will only increase it's quantity in the cart
const addBookToCart = async(req, res) => {

  try {
    const userId = req.session.userId;
    const bookId = req.params.bookId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json('Please LogIn to buy this book' );
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json( 'Book not found' );
    }

    const existingCartItem = user.shoppingCart.find(item => item.book.equals(book._id));

    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      user.shoppingCart.push({ book: book._id });
    }

    await user.save();

    const message = existingCartItem
    ? `Book Added to Your Cart! You have ${existingCartItem.quantity} of this book in your cart`
    : 'Book Added to Your Cart!';

    console.log('Book Added to Your Cart');
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json('Erro adding book to cart');
  }

}


//Function to get the items on the user's cart
const getCartItems = async(req, res) => {

  try {
    const userId = req.session.userId;
    const user = await User.findById(userId).populate('shoppingCart.book');

    if (!user) {
      console.log("user not found");
      return res.status(404).json('Please LogIn to buy this book' );
    }

    res.status(200).json(user.shoppingCart);
  } catch (error) {
    res.status(500).json('Erro getting cart items.');
  }

}

/* 
  Function to officializer the user purchase
    This function, after verifying if the user is logged, is a valid user and does not have and empty cart...
    ...creates a copy of his cart data, empties the user's cart, and redirects to the success page with...
    ...the purchase data. 
*/
const officializePurchase = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json('Please LogIn to make a purchase');
    }

    const user = await User.findById(userId).populate('shoppingCart.book');

    if (!user) {
      return res.status(404).json('User not found');
    }

    if (user.shoppingCart.length === 0) {
      return res.status(400).json('Your cart is empty');
    }

    const purchaseData = user.shoppingCart.map(item => {
      return {
        bookTitle: item.book.title,
        bookPrice: item.book.price,
        quantity: item.quantity,
        subtotal: item.quantity * item.book.price
      };
    });

    user.shoppingCart = [];
    await user.save();

    const queryString = encodeURIComponent(JSON.stringify(purchaseData));
    res.redirect(`/SuccessPage?data=${queryString}`);
  } catch (error) {
    res.status(500).json('Error officializing purchase');
  }
};

const removeBookFromCart = async (req, res) => {
  try {
      const userId = req.session.userId;
      const bookIdToRemove = req.params.bookId;
      const user = await User.findById(userId).populate('shoppingCart.book');

      if (!user) {
          return res.status(404).json("User not found" );
      }

      const cartItemIndex = user.shoppingCart.findIndex(item => item.book._id.toString() === bookIdToRemove);

      if (cartItemIndex === -1) {
          return res.status(404).json("Book not found in cart" );
      }

      user.shoppingCart.splice(cartItemIndex, 1);
      await user.save();

      res.status(200).json("Book removed from cart");
  } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error" );
  }
};

const getBooksByCategory = async (req, res) => {
  const bookCategory = req.params.category;
  try {
    let books = await Book.find({category: bookCategory});
    const { searchText } = req.query;

    if(searchText) {
      books = books.filter(book =>
        book.title.match(new RegExp(searchText, 'i')) ||
        book.author.match(new RegExp(searchText, 'i'))
      );
    } 
    
    const { email, isAdmin, userId} = req.session;
    return res.render('booksByCategory', {bookCategory, userId: userId,  books, email, isAdmin, navbar: 'navbar' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ errorMessage: error.message });
  }

}



//Functions exports
module.exports = { addBook, getBooks, getIndexBooks, getBookDetails, searchBook, favoriteBook, getFavoriteBooks, removeFavorite, addBookToCart, getCartItems, officializePurchase, removeBookFromCart, getBooksByCategory };
