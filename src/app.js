const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const libraryRoutes = require('./routes/library.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/superAdmin', libraryRoutes);
app.use('/api/user-management', userRoutes);
app.use('/api/category-management', categoryRoutes);

app.get('/', (req,res) => {
  res.status(200).json({message: 'Library Management Backend Running...'});
});

module.exports = app;