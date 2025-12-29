const { signupUser, loginUser, resetPasswordAtFirstLogin, getCurrentUser } = require('../services/auth.service');
const { signupSchema, loginSchema, changePasswordSchema } = require('../validations/auth.validation');


exports.signup = async (req,res, next) => {

  const { name, email, password, role, library_id } = req.body;

  try{

    const {error, value} = await signupSchema.validate({name, email, password, role, library_id});

    if(error){
       return res.status(400).json({message: error.details[0].message});
    }

    const user = await signupUser(value);

    return res.status(201).json({message: "User signup successfully", user});

  }catch (error) {

    if (error.message.includes('exists')) {
      return res.status(409).json({ message: error.message });
    }

    res.status(500).json({message: 'Internal server error',error: error.message});
  }

};


//login
exports.login = async (req,res, next) => {

  const {email, password} = req.body;

  try{

    const { error, value } = await loginSchema.validate({ email, password });

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const {safeUser,token} = await loginUser(value);

     // Set JWT as HTTP-only cookie
    res.cookie('Authorization', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 8 * 60 * 60 * 1000, 
    });

    return res.status(200).json({message:'user login successfully', user:safeUser,token});

  }catch(error){
    return res.status(500).json({success: false, error: error.message});
  }

};


//logout
exports.logout = async (req,res,next) => {

  try{
    res.clearCookie("Authorization", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
  });

  return res.status(200).json({ success: true, message: "Logged out" });



  }catch(err){
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


//reset password
exports.resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try{

    const { error, value } = await changePasswordSchema.validate({oldPassword, newPassword});

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const {safeUser,token} = await resetPasswordAtFirstLogin({...value, userId});

    
    res.cookie('Authorization', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 8 * 60 * 60 * 1000, 
    });

    return res.status(200).json({message:'user login successfully', user:safeUser, token});

  }catch(error){
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }

};


// get data of current user
exports.authMe = async (req,res) => {

  const { id } = req.user;

  try{

    const current_user = await getCurrentUser(id);

    return res.status(200).json({
      success: true,
      user: current_user
    });

  }catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

};