const { lendNewBook, getAllLendData, updateLendData } = require("../services/lending.service");
const { lendingCreateValidationSchema, lendingUpdateValidationSchema } = require("../validations/lendingValidation");

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

    const lendBook = await lendNewBook({...value})

    return res.status(201).json({success: true, lendBook});


  }catch(error){
    console.error(error);
    return res.status(500).json({success:false, message: error.message});
  }
};


exports.fetchAllLendRecords = async (req,res) => {

  try{
    const { library_id, user_id } = req.user;

    const result = await getAllLendData(library_id, user_id);

    if(result.lends.length === 0){
      return res.status(404).json({success: false, message: 'records not found'});
    }

    return res.status(200).json({success: true, result});

  }catch(error){
    return res.status(500).json({success: false, Error: error.message});
  }

};


exports.updateLendRecords = async (req,res) => {
  try{

    const { lend_id } = req.params;
    const { book_id, status, quantity, return_date } = req.body;

    const { error,value } = await lendingUpdateValidationSchema.validate({book_id, quantity, return_date, status});

    if(error){
      return res.status(400).json({success: false, message: error.details[0].message});
    }

    const result = await updateLendData({...value, lend_id});

    if(!result){
      return res.status(400).json({success: false, message: 'update failed'});
    }

    return res.status(200).json({success: true, result});

  }catch(error){
    return res.status(500).json({success:false, Error: error.message});
  }
};