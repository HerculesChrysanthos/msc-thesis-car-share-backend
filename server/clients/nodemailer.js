const nodemailer = require('nodemailer');
require('dotenv').config();
const { EMAIL_TYPES } = require('../api/constants');

function setSubjectByEmailType(type) {
  switch (type) {
    case EMAIL_TYPES.REGISTRATION:
      return 'Καλώς ήρθες στο car share';
    default:
      return '';
  }
}

function setBodyByEmailType(type, info) {
  switch (type) {
    case EMAIL_TYPES.REGISTRATION:
      return `<html> <b>Welcome ${info.name} </b> </html>`;
    default:
      return '';
  }
}

async function sendEmail(type, info) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: {
      name: 'Car Share',
      address: process.env.APP_EMAIL,
    },
    to: info.email,
    subject: setSubjectByEmailType(type),
    html: setBodyByEmailType(type, info),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  sendEmail,
};
