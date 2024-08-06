const mongoose = require('mongoose');
const availabilityRepository = require('./availability.repository');
const moment = require('moment');

async function createAvailability(availability, carId) {
  const startDate = moment.utc(availability.startDate);
  const endDate = moment.utc(availability.endDate);

  const availabilities = [];
  let createdAvailabilities;

  const currentDate = startDate.clone();

  while (currentDate.isBefore(endDate)) {
    availabilities.push({
      car: carId,
      date: currentDate.toISOString(),
      status: 'AVAILABLE',
    });

    currentDate.add(1, 'hour');
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    createdAvailabilities =
      await availabilityRepository.insertMultipleAvailabilities(
        availabilities,
        session
      );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return createdAvailabilities;
}

async function findCarAvailabilitiesOnSpecificDates(
  car,
  startDate,
  endDate,
  session
) {
  const start = moment.utc(startDate);
  const end = moment.utc(endDate);
  const differenceInHours = end.diff(start, 'hours');

  const filters = {
    startDate: start,
    endDate: end,
  };
  const carAvailabilities =
    await availabilityRepository.findCarAvailabilitiesOnSpecificDates(
      car,
      filters,
      session
    );

  if (carAvailabilities.length !== differenceInHours) {
    throw new Error('Το αυτοκίνητο δεν είναι διαθέσιμο τις επιλεγμένες ώρες.'); // 404
  }

  return carAvailabilities;
}

async function changeAvailabilitiesStatus(availabilities, status, session) {
  return availabilityRepository.changeAvailabilitiesStatus(
    availabilities,
    status,
    session
  );
}

async function findCarAvailabilities(car, dates) {
  return availabilityRepository.findCarAvailabilities(car, dates);
}

async function setBookingOnAvailabilities(booking, availabilities) {
  return availabilityRepository.setBookingOnAvailabilities(
    booking,
    availabilities
  );
}

module.exports = {
  createAvailability,
  findCarAvailabilitiesOnSpecificDates,
  changeAvailabilitiesStatus,
  findCarAvailabilities,
  setBookingOnAvailabilities,
};
