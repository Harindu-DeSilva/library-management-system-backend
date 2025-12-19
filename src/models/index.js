const { sequelize, testConnection } = require('../config/database');

testConnection();

module.exports = { sequelize };