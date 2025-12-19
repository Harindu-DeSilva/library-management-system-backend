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


exports.loginUser = async (data) => {

  const user = await User.findOne({ where: { email: data.email } });

  if(!user) throw new Error('Invalid credentials or user does not exists');

  const valid =  await bcrypt.compare(data.password, user.password);
  if(!valid) throw new Error('Invalid credentials');

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      library_id: user.library_id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '8h'
    }
  );

  const { password, ...safeUser } = user.toJSON();

  return { safeUser, token };

};