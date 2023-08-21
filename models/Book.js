
const mongoose = require('mongoose');

//Book model mongoDB schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pages_number: {
    type: Number, 
    required: true,
  },
  price: {
    type: Number, 
    required: true,
  },
  isInStock: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
  idiom: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
