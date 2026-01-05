const { DataTypes } = require("sequelize")


module.exports = (sequelize) => {
  return sequelize.define('Book_Lends', {
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    lend_user_id:{
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key:'id'
      }
    },
    book_id:{
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'books',
        key:'id'
      }
    },
    quantity:{
      type: DataTypes.NUMBER,
      allowNull:false
    },
    category_id:{
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key:'id'
      }
    },
    library_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'libraries',
        key: 'id'
      }
    },
    lending_date: {
      type: DataTypes.DATE,
      allowNull:false,
      defaultValue: DataTypes.NOW
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterLendingDate(value) {
          if (value <= this.lending_date) {
            throw new Error("Due date must be after lending date");
          }
        }
      }
    },

    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: { isDate: true }
    },

    status: {
      type: DataTypes.ENUM("BORROWED", "RETURNED", "OVERDUE"),
      defaultValue: "BORROWED"
    },

  }, {
    tableName: 'book_lends',
    timestamps: true
  })
};