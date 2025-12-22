const Library = require('../models/library');


exports.registerLibrary = async (data) => {

  const existing = await Library.findOne({where: {email: data.email}});

  if(existing) throw new Error('Library for this email already exists');

  const newLibrary = await Library.create({...data});

  return newLibrary;
};


exports.AllLibraries = async () => {

  const libraries = await Library.findAll();

  if(!libraries) throw new Error('Libraries not found! Please register a library first.');

  return libraries;

};



exports.libraryById= async (lib_id_params, role, library_id) => {

  let library;

  if(role === "superAdmin"){

    library = await Library.findOne({where: {id: lib_id_params}});
    
  }else if((role === "admin" || role === "user") && library_id === lib_id_params){

    library = await Library.findOne({where: {id: lib_id_params }});

  }

  return library;

};


exports.updateLibById = async (data, lib_id_params, role, library_id) => {

  let updated_Library;

  if(role === "superAdmin"){

    updated_Library = await Library.update(
      data, 
      {
        where: {id: lib_id_params}
      }
    );
  }else if(role === "admin" && lib_id_params === library_id){

    updated_Library = await Library.update(
      data,
      {
        where: {id: lib_id_params}
      }
    );

  }
  if(updated_Library){
    const new_Library = await Library.findOne({where: {id: lib_id_params}});
    return new_Library;
  }else{
    return null;
  }

};



exports.deleteLib = async (lib_id_params) => {

  const deleted = await Library.destroy({where: {id: lib_id_params}});

  if(!deleted) throw new Error('No libraries found under this ID');

  return deleted;

}