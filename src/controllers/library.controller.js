const Library = require("../models/library");
const { registerLibrary, AllLibraries } = require("../services/library.service");
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

}