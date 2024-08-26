const nodemailer = require('nodemailer');
require('dotenv').config();
const { EMAIL_TYPES } = require('../api/constants');

function getExpirationTime(token) {
  const expirationDate = new Date(
    token.createdAt.getTime() + 60 * 60 * 24 * 1000
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
  const expirationDateGreek = expirationDate.toLocaleString('el-GR', options);

  return expirationDateGreek;
}

function setSubjectByEmailType(type) {
  switch (type) {
    case EMAIL_TYPES.REGISTRATION:
      return 'Καλώς ήρθες στο car share';
    case EMAIL_TYPES.REGISTRATION_GOOGLE:
      return 'Καλώς ήρθες στο car share';
    case EMAIL_TYPES.BOOKING_OWNER:
      return 'Νέα κράτηση';
    case EMAIL_TYPES.BOOKING_RENTER:
      return 'Νέα κράτηση';
    case EMAIL_TYPES.BOOKING_ACCEPTANCE:
      return 'Η κράτηση σου επιβεβαιώθηκε!';
    case EMAIL_TYPES.BOOKING_REJECTION:
      return 'Η κράτηση σου απορρίφθηκε';
    case EMAIL_TYPES.BOOKING_CANCELEATION_BY_OWNER:
      return 'Ακύρωση από owner';
    case EMAIL_TYPES.BOOKING_CANCELEATION_BY_RENTER:
      return 'Ακύρωση από renter';
    default:
      return 'ok';
  }
}

function setBodyByEmailType(emailInfo) {
  let expirationDateGreek;
  if (emailInfo.token) {
    expirationDateGreek = getExpirationTime(emailInfo.token);
  }
  switch (emailInfo.type) {
    case EMAIL_TYPES.REGISTRATION:
      return `<html> <b>Welcome ${emailInfo.user.name} </b> <p> Verify your account here localhost:8080/api/users/verify?token=${emailInfo.token.tokenId} until ${expirationDateGreek} </p></html>`;
    case EMAIL_TYPES.REGISTRATION_GOOGLE:
      return `<html> <b>Welcome ${emailInfo.user.name} </b></html>`;
    case EMAIL_TYPES.VERIFICATION:
      return `<html> <p> Verify your account here localhost:8080/api/users/verify?token=${emailInfo.token.tokenId} until ${expirationDateGreek}</html>`;
    case EMAIL_TYPES.BOOKING_OWNER:
      return '<html> Νέα κράτηση για τον ιδιοκτήτη</html>';
    case EMAIL_TYPES.BOOKING_RENTER:
      return '<html> Νέα κράτηση για τον renter</html>';
    case EMAIL_TYPES.BOOKING_ACCEPTANCE:
      return '<html>  Αποδοχη </html>';
    case EMAIL_TYPES.BOOKING_REJECTION:
      return '<html>Απόρριψη </html>';
    case EMAIL_TYPES.BOOKING_CANCELEATION_BY_OWNER:
      return '<html>Ακύρωση από owner</html>';
    case EMAIL_TYPES.BOOKING_CANCELEATION_BY_RENTER:
      return '<html>Ακύρωση από renter</html>';
    default:
      return 'verified';
  }
}

/**
 * Send email
 * @param {String} param0 type
 * @param {Object} param1 user
 * @param {String} param2 token
 * @param {Object} param3 info
 *
 */
async function sendEmail(emailInfo) {
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
    to: emailInfo.user.email,
    subject: setSubjectByEmailType(emailInfo.type),
    html: setBodyByEmailType(emailInfo),
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
