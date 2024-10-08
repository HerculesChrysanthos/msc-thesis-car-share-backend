const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const userRepository = require('../api/user/user.repository');
const nodemailer = require('./nodemailer');
const { EMAIL_TYPES } = require('../api/constants');

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/users/google/callback',
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      //console.log('Role parameter:', req.query.state);
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return cb(err, user);
      //   });

      const googleUser = {
        name: profile._json.given_name,
        surname: profile._json.family_name,
        email: profile._json.email,
        googleId: profile._json.sub,
        profileImage: { url: profile._json.picture },
        //role: req.query.state,
        verified: true,
      };

      const dbResult = await userRepository.createOrUpdateUserByGoogleId(
        googleUser
      );

      const dbUser = dbResult.value;

      if (!dbResult.lastErrorObject.updatedExisting) {
        const emailInfo = {
          type: EMAIL_TYPES.REGISTRATION_GOOGLE,
          user: dbUser,
        };
        nodemailer.sendEmail(emailInfo);
      }

      req.dbUser = dbUser;

      return cb(null, profile);
    }
  )
);
