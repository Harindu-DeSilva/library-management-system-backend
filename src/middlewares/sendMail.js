const nodemailer = require('nodemailer');

const codeEmail = nodemailer.createTransport({

  service:'gmail',
  auth: {
    user: process.env.CODE_SENDING_EMAIL_USER,
    pass: process.env.CODE_SENDING_EMAIL_PASS
  }

});

module.exports = codeEmail;