const mongoose = require('mongoose');
const Availability = require('./availability.model');

async function insertMultipleAvailabilities(availabilities) {
  return Availability.insertMany(availabilities);
}

async function findAvailabilityByDay({ date, car }) {
  return Availability.findOne({ date, car }).lean().exec();
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
  findAvailabilityByDay,
  findCarAvailabilitiesOnSpecificDates,
  changeAvailabilitiesStatus,
};
