const { signupUser } = require("../services/auth.service");
const { getAllUsers } = require("../services/user.service");
const { userRegisterSchema } = require("../validations/user.validation");



exports.createUser = async (req,res,next) => {

  const data = req.body;
  const { library_id, role } = req.user;

  try{

    const { error, value } = await userRegisterSchema.validate(data);

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    if(library_id === value.library_id || role === "superAdmin"){

      const user = await signupUser(value);

      if(!user){
        return res.status(500).json({message: 'Internal server error'})
      }

      return res.status(201).json({success:true, message: 'User account created successfully'});
    }else{
      return res.status(403).json({success: false, message: "Access denied"});
    }

  }catch(error){
    return res.status(500).json({message: 'Internal server error', error: error.message});
  }

};



exports.fetchAllUsers = async (req,res,next) => {

  const { library_id, role } = req.user;
  const { page = 1, limit = 10 } = req.query;

  try{

    const result = await getAllUsers(
      library_id,
      role,
      parseInt(page),
      parseInt(limit)
    );

    if(!result.users.length){
      return res.status(404).json({
        success: false,
        message: 'No users found'
      });
    }


    return res.status(200).json({success: true, ...result});

  }catch(error){
    return res.status(500).json({message: 'Internal server error', error: error.message});
  }

}