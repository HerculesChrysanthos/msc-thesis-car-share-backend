const nodemailer = require('nodemailer');
const ejs = require('ejs');
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
    case EMAIL_TYPES.VERIFICATION:
      return 'Επιβεβαίωσε το email σου';
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
      return 'Ακύρωση κράτησης';
    case EMAIL_TYPES.REVIEW_PROMP_RENTER:
      return 'Ολοκλήρωση κράτησης | Προσθηκη κριτικής απο τον ενοικιαστή';
    case EMAIL_TYPES.REVIEW_PROMP_ONWER:
      return 'Ολοκλήρωση κράτησης | Προσθηκη κριτικής απο τον ιδιοκτήτη';
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
      return `
                <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
                  <tr>
                     <td>
                        <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Επιβεβαίωσε τo email σου!</h2>
                        <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.user.name}<br /><br />Καλώς ήρθες και χαιρόμαστε πολύ να σε έχουμε στην παρέα μας! Το μόνο που μένει είναι να επιβεβαιώσεις το email σου πατώντας τον παρακάτω σύνδεσμο μέχρι τις ${expirationDateGreek}!<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
                        <div style="margin-top: 40px; padding-bottom: 10px;">
                           <a href="http://localhost:5173/verify-token?token=${emailInfo.token.tokenId}" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Επιβεβαίωση</a>
                        </div>
                     </td>
                  </tr>
               </table>
            `;
    case EMAIL_TYPES.REGISTRATION_GOOGLE:
      return `
                <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
                  <tr>
                     <td>
                        <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Καλές διαδρομές!</h2>
                        <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.user.name}<br /><br />Καλώς ήρθες και χαιρόμαστε πολύ να σε έχουμε στην παρέα μας!<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
                     </td>
                  </tr>
               </table>
            `;
    case EMAIL_TYPES.VERIFICATION:
      return `
                <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
                  <tr>
                    <td>
                        <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Επιβεβαίωσε τo email σου!</h2>
                        <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.user.name}<br /><br />Για να επιβεβαιώσεις το email χρειάζεται να πατήσεις τον παρακάτω σύνδεσμο μέχρι τις ${expirationDateGreek}!<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
                        <div style="margin-top: 40px; padding-bottom: 10px;">
                          <a href="http://localhost:5173/verify-token?token=${emailInfo.token.tokenId}" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Επιβεβαίωση</a>
                        </div>
                    </td>
                  </tr>
                </table>
          `;
    case EMAIL_TYPES.BOOKING_OWNER:
      return `
                <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
                  <tr>
                    <td style="width: 544px; height: 256px">
                        <img
                           src="https://ik.imagekit.io/carsharerentingapp/email-photo.png?updatedAt=1725785225480"
                           alt="New book image"
                           style="width: 544px; height: 256px"
                        />
                     </td>
                  </tr>
                  <tr>
                    <td>
                        <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Έχεις κράτηση!</h2>
                        <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.booking.car.owner.name}<br /><br />Έχεις μια νέα κράτηση για το όχημα <strong>${emailInfo.booking.car.make.name} ${emailInfo.booking.car.model.name}</strong> από τον ${emailInfo.booking.user.name} ${emailInfo.booking.user.surname}! Πηγαίνοντας στο προφίλ σου και στις κρατήσεις του οχήματος σου μπορείς να δεις περισσότερες πληροφορίες για το αίτημα καθώς και να το αποδεχτείς ή να το απορρίψεις!<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
                        <div style="margin-top: 40px; padding-bottom: 10px;">
                          <a href="http://localhost:5173/" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Η κράτηση</a>
                        </div>
                    </td>
                  </tr>
              </table>
            `;
    case EMAIL_TYPES.BOOKING_RENTER:
      return `
                <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
                  <tr>
                    <td style="width: 544px; height: 256px">
                        <img
                           src="https://ik.imagekit.io/carsharerentingapp/email-photo.png?updatedAt=1725785225480"
                           alt="New book image"
                           style="width: 544px; height: 256px"
                        />
                     </td>
                  </tr>
                  <tr>
                    <td>
                        <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Έχεις κράτηση!</h2>
                        <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.booking.user.name}<br /><br />Έχουμε κάλα νέα, η κράτηση για το όχημα <strong>${emailInfo.booking.car.make.name} ${emailInfo.booking.car.model.name}</strong>για τις <strong>${emailInfo.booking.startDate} ως τις ${emailInfo.booking.endDate}</strong> έγινε αποδεχτή! Πηγαίνοντας στο προφίλ σου και στις κρατήσεις σου μπορείς να δεις την κράτηση σου.<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
                        <div style="margin-top: 40px; padding-bottom: 10px;">
                          <a href="http://localhost:5173/" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Η κράτηση</a>
                        </div>
                    </td>
                  </tr>
                </table>
            `;
    case EMAIL_TYPES.BOOKING_ACCEPTANCE:
      return `
                <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
                  <tr>
                    <td>
                        <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Η κράτηση σου επιβεβαιώθηκε!</h2>
                        <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.user.name}<br /><br />Έχουμε κάλα νέα, η κράτηση για το όχημα <strong>${emailInfo.info.car.make.name} ${emailInfo.info.car.model.name}</strong> έγινε αποδεκτή. Πηγαίνοντας στο προφίλ σου και στις κρατήσεις σου μπορείς να δεις την κράτηση σου.<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
                        <div style="margin-top: 40px; padding-bottom: 10px;">
                          <a href="http://localhost:5173/" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Η κράτηση</a>
                        </div>
                    </td>
                  </tr>
                </table>
                `;
    case EMAIL_TYPES.BOOKING_REJECTION:
      return `
                <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
                  <tr>
                    <td>
                        <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Η κράτηση σου απορρίφθηκε.</h2>
                        <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.user.name}<br /><br />Δυστυχώς η κράτηση για το όχημα <strong>${emailInfo.info.car.make.name} ${emailInfo.info.car.model.name}</strong> απορρίφθηκε. Μπορείς να συνεχίσεις την αναζήτηση και να βρεις αλλά οχήματα που είναι διαθέσιμα εκείνη την χρονική περίοδο! <br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
                        <div style="margin-top: 40px; padding-bottom: 10px;">
                          <a href="http://localhost:5173/" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Η κράτηση</a>
                        </div>
                    </td>
                  </tr>
                </table>
         `;
    // case EMAIL_TYPES.BOOKING_CANCELEATION_BY_OWNER:
    //   return 'Ακύρωση από owner';
    //   return `
    //             <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
    //               <tr>
    //                 <td>
    //                     <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Η κράτηση σου ακυρώθηκε.</h2>
    //                     <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου Ηρακλή<br /><br />Δυστυχώς η κράτηση για το όχημα <strong></strong>για τις <strong>03/10 12:00 ως τις 15/10 11:00</strong> ακυρώθηκε. Έχουμε αποδεσμεύσει την κράτηση και το όχημα σου θα φαίνεται ξανά διαθέσιμο σε οποίο κάνει αναζήτηση αυτές τις ημερομηνίες στην περιοχή σου!<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
    //                     <div style="margin-top: 40px; padding-bottom: 10px;">
    //                       <a href="http://localhost:5173/" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Η κράτηση</a>
    //                     </div>
    //                 </td>
    //               </tr>
    //             </table>
    //      `;
    case EMAIL_TYPES.BOOKING_CANCELEATION_BY_RENTER:
      return `
                <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
                  <tr>
                    <td>
                        <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Η κράτηση σου ακυρώθηκε.</h2>
                        <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.user.name}<br /><br />Δυστυχώς η κράτηση για το όχημα <strong>${emailInfo.info.car.make.name} ${emailInfo.info.car.model.name}</strong> ακυρώθηκε από το χρήστη ${emailInfo.info.renter.name} ${emailInfo.info.renter.surname}. Έχουμε αποδεσμεύσει την κράτηση και το όχημα σου θα φαίνεται ξανά διαθέσιμο.<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
                        <div style="margin-top: 40px; padding-bottom: 10px;">
                          <a href="http://localhost:5173/" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Η κράτηση</a>
                        </div>
                    </td>
                  </tr>
                </table>
         `;
    case EMAIL_TYPES.REVIEW_PROMP_RENTER:
      return `
      <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
        <tr>
          <td>
              <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Η κράτηση ολοκληρώθηκε!</h2>
              <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.user.name}<br /><br />Η κράτηση για το όχημα <strong>${emailInfo.info.car.make.name} ${emailInfo.info.car.model.name}</strong> ακυρώθηκε του χρήστη ${emailInfo.info.renter.name} ${emailInfo.info.renter.surname} ολοκληρώθηκε. Πηγαίνοντας στο προφίλ σου και στις κρατήσεις σου μπορείς να δεις περισσότερες πληροφορίες και να αφήσεις την κρητική σου!<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
              <div style="margin-top: 40px; padding-bottom: 10px;">
                <a href="http://localhost:5173/" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Η κράτηση</a>
              </div>
          </td>
        </tr>
      </table>
`;
    case EMAIL_TYPES.REVIEW_PROMP_ONWER:
      return `
      <table style="width: 100%; max-width: 640px; margin: 0 auto; padding: 24px 48px;">
        <tr>
          <td>
              <h2 style="font-size: 24px; line-height: 32px; font-weight: 700; color: #000; margin-bottom: 24px;">Η κράτηση ολοκληρώθηκε!</h2>
              <div style="font-size: 16px; line-height: 24px; font-weight: 400; color: #595959;">Γειά σου ${emailInfo.user.name}<br /><br />Η κράτηση για το όχημα <strong>${emailInfo.info.car.make.name} ${emailInfo.info.car.model.name}</strong>  από το χρήστη ${emailInfo.info.renter.name} ${emailInfo.info.renter.surname} ολοκληρώθηκε. Πηγαίνοντας στο προφίλ σου και στις κρατήσεις του οχήματος σου μπορείς να δεις περισσότερες πληροφορίες και να αφήσεις την κριτική σου!<br /><br />Ευχαριστούμε,<br />η ομάδα του Car Share</div>
              <div style="margin-top: 40px; padding-bottom: 10px;">
                <a href="http://localhost:5173/" target="_blank" style="display: inline-block; padding: 8px 24px; border-radius: 8px; background-color: #000; font-size: 20px; line-height: 24px; font-weight: 400; color: #fff; text-decoration: none;">Η κράτηση</a>
              </div>
          </td>
        </tr>
      </table>
`;
    default:
      return 'verified';
  }
}

// ολοκληρώθηκε! Πηγαίνοντας στο προφίλ σου και στις κρατήσεις του οχήματος σου μπορείς να δεις περισσότερες πληροφορίες και να αφήσεις την κρητική σου!

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

  ejs.renderFile(
    __dirname + '/views/emailTemplate.ejs',
    { content: setBodyByEmailType(emailInfo) },
    function (err, template) {
      if (err) {
        console.log('Error: ', err);
      } else {
        let mailOptions = {
          from: {
            name: 'Car Share',
            address: process.env.APP_EMAIL,
          },
          to: emailInfo.user.email,
          subject: setSubjectByEmailType(emailInfo.type),
          html: template,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    }
  );
}

module.exports = {
  sendEmail,
};
