const { newCategory, getCategories, editCategory, removeCategory } = require("../services/category.service");
const { categorySchema, updateCategorySchema } = require("../validations/category.validation");


// create categories by library admin
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

};


//fetch all categories based on library ID
exports.fetchAllCategories = async (req,res,next) => {

  const { lib_id_params } = req.params;
  const { role, library_id } = req.user;

  try{

    const categories = await getCategories(lib_id_params, role, library_id);

    if(!categories){
      return res.status(404).json({message: "Categories not found"});
    }

    return res.status(200).json(categories);

  }catch(error){
    return res.status(500).json({message: error.message});
  }

};

//update category details by admin
exports.updateCategory = async (req,res) => {

  const { category_id } = req.params;
  const data = req.body;
  const { library_id } = req.user;

  try{

    const { error, value } = await updateCategorySchema.validate(data);

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const updatedCategory = await editCategory(value, category_id, library_id);

    return res.status(201).json({
      success: true,
      category: updatedCategory
    });

  }catch(error){
    return res.status(500).json({message: error.message});
  }

};


//delete category by admin
exports.deleteCategory = async (req,res) => {

  const { category_id } = req.params;
  const { library_id } =req.user;

  try{

    const categoryDelete = await removeCategory(category_id, library_id);

    return res.status(200).json({message: 'Category deleted successfully'});

  }catch(error){
    return res.status(500).json({error: error.message});
  }

};