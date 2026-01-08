const { registerLibrary, AllLibraries, libraryById, updateById, updateLibById, deleteLib } = require("../services/library.service");
const { librarySchema, updateLibrarySchema } = require("../validations/library.validation");


//register a new library
exports.newLibrary = async (req,res,next) => {

  const { name, address, email } = req.body;

  try{

    const { error,value } = await librarySchema.validate({name, address, email});

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const library = await registerLibrary(value);

    return res.status(201).json({message: "Library added successfully", library});

  }catch(err){

    if(err.message.includes('exists')){
      return res.status(409).json({message: err.message});
    }

    res.status(500).json({message: 'Internal server error', err: err.message});

  }

};


// fetch all libraries
exports.getAllLibraries = async (req,res,next) => {

  
  const { page = 1, limit = 10 } = req.query;
  
  const search = req.query.search || "";

  try{

    const result = await AllLibraries(parseInt(page), parseInt(limit), search);

    if(!result.libraries.length){
      return res.status(404).json({
        success: false,
        message: 'No libraries found'
      });
    }   

    return res.status(200).json({success:true, ...result });

  }catch(err){
    console.error(err);

    return res.status(500).json({message: 'Internal server eroor', err: err.message});

  }

};


// get libraries by id
exports.getLibraryById = async (req,res,next) => {

  const {lib_id_params} = req.params;
  const { role, library_id } = req.user;

  try{

    const library = await libraryById(lib_id_params, role, library_id);

    if(!library){
      return res.status(403).json({
        success: false,
        message: 'No Library found or Access denied'
      })
    };

    return res.status(200).json({
      success: true,
      library
    });


  }catch(err){
    return res.status(500).json({message: 'Internal server error', err: err.message});
  }

};


// updated libraries by id
exports.updateLibrary = async (req,res) => {

  const { lib_id_params } = req.params;
  const data = req.body;
  const { role, library_id } = req.user;

  try{

    const { error, value } = await updateLibrarySchema.validate(data);

    if(error) {
      return res.status(400).json({message: error.details[0].message});
    }

    const updated = await updateLibById(value, lib_id_params, role, library_id);

    if(!updated){
      return res.status(403).json({
        success:false,
        message: 'Access denied or No library found to update!'
      });
    }

    return res.status(200).json({
      success: true,
      library: updated
    })

  }catch(error){
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }

};



//delete library by id 
exports.deleteLibraryById = async (req,res) => {

  const { lib_id_params } = req.params;

try{

  const deleted = await deleteLib(lib_id_params);

  if(!deleted){
    return res.status(403).json({
      success:false,
      message: 'Access denied or Library not found'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Library deleted successfully'
  });

}catch(error){
  return res.status(500).json({
    success: false,
    message: 'Internal server error', error: error.message
  });
}

}