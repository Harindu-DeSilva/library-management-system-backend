const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Library} = require('../models');
const { hmacProcess} = require("../utils/hmac");
const codeEmail = require("../middlewares/sendMail");


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


exports.passwordChange =  async (data) => {
  
  const user = await User.findByPk(data.userId);
  if (!user) throw new Error('User not found');

  if(data.newPassword !== data.confirmPassword){
    throw new Error('password does not match');
  }

  const valid = await bcrypt.compare(data.currentPassword, user.password);
  if (!valid) throw new Error('Invalid current password');

  if (await bcrypt.compare(data.newPassword, user.password)) {
    throw new Error('New password cannot be same as old password');
  }


  const hashed = await bcrypt.hash(data.newPassword, 10);

  await user.update({
    password: hashed
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



exports.getCurrentUser = async (user_id) => {

  const user = await User.findByPk(user_id);

  if(!user) throw new Error('User not found');

  return user;

};



exports.sendCodeForForgetPassword = async (email) => {

  const existingUser = await User.findOne({where:{email: email} });

  if(!existingUser){
    throw new Error('User does not exists!');
  }

  const codeValue = Math.floor( Math.random() * 1000000).toString();

  let info = await codeEmail.sendMail({
    from: process.env.CODE_SENDING_EMAIL_USER,
    to: existingUser.email,
    subject: "Forgot Password Verification Code - Library Management System",
    html: `<p>Your forgot password verification code is: <b>${codeValue}</b></p>`
  })

  if(info.accepted[0] === existingUser.email){

    const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

    existingUser.forgotPasswordCode = hashedCodeValue;
    existingUser.forgotPasswordCodeValidation = Date.now();
    await existingUser.save();

    return {success: true};
  }
};




exports.verifyCodeForForgetPassword = async (data) => {

  const codeValue = data.providedCode.toString();
  const existingUser = await User.findOne({where: {email: data.email} });

  if(!existingUser){
    throw new Error('User does not exists!');
  }

  if(!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation){
    throw new Error('No verification code found! Please request a new code.');
  }

  const newPassword = data.newPassword.toString().trim();
  const oldPassword = existingUser.password.toString().trim();

  if (await bcrypt.compare(newPassword, oldPassword)) {
    throw new Error('New password cannot be same as old password');
  }


  //verification code expires in 5 minutes
  if(Date.now() - existingUser.forgotPasswordCodeValidation > 5 * 60 * 1000){
    throw new Error('Verification code expired! Please request a new code.');
  }

  const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)

  if(hashedCodeValue === existingUser.forgotPasswordCode){
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    existingUser.forgotPasswordCode = null;
    existingUser.forgotPasswordCodeValidation = null;
    const changed = await existingUser.save();

    return changed;
  }

  throw new Error('Invalid verification code!');

};