const { signupUser } = require("../services/auth.service");
const { getAllUsers, getUsersById, updateUser, deleteUser } = require("../services/user.service");
const { userRegisterSchema, userUpdateSchema } = require("../validations/user.validation");


// create user accounts
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


// fetch all user records by 10 per page
exports.fetchAllUsers = async (req,res,next) => {

  const { library_id, role } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const search = req.query.search || "";

  try{

    const result = await getAllUsers(
      library_id,
      role,
      parseInt(page),
      parseInt(limit),
      search
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

};


//get user records by user ID
exports.fetchUserById = async (req,res,next) => {

  const { user_id } = req.params;
  const { role, library_id, id } = req.user;

  try{

    const user = await getUsersById( user_id, role, library_id, id );

    return res.status(200).json({
      success: true,
      user
    });

  }catch(error){

     if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error', error: error.message
    });
  }

};


// update user details by user id
exports.updateUserById = async (req,res,next) => {

  const { user_id } = req.params
  const data = req.body;
  const { id } = req.user;

  try{

    const { error, value } = await userUpdateSchema.validate(data);

    if(error){
      return res.status(400).json({message:error.details[0].message});
    }

    const user = await updateUser(data, user_id, id);

    return res.status(201).json({
      success: true,
      message:("User updated successfully"),
      user
    });

  }catch(error){

     if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });

  }


};


//delete user by User ID
exports.deleteUserById = async (req,res) => {

  const { user_id } = req.params;
  const { role, library_id, id } = req.user;

  try{

    const result = await deleteUser(user_id, role, library_id, id);

    if(result) return res.status(200).json({message: 'User deleted successfully'})

  }catch(error){

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }

};