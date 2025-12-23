const { sequelize, testConnection } = require('../config/database');
testConnection();

// Import models as functions and pass sequelize
const Library = require('./library')(sequelize);
const User = require('./user')(sequelize);
const Category = require('./category')(sequelize);

// Define associations
Library.hasMany(User, {
  foreignKey: 'library_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

User.belongsTo(Library, {
  foreignKey: 'library_id'
});

Category.hasMany(Category, {
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

module.exports = { sequelize, User, Library, Category };
