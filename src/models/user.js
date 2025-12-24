const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define('User', {
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
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    oneTime: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    role: {
      type: DataTypes.ENUM('superAdmin', 'admin', 'user'),
      defaultValue: 'user'
    },
    library_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'libraries',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }
  }, {
    tableName: 'users',
    timestamps: true
  });
};
