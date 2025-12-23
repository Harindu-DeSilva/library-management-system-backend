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