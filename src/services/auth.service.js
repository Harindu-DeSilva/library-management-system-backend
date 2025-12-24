const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Library} = require('../models');


exports.signupUser = async (data) => {

  const library = await Library.findByPk(data.library_id);
  if(!library)throw new Error('No Library found under this Library ID');

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
      library_id: user.library_id,
      oneTime: Boolean(user.oneTime)
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '8h'
    }
  );

  const { password, ...safeUser } = user.toJSON();

  return { safeUser, token };

};


exports.resetPasswordAtFirstLogin = async (data) => {

  const user = await User.findByPk(data.userId);
  if (!user) throw new Error('User not found');

  if(user.oneTime !== true){
    throw new Error('Please forget your password to continue');
  }

  const valid = await bcrypt.compare(data.oldPassword, user.password);
  if (!valid) throw new Error('Invalid current password');


  if (await bcrypt.compare(data.newPassword, user.password)) {
    throw new Error('New password cannot be same as old password');
  }


  const hashed = await bcrypt.hash(data.newPassword, 10);

  await user.update({
    password: hashed,
    oneTime: false
  });

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      library_id: user.library_id,
      oneTime: false
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '8h'
    }
  );

  const { password, ...safeUser } = user.toJSON();

  return { safeUser, token };

};
