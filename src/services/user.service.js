const {User, Library} = require('../models');

exports.registerUser = async (data) => {

  const library = await Library.findByPk(data.library_id);
  if(!library)throw new Error('No Library found under this Library ID');

  const existing = await User.findOne({where: {email: data.email}});

  if(existing) throw new Error('User already exists with this email');

  const newUser = await User.create({...data});

  return newUser;

};