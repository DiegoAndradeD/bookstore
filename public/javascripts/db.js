const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });



const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error Connecting with MongoDB'));
db.once('open', () => {
    console.log('Successfully connected to mongoDB');
});

module.exports = {db};