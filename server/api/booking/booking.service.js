const availabilityService = require('../availability/availability.service');

async function createBooking(car, startDate, endDate) {
  return availabilityService.findCarAvailabilityOnSpecificDays(
    car,
    startDate,
    endDate
  );
}

module.exports = {
  createBooking,
};
