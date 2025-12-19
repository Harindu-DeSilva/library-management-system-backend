
const Library = require('../models/library');


exports.registerLibrary = async (data) => {

  const existing = await Library.findOne({where: {email: data.email}});

  if(existing) throw new Error('Library for this email already exists');

  const newLibrary = await Library.create({...data});

  return newLibrary;
};