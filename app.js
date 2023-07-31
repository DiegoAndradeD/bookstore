const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const postsRouter = require('./routes/posts');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', postsRouter);

app.listen(3000, () => {
  console.log('Server initiated in http://localhost:3000');
});
