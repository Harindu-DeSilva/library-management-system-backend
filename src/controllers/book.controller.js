const { addNewBook, getAllBooks, getAllBooksByCategory, getBookById, updateBook, deleteBook } = require("../services/book.service");
const { bookSchema, updateBookSchema } = require("../validations/book.validation");


// add new books 
exports.createBook = async (req, res) => {
  try {
    const { title, category_id, author, quantity } = req.body;
    const file = req.file;
    const { library_id } = req.user;

    const { error, value } = await bookSchema.validate({
      title,
      category_id,
      author,
      quantity
    });

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const addBook = await addNewBook({...value, file, library_id});

    return res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book: addBook
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message});
  }
};


// fetch all books 
exports.fetchAllBooks = async (req,res) => {

  const { role, library_id } = req.user;

  try{

    const result = await getAllBooks(role, library_id);

    if (result.books.length === 0) {
      return res.status(404).json({ success: false, message: 'Books not found' });
    }

    return res.status(200).json(result);

  }catch(error){
    return res.status(500).json({error: error.message});
  }

};


//fetch all books by category ID
exports.fetchAllBooksByCategoryID = async (req,res) => {

  const { category_id } = req.params;
  const { role, library_id } = req.user;

  try{

    const result = await getAllBooksByCategory(category_id, role, library_id);

    if(result.books.length === 0){
      return res.status(404).json({success: false, message: 'Books not found under this category'});
    }

    return res.status(200).json(result);

  }catch(error){
    return res.status(500).json({error: error.message});
  }

};


//fetch book by book ID
exports.fetchBookByID = async (req,res) => {

  const { book_id } = req.params;
  const { role, library_id } = req.user;

  try{

    const book = await getBookById(book_id, role, library_id);

    return res.status(200).json({
      success: true,
      book
    });

  }catch(error){
    return res.status(500).json({success: false, error: error.message});
  }

};


// update book by book ID
exports.updateBookById = async (req,res) => {

  const { book_id } = req.params;
  const { title, category_id, author, quantity, damaged } = req.body;
  const file = req.file;
  const { library_id } = req.user;

  try{

    const { error, value } = await updateBookSchema.validate({title, category_id, author, quantity, damaged});

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const updatedBook =  await updateBook({...value, file, book_id, library_id});

    return res.status(201).json({
      success: true,
      book: updatedBook
    });

  }catch(error){
    console.error(error);
    return res.status(500).json({error: error.message});
  }

};


// delete book by ID
exports.deleteBookById = async (req,res) => {

  const { book_id } = req.params;
  const { library_id } = req.user;

  try{

    const result = await deleteBook(book_id, library_id);

    if(!result){
      return res.status(404).json({success: false, message: 'Book not found'});
    }

    return res.status(200).json({
      success: true,
      message: 'Book records deleted successfully'
    });

  }catch{
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }

};