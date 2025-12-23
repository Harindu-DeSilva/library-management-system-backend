const { newCategory } = require("../services/category.service");
const { categorySchema } = require("../validations/category.validation");


exports.createNewCategory = async (req,res,next) => {

  const { category_name } = req.body;
  const { library_id, id } = req.user;
  const admin_id = id;

  try{

    const { error, value } = await categorySchema.validate({
      category_name,
      library_id,
      admin_id
    });

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const new_category = await newCategory(value, library_id, id);


    return res.status(201).json({
      success: true,
      message: 'Category added successfully',
      category: new_category
    });

  }catch(error){
    return res.status(500).json({success: false, message: error.message});
  }

}