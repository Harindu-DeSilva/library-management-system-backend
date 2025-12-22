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