const { signupUser } = require('../services/auth.service');
const { signupSchema } = require('../validations/auth.validation');

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