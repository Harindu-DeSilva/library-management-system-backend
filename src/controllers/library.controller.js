const Library = require("../models/library");
const { registerLibrary, AllLibraries, libraryById } = require("../services/library.service");
const { librarySchema } = require("../validations/library.validation");



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



exports.getAllLibraries = async (req,res,next) => {

  try{

    const libraries = await AllLibraries();
    

    return res.status(200).json({ libraries });

  }catch(err){

    return res.status(500).json({message: 'Internal server eroor', err: err.message});

  }

};


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