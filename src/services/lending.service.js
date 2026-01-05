const { Book, Category, Book_Lends } = require("../models");



exports.lendNewBook = async (data) => {

  const BookExists = await Book.findOne({where: {id:data.book_id}})

  if(!BookExists) throw new Error('Book not found');

  const categoryExists = await Category.findOne({
    where: {id: data.category_id, library_id: data.library_id}
  });

  if(!categoryExists) throw new Error('Invalid category or access denied');

  const bookLend = await Book_Lends.create({
    lend_user_id: data.lend_user_id,
    book_id: data.book_id,
    quantity: data.quantity,
    category_id: data.category_id,
    library_id: data.library_id,
    due_date: data.due_date,
  });

  return bookLend;

};