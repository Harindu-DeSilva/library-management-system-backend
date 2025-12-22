const {User, Library} = require('../models');

exports.registerUser = async (data) => {

  const library = await Library.findByPk(data.library_id);
  if(!library)throw new Error('No Library found under this Library ID');

  const existing = await User.findOne({where: {email: data.email}});

  if(existing) throw new Error('User already exists with this email');

  const newUser = await User.create({...data});

  return newUser;

};



exports.getAllUsers = async (library_id, role, page = 1, limit = 10) => {

  const offset = (page - 1) * limit;

  let whereClause = {};
  if(role === "admin"){

    whereClause.library_id = library_id;

  }

  const { rows: users, count } = await User.findAndCountAll({
    where: whereClause,
    attributes: { exclude: ['password'] },
    limit,
    offset,
    order: [['createdAT', 'DESC']]
  });

  return {
    users,
    pagination: {
      totalUsers: count,
      currentPage: page,
      totalPages: Math.ceil(count/limit),
      pageSize: limit
    }
  };

};



exports.getUsersById = async (user_id, role, library_id, requester_id) => {

  const user =  await User.findOne(
    {
      where: {id: user_id},
      attributes: {exclude: ['password']}
    }
  );

  if(!user) throw new Error('USER_NOT_FOUND');

  if(role === "superAdmin"){

    return user;

  }

  if(role === "admin"){

    if(user.library_id !== library_id){
      throw new Error("FORBIDDEN");
    }
    return user;

  }

  if(user.id !== requester_id){
    throw new Error("FORBIDDEN");
  }

  return user;

};


exports.updateUser = async (data,user_id_params, user_id) => {

  if(user_id_params === user_id){

    const user = await User.update(
      data,
      {
        where: {id: user_id_params}
      }
    );

    if(!user) throw new Error("USER_NOT_FOUND");

    const newUser = await User.findOne(
      {
        where: {id: user_id_params},
        attributes: {exclude: ['password']}
      }
    );

    return newUser;

  }else{
    throw new Error("FORBIDDEN");
  }

};


exports.deleteUser = async (user_id, role, library_id, requester_id) => {

  const user = await User.findOne({where: {id: user_id}});
  if(!user) throw new Error("User not found")

 

  if(role === "admin" && library_id !== user.library_id){

    throw new Error('FORBIDDEN');

  }

  if(user.id === requester_id){
    throw new Error('FORBIDDEN');
  }

  const deletedUser = await User.destroy({where: {id: user_id}});

  return deletedUser;

}