const { DataTypes } = require("sequelize");
const { sequelize } = require('./index');



const Library = sequelize.define('Library', {
  id:{
    type: DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },
  name:{
    type: DataTypes.STRING,
    allowNull:false
  },
  email: {
    type: DataTypes.STRING,
    unique:true,
    allowNull:false
  },
  address:{
    type: DataTypes.STRING,
    allowNull:true
  },
},
{
  tableName: 'libraries',
  timestamps: true
});

module.exports = Library