const { addNewBook } = require("../services/book.service");
const { bookSchema } = require("../validations/book.validation");


// add new books 
exports.createBook = async (req, res) => {
  try {
    const { title, category_id, author } = req.body;
    const file = req.file;

    const { error, value } = await bookSchema.validate({
      title,
      category_id,
      author
    });

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const addBook = await addNewBook({...value, file});

    return res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book: addBook
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message});
  }
};
