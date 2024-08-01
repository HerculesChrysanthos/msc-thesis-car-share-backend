const availabilityRepository = require('./availability.repository');
const moment = require('moment');

async function createAvailability(availability, carId) {
  const startDate = moment.utc(availability.startDate);
  const midnightOfStartDate = startDate.clone().startOf('day');

  const hoursBeforeStartDate = startDate.diff(midnightOfStartDate, 'hours');

  const endDate = moment.utc(availability.endDate);

  const midnightAfterEndDate = endDate.clone().add(1, 'day').startOf('day');

  const hoursAfterEndEndDate = Math.abs(
    endDate.diff(midnightAfterEndDate, 'hours')
  );

  const availabilities = [];

  const currentDate = startDate.clone();

  while (currentDate.isBefore(endDate)) {
    availabilities.push({
      car: carId,
      date: currentDate.toISOString(),
      status: 'AVAILABLE',
    });

    currentDate.add(1, 'hour');
  }

  return availabilityRepository.insertMultipleAvailabilities(availabilities);
}

async function findCarAvailabilitiesOnSpecificDates(car, startDate, endDate) {
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
      filters
    );

  if (carAvailabilities.length !== differenceInHours) {
    throw new Error('Το αυτοκίνητο δεν είναι διαθέσιμο τις επιλεγμένες ώρες.'); // 404
  }

  return carAvailabilities;
}

module.exports = {
  createAvailability,
  findCarAvailabilitiesOnSpecificDates,
};
