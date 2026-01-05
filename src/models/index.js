const { sequelize, testConnection } = require('../config/database');
testConnection();

// Import models as functions and pass sequelize
const Library = require('./library')(sequelize);
const User = require('./user')(sequelize);
const Category = require('./category')(sequelize);
const Book = require('./book')(sequelize);
const Book_Lends = require('./lendingModel')(sequelize);

// Define associations
Library.hasMany(User, {
  foreignKey: 'library_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

User.belongsTo(Library, {
  foreignKey: 'library_id'
});

Library.hasMany(Category, {
  foreignKey: 'library_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});


Category.belongsTo(Library, {
  foreignKey: 'library_id'
});

User.hasMany(Category, {
  foreignKey: 'admin_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Category.belongsTo(User, {
  foreignKey: 'admin_id',
  as: 'admin'
});


// one category has many books
Category.hasMany(Book, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Each Book belongs to one Category
Book.belongsTo(Category, {
  foreignKey: 'category_id'
});


Library.hasMany(Book, {
  foreignKey: 'library_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Book.belongsTo(Library, {
  foreignKey: 'library_id'
});


//----------book lends-----------
User.hasMany(Book_Lends, {
  foreignKey: 'lend_user_id',
  onDelete: 'CASCADE'
});

Book_Lends.belongsTo(User, {
  foreignKey: 'lend_user_id'
});

Book.hasMany(Book_Lends, {
  foreignKey: 'book_id',
  onDelete: 'CASCADE'
});

Book_Lends.belongsTo(Book, {
  foreignKey: 'book_id'
});

Category.hasMany(Book_Lends, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
});

Book_Lends.belongsTo(Category, {
  foreignKey: 'category_id'
});

Library.hasMany(Book_Lends, {
  foreignKey: 'library_id',
  onDelete: 'CASCADE'
});

Book_Lends.belongsTo(Library, {
  foreignKey: 'library_id'
});




module.exports = { sequelize, User, Library, Category, Book, Book_Lends };
