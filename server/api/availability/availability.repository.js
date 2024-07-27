const Availability = require('./availability.model');

async function insertMultipleAvailabilities(availabilities) {
  return Availability.insertMany(availabilities);
}

async function findAvailabilityByDay({ date, car }) {
  return Availability.findOne({ date, car }).lean().exec();
}

module.exports = {
  insertMultipleAvailabilities,
  findAvailabilityByDay,
};
