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
    library_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'libraries',
        key: 'id'
      }
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
    },
    image_public_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
   status: {
      type: DataTypes.ENUM('available', 'borrowed', 'damaged'),
      defaultValue: 'available',
      allowNull: false
    }

  }, {
    tableName: 'books',
    timestamps: true
  });
};
