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

  const availbilities = [];

  const currentDate = startDate;

  while (currentDate.isSameOrBefore(endDate, 'day')) {
    const checkIfAvailabilityExist =
      await availabilityRepository.findAvailabilityByDay({
        date: currentDate.format('YYYY-MM-DD'),
        car: carId,
      });

    if (checkIfAvailabilityExist) {
      const error = new Error(
        `Η διαθεσιμότητα για την ημέρα ${currentDate.format(
          'YYYY-MM-DD'
        )} υπάρχει ήδη.`
      );

      error.status = 409;
      throw error;
    }

    const isFirstDay = currentDate.isSame(
      moment(availability.startDate),
      'day'
    );
    const isLastDay = currentDate.isSame(moment(availability.endDate), 'day');

    const hours = Array.from({ length: 24 }, (_, index) => ({
      hour: index,
      status:
        (isFirstDay && hoursBeforeStartDate < index + 1) ||
        (isLastDay && 24 - hoursAfterEndEndDate > index)
          ? 'available'
          : !isFirstDay && !isLastDay
          ? 'available'
          : 'unavailable',
    }));

    availbilities.push({
      car: carId,
      date: currentDate.format('YYYY-MM-DD'),
      hours,
    });

    currentDate.add(1, 'day');
  }

  return availabilityRepository.insertMultipleAvailabilities(availbilities);
}

module.exports = {
  createAvailability,
};
