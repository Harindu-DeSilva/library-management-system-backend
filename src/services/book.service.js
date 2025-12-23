const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { Book, Category } = require('../models');

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
    category_id: data.category_id,
    image
  });

  return newBook;
};
