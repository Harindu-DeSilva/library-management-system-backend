const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define('Book', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories', 
        key: 'id'
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE'
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,  
      allowNull: true
    }
  }, {
    tableName: 'books',
    timestamps: true
  });
};
