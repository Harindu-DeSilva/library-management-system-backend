const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



exports.signupUser = async (data) => {
  const existing = await User.findOne({ where: { email: data.email } });

  if(existing) throw new Error('Email already exists!');

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashedPassword});

  const { password, ...safeUser } = user.toJSON();
  return safeUser;

};