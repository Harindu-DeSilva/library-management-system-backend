const {  DataTypes } = require("sequelize");


module.exports = (sequelize) => {
  return sequelize.define('Category', {
    id: {
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    category_name: {
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
    admin_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
  },{
    tableName: 'categories',
    timestamps: true
  });
};