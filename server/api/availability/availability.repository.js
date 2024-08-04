const mongoose = require('mongoose');
const Availability = require('./availability.model');

async function insertMultipleAvailabilities(availabilities) {
  return Availability.insertMany(availabilities);
}

async function setBookingOnAvailabilities(booking, availabilities) {
  return Availability.updateMany(
    { _id: { $in: availabilities } },
    { $set: { booking } }
  );
}

async function findCarAvailabilities(car, dates) {
  return Availability.aggregate([
    {
      $match: {
        car: new mongoose.Types.ObjectId(car),
      },
    },
    {
      $project: {
        dateOnly: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$date',
          },
        },
        hour: {
          $hour: {
            date: '$date',
          },
        },
        status: 1,
        booking: 1,
      },
    },
    {
      $group: {
        _id: '$dateOnly',
        hours: {
          $push: {
            _id: '$_id',
            hour: '$hour',
            status: '$status',
            booking: '$booking',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        hours: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ]).exec();
}

async function findCarAvailabilitiesOnSpecificDates(car, filters, session) {
  const startDate = filters.startDate;
  const endDate = filters.endDate;

  const query = {
    car: new mongoose.Types.ObjectId(car),
    date: {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    },
    status: 'AVAILABLE',
  };

  return Availability.find(query, { _id: 1 }).session(session).lean().exec();
}

async function changeAvailabilitiesStatus(availabilities, status, session) {
  return Availability.updateMany(
    {
      _id: { $in: availabilities },
    },
    {
      $set: { status },
    },
    { session }
  );
}

module.exports = {
  insertMultipleAvailabilities,
  findCarAvailabilities,
  findCarAvailabilitiesOnSpecificDates,
  changeAvailabilitiesStatus,
  setBookingOnAvailabilities,
};
