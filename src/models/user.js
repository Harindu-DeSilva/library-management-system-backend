const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');


const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  role: {
    type: DataTypes.ENUM('superAdmin', 'admin', 'user'),
    defaultValue: 'user'
  },
  library_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
},
{
  tableName: 'users',
  timestamps:true
});


module.exports = User;