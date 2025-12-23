const { Category, Library, User } = require('../models');


exports.newCategory = async (data, library_id, admin_id) => {

  const library_exists = await Library.findOne(
    {
      where: {id: library_id}
    }
  );

  if(!library_exists) throw new Error('Library not found');

  const admin_exists = await User.findOne(
    {
      where: {
        id: admin_id, 
        library_id: library_id
      }
    }
  );

  if(!admin_exists) throw new Error('User not exists');

  const category_exists = await Category.findOne(
    {
      where: {
        category_name: data.category_name, 
        library_id: library_id
      }
    }
  );

  if(category_exists) throw new Error('category already exists in this library');

  const newCategory = await Category.create({
    category_name: data.category_name,
    library_id: library_id,
    admin_id: admin_id
  });

  return newCategory;

};


exports.getCategories = async (lib_id_params, user_role ,library_id, page = 1, limit = 10) => {

  const offset = (page - 1) * limit;

  let whereClause = {};

  if(user_role === "superAdmin"){

    whereClause.library_id = lib_id_params;

  }else if ((user_role === "admin" || user_role === "user") && lib_id_params === library_id){
    if(lib_id_params !== library_id){
      throw new Error("Forbidden: You do not have access for this");
    }
    whereClause.library_id = lib_id_params;
  }

  const { rows: categories, count } = await Category.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['createdAT', 'DESC']]
  });

  return {
    categories,
    pagination: {
      totalCategories: count,
      currentPage: page,
      totalPages: Math.ceil(count/limit),
      pageSize: limit
    }
  };

};


exports.editCategory = async (data, category_id, admin_library_id) => {

  const category_exists = await Category.findOne({where: {id: category_id}});
  if(!category_exists){
    throw new Error('Category not found');
  }

  if(category_exists.library_id === admin_library_id){

    const category = await Category.update(
      data,
      {
        where: {
          id: category_id
        }
      }
    );

    if(!category) throw new Error('Category update failed');

    const newCategory = await Category.findOne({
      where: {
        id: category_id
      }
    });

    return newCategory;

  }else{
    throw new Error('Forbidden: you do not have access');
  }

};



exports.removeCategory = async (category_id, admin_library_id) => {

  const exists = await Category.findOne(
    {
      where:{
        id: category_id
      }
    }
  );

  if(!exists) throw new Error("Category not found");

  if(exists.library_id === admin_library_id){

    const deleteCaegory = await Category.destroy({
      where: {
        id: category_id
      }
    });

    if(!deleteCaegory) throw new Error('Category delete failed');

    return deleteCaegory;

  }

}