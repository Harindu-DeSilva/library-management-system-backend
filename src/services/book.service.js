const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { Book, Category, Library } = require('../models');

// upload images to cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'books' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

exports.addNewBook = async (data) => {

  const category = await Category.findOne({
    where: { id: data.category_id }
  });

  if (!category) throw new Error('Category does not exist');

  
  const existingBook = await Book.findOne({
    where: {
      title: data.title,
      category_id: data.category_id
    }
  });

  if (existingBook) throw new Error('Book already exists');

  let image = null;
  if (data.file) {
    image = await uploadToCloudinary(data.file);
  }

  const newBook = await Book.create({
    title: data.title,
    author: data.author,
    library_id: data.library_id,
    category_id: data.category_id,
    image
  });

  return newBook;
};


exports.getAllBooks = async (user_role, library_id,page = 1, limit = 10) => {

  const offset = (page - 1) * limit;

  let whereClause = {};

  if(user_role === "superAdmin"){
    whereClause;
  }else if(user_role === "admin" || user_role === "user"){
    whereClause.library_id = library_id;
  }

  const { rows: books, count} = await Book.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['createdAT', 'DESC']]
  });


  return {
    books,
    pagination: {
      totalBooks: count,
      currentPage: page,
      totalPages: Math.ceil(count/limit),
      pageSize: limit
    }
  };

};

exports.getAllBooksByCategory = async (category_id, user_role, user_library_id, page = 1, limit = 10) => {

  const offset = (page - 1) * limit;

  // Check category exists
  const category = await Category.findOne({
    where: { id: category_id }
  });

  if (!category) {
    throw new Error('Category does not exist');
  }

  
  if (user_role !== 'superAdmin' && category.library_id !== user_library_id) {
    throw new Error('Access denied to this category');
  }

  const whereClause = {
    category_id
  };

  if (user_role !== 'superAdmin') {
    whereClause.library_id = user_library_id;
  }

  const { rows: books, count } = await Book.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    books,
    pagination: {
      totalBooks: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      pageSize: limit
    }
  };
};


exports.getBookById = async (book_id, user_role, user_library_id) => {

  const book = await Book.findOne({
    where: { id: book_id }
  });

  if (!book) {
    throw new Error('Book does not exist');
  }

  
  if (user_role !== 'superAdmin' && book.library_id !== user_library_id) {
    throw new Error('Book is not available in this library');
  }

  return book;

};
