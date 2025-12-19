const {  Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false
  }
);


const testConnection = async () => {

  try{
    await sequelize.authenticate();
    console.log('MySQL Connected Successfully.');
  }catch(error){
    console.error('MySQL Connection Failed:', error.message);
  }

};


module.exports = { sequelize, testConnection };