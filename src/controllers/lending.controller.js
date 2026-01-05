const { lendNewBook } = require("../services/lending.service");
const { lendingCreateValidationSchema } = require("../validations/lendingValidation");

exports.LendBooksToUsers = async (req,res) => {
  try{
    const { book_id } = req.params;
    const { lend_user_id, quantity, category_id, library_id,  due_date } = req.body;

    const { error, value } = await lendingCreateValidationSchema.validate({
      lend_user_id, book_id, quantity, category_id, library_id, due_date
    });

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const lendBook = await lendNewBook({value})

    return res.status(201).json({success: true, lendBook});


  }catch(error){
    console.error(error);
    return res.status(500).json({success:false, message: error.message});
  }
}