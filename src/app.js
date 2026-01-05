const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const libraryRoutes = require('./routes/library.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const bookRoutes = require('./routes/book.routes');
const lendingRoutes = require('./routes/lending.routes');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/superAdmin', libraryRoutes);
app.use('/api/user-management', userRoutes);
app.use('/api/category-management', categoryRoutes);
app.use('/api/book-management', bookRoutes);
app.use('/api/lending-book', lendingRoutes);

app.get('/', (req,res) => {
  res.status(200).json({message: 'Library Management Backend Running...'});
});

module.exports = app;