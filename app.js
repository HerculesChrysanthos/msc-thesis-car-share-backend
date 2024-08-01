const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoute = require('./server/api/user/user.route');
const carRoute = require('./server/api/car/car.route');
const modelRouter = require('./server/api/model/model.router');
const makeRouter = require('./server/api/make/make.router');
const bookingRouter = require('./server/api/booking/booking.router');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(
  'mongodb+srv://herculeschrysanthos:' +
    process.env.MONGO_ATLAS_PASS +
    '@cluster0.j390io1.mongodb.net/carShare?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Tpe, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json();
  }
  next();
});

app.use('/api/users', userRoute);
app.use('/api/cars', carRoute);
app.use('/api/models', modelRouter);
app.use('/api/makes', makeRouter);
app.use('/api/bookings', bookingRouter);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log(error);

  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
