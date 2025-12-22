const { sequelize, testConnection } = require('../config/database');
testConnection();

// Import models as functions and pass sequelize
const Library = require('./library')(sequelize);
const User = require('./user')(sequelize);

// Define associations
Library.hasMany(User, {
  foreignKey: 'library_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

User.belongsTo(Library, {
  foreignKey: 'library_id'
});

module.exports = { sequelize, User, Library };
