const nodemailer = require('nodemailer');
require('dotenv').config();
const { EMAIL_TYPES } = require('../api/constants');

function setSubjectByEmailType(type) {
  switch (type) {
    case EMAIL_TYPES.REGISTRATION:
      return 'Καλώς ήρθες στο car share';
    default:
      return 'ok';
  }
}

function setBodyByEmailType(type, user, token) {
  switch (type) {
    case EMAIL_TYPES.REGISTRATION:
      const expirationDate = new Date(
        user.createdAt.getTime() + 60 * 60 * 24 * 1000
      );
      console.log('The document will expire on:', expirationDate);
      const options = {
        timeZone: 'Europe/Athens',
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const expirationDateGreek = expirationDate.toLocaleString(
        'el-GR',
        options
      );
      return `<html> <b>Welcome ${user.name} </b> <p> Verify your account here until ${expirationDateGreek}</html>`;
    default:
      return 'verified';
  }
}

async function sendEmail(type, user, token) {
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
    to: user.email,
    subject: setSubjectByEmailType(type),
    html: setBodyByEmailType(type, user, token),
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
